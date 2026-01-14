const express =  require('express');
const Country = require("../models/Country");
const State = require("../models/State");
const City = require("../models/City");

const router = express.Router();


/* Get Country */
router.get("/countries", async (req, res) => {
    try {
        const countries = await Country.find();
        res.status(200).json(countries);
    } catch (error) {
        console.log("Countries API error:", error);
        res.status(500).json({message: error.message});
    } 
});

/* Get State */
router.get("/states/:countryId", async (req, res) => {
  try {
    const states = await State.find({ country: req.params.countryId });
    res.status(200).json(states);
  } catch (err) {
    console.error("States API error:", err);
    res.status(500).json({ message: err.message });
  }
});


/* Get City */
router.get("/cities/:stateId", async (req, res) => {
  try {
    const cities = await City.find({ state: req.params.stateId });
    res.status(200).json(cities);
  } catch (err) {
    console.error("Cities API error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* Get Country by ID */
router.get("/country/:id", async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
        if (!country) {
            return res.status(404).json({ message: "Country not found" });
        }
        res.status(200).json(country);
    } catch (err) {
        console.error("State API error:", err);
        res.status(500).json({ message: err.message });
    }
});

/* Get State by ID */
router.get("/state/:id", async (req, res) => {
    try {
        const state = await State.findById(req.params.id);
        if (!state) {
            return res.status(404).json({ message: "State not found" });
        }
        res.status(200).json(state);
    } catch (err) {
        console.error("State API error:", err);
        res.status(500).json({ message: err.message });
    }
});

/* Get City by ID */
router.get("/city/:id", async (req, res) => {
    try {
        const city = await City.findById(req.params.id);
        if (!city) {
            return res.status(404).json({ message: "City not found" });
        }
        res.status(200).json(city);
    } catch (err) {
        console.error("City API error:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
