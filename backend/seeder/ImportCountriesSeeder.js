const mongoose = require("mongoose");
const axios = require("axios");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const Country = require("../models/Country");
const State = require("../models/State");
const City = require("../models/City");

const MONGODB_URI = process.env.MONGODB_URI;

// Configure axios for better performance
const axiosInstance = axios.create({
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Function to fetch all countries with states
async function fetchCountriesWithStates() {
  try {
    console.log('Fetching countries with states...');
    const response = await axiosInstance.get('https://countriesnow.space/api/v0.1/countries/states', {
      headers: {
        'Accept': 'application/json'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Primary API failed, trying alternative...');
    // Alternative: Use a local JSON file approach
    const altResponse = await axiosInstance.post('https://countriesnow.space/api/v0.1/countries/states', {});
    return altResponse.data.data;
  }
}

// Function to fetch cities for multiple states concurrently
async function fetchCitiesBatch(requests) {
  const results = await Promise.allSettled(
    requests.map(req => 
      axiosInstance.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
        country: req.country,
        state: req.state
      }).then(res => ({
        country: req.country,
        state: req.state,
        stateId: req.stateId,
        cities: res.data.data || []
      })).catch(() => ({
        country: req.country,
        state: req.state,
        stateId: req.stateId,
        cities: []
      }))
    )
  );
  
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
}

// Function to get country codes
async function fetchCountryCodes() {
  try {
    console.log('Fetching country codes...');
    const response = await axiosInstance.get('https://restcountries.com/v3.1/all', {
      headers: {
        'Accept': 'application/json'
      }
    });
    const codeMap = {};
    response.data.forEach(country => {
      codeMap[country.name.common] = country.cca2;
    });
    return codeMap;
  } catch (error) {
    console.log('Could not fetch country codes, continuing without codes...');
    return {};
  }
}

// Main import function with parallelization
async function importAllData() {
  const startTime = Date.now();
  
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      Country.deleteMany({}),
      State.deleteMany({}),
      City.deleteMany({})
    ]);
    console.log('✓ Cleared all collections\n');

    // Fetch data
    const [countriesData, countryCodes] = await Promise.all([
      fetchCountriesWithStates(),
      fetchCountryCodes()
    ]);
    console.log(`✓ Fetched ${countriesData.length} countries\n`);

    let totalCountries = 0;
    let totalStates = 0;
    let totalCities = 0;

    // Step 1: Bulk insert all countries
    console.log('Step 1/3: Inserting all countries...');
    
    // Remove duplicates by name
    const uniqueCountries = new Map();
    countriesData.forEach(cd => {
      if (!uniqueCountries.has(cd.name)) {
        uniqueCountries.set(cd.name, cd);
      } else {
        console.log(`  ⚠ Skipping duplicate: ${cd.name}`);
      }
    });
    
    const countryDocs = Array.from(uniqueCountries.values()).map(cd => ({
      _id: new mongoose.Types.ObjectId(),
      name: cd.name,
      code: countryCodes[cd.name] || cd.iso2 || cd.iso3 || ''
    }));
    
    await Country.insertMany(countryDocs);
    totalCountries = countryDocs.length;
    console.log(`✓ Inserted ${totalCountries} countries\n`);

    // Create country name to ID map
    const countryMap = new Map();
    Array.from(uniqueCountries.values()).forEach((cd, index) => {
      countryMap.set(cd.name, {
        id: countryDocs[index]._id,
        states: cd.states || []
      });
    });

    // Step 2: Bulk insert all states
    console.log('Step 2/3: Inserting all states...');
    const stateDocs = [];
    const stateRequests = [];
    
    countryMap.forEach((countryInfo, countryName) => {
      countryInfo.states.forEach(stateData => {
        const stateId = new mongoose.Types.ObjectId();
        stateDocs.push({
          _id: stateId,
          name: stateData.name,
          country: countryInfo.id
        });
        stateRequests.push({
          country: countryName,
          state: stateData.name,
          stateId: stateId
        });
      });
    });

    if (stateDocs.length > 0) {
      await State.insertMany(stateDocs);
      totalStates = stateDocs.length;
      console.log(`✓ Inserted ${totalStates} states\n`);
    }

    // Step 3: Fetch and insert cities with concurrency
    console.log('Step 3/3: Fetching and inserting cities...');
    console.log('This uses parallel requests for faster processing\n');
    
    const concurrentBatchSize = 20; // Fetch 20 states at a time
    const totalRequests = stateRequests.length;
    let processed = 0;
    
    for (let i = 0; i < stateRequests.length; i += concurrentBatchSize) {
      const batch = stateRequests.slice(i, i + concurrentBatchSize);
      const results = await fetchCitiesBatch(batch);
      
      // Prepare city documents
      const cityDocs = [];
      results.forEach(result => {
        if (result.cities.length > 0) {
          result.cities.forEach(cityName => {
            cityDocs.push({
              name: cityName,
              state: result.stateId
            });
          });
        }
      });

      // Bulk insert cities
      if (cityDocs.length > 0) {
        await City.insertMany(cityDocs, { ordered: false });
        totalCities += cityDocs.length;
      }

      processed += batch.length;
      const percentage = ((processed / totalRequests) * 100).toFixed(1);
      console.log(`Progress: ${processed}/${totalRequests} states (${percentage}%) - ${totalCities} cities inserted`);
      
      // Small delay to respect API limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const elapsedTime = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

    console.log('\n' + '='.repeat(60));
    console.log('IMPORT COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`Total Time: ${elapsedTime} minutes`);
    console.log(`Total Countries: ${totalCountries}`);
    console.log(`Total States: ${totalStates}`);
    console.log(`Total Cities: ${totalCities}`);
    console.log('='.repeat(60));

    // Verify database
    const dbCounts = {
      countries: await Country.countDocuments(),
      states: await State.countDocuments(),
      cities: await City.countDocuments()
    };

    console.log('\nDatabase Verification:');
    console.log(`Countries: ${dbCounts.countries}`);
    console.log(`States: ${dbCounts.states}`);
    console.log(`Cities: ${dbCounts.cities}`);

    // Sample data - India
    console.log('\n' + '='.repeat(60));
    console.log('Sample: India with correct State-City mapping');
    console.log('='.repeat(60));
    
    const india = await Country.findOne({ name: 'India' });
    if (india) {
      console.log(`\n📍 ${india.name} (${india.code})`);
      const indianStates = await State.find({ country: india._id }).limit(2);
      
      for (const state of indianStates) {
        const cityCount = await City.countDocuments({ state: state._id });
        console.log(`  ├─ ${state.name} (${cityCount} cities)`);
        
        const cities = await City.find({ state: state._id }).limit(3);
        cities.forEach((city, idx) => {
          const prefix = idx === cities.length - 1 ? '  │  └─' : '  │  ├─';
          console.log(`${prefix} ${city.name}`);
        });
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  }
}

// Run the import
console.log('='.repeat(60));
console.log('OPTIMIZED DATA IMPORT - PARALLEL PROCESSING');
console.log('='.repeat(60));
console.log('Features:');
console.log('• Bulk inserts for countries and states');
console.log('• Parallel API requests (20 at a time)');
console.log('• Correct State-City mapping');
console.log('• Estimated time: 5-8 minutes\n');
console.log('Starting...\n');
importAllData();
