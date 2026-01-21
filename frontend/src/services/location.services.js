import axios from "axios";

const API_URI = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: API_URI
});

export const getCountries = () => {
    return api.get("/location/countries");
}

export const getStatesByCountry = (countryId) => {
    return api.get(`/location/states/${countryId}`);
}

export const getCitiesByState = (stateId) => {
    return api.get(`/location/cities/${stateId}`);
}

export const getCountryById = (id) => {
    return api.get(`/location/country/${id}`);
}

export const getStateById = (id) => {
    return api.get(`/location/state/${id}`);
}

export const getCityById = (id) => {
    return api.get(`/location/city/${id}`);
}