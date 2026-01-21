import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormInput from "../../components/FormInput";
import SelectInput from "../../components/SelectInput";
import { getCitiesByState, getCityById, getCountries, getStateById, getStatesByCountry } from "../../services/location.services";
import { getUserById, updateUser } from "../../services/user.services";
import { getUser } from "../../utils/auth";

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const initialForm = {
        name: "",
        email: "",
        age: "",
        city: ""
    }
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [countryId, setCountryId] = useState("");
    const [stateId, setStateId] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const currentUser = getUser();
    

    const handleChange = (e) => {
        const {name, value} = e.target;

        setForm({...form, [name] : value});
    }

    const handleChangeCountry = (e) => {
        setCountryId(e.target.value);
    }

    const handleChangeState = (e) => {
        setStateId(e.target.value);
    }

    useEffect(() => {
        if (!id) return;
        const loadUserData = async () => {
            try {
                setLoading(true);
                const res = await getUserById(id);
                const userData = res.data;

                setForm({
                    name: userData.name,
                    email: userData.email,
                    age: userData.age,
                    city: userData.city
                });

                // If city is populated with full data
                if (userData.city) {
                    try {
                        const cityRes = await getCityById(userData.city);
                        console.log(cityRes);
                        const cityStateId = cityRes?.data?.state;
                        setStateId(cityStateId);

                        const stateRes = await getStateById(cityStateId);
                        const stateCountryId =  stateRes?.data?.country;
                        setCountryId(stateCountryId)

                    } catch (error) {
                        console.error("Error loading location data:", error);
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error(err.message);
                setErrors("Failed to load user data");
                setLoading(false);
            }
        }
        loadUserData();
    }, [id]);

    useEffect(() => {
        getCountries()
            .then((res) => {
                const countryOptions = res.data.map(country => ({
                    value: country._id,
                    label:country.name
                }));
                setCountries(countryOptions)
            })
            .catch(err => console.error(err.message));
    }, []);

    useEffect(() => {
        if (!countryId) return;
        getStatesByCountry(countryId)
            .then((res) => {
                const stateOptions =  res.data.map((state) => ({
                    value: state._id,
                    label: state.name
                }));
                setStates(stateOptions);
            })
            .catch(err => console.error(err.message));
    }, [countryId]);

    useEffect(() => {
        if (!stateId) return;
        getCitiesByState(stateId)
            .then((res) => {
                const cityOptions = res.data.map((city) => ({
                    value: city._id,
                    label: city.name
                }));
                setCities(cityOptions);
            })
            .catch(err => console.error(err.message));
    }, [stateId]);

    // Update User function
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updateData = {
                name: form.name,
                email: form.email,
                age: form.age,
                city: form.city
            };

            // Only include password if it's not empty
            if (form.password && form.password.trim() !== '') {
                updateData.password = form.password;
            }

            await updateUser(id, updateData);

            setSuccess("User updated successfully!");

            // Optional: Clear success message after 2 seconds and redirect
            setTimeout(() => {
                setSuccess("");
                if (currentUser?.role == 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/users');
                }
                
            }, 2000);
        } catch (err) {
            console.error(err.response?.data || err.message);
            
            // Handle validation errors from backend
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                // Handle single error message
                if (err.response.data.message.includes('email') || 
                    err.response.data.message.includes('exists')) {
                    setErrors({ email: err.response.data.message });
                } else {
                    setErrors({ general: err.response.data.message });
                }
            } else {
                setErrors({ general: "Network error. Please try again." });
            }
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1025] via-[#14162e] to-[#0b0c1a]">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1025] via-[#14162e] to-[#0b0c1a]">
            <div className="w-full max-w-md px-8 py-10 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-4xl font-bold text-white mb-2">Edit User</h1>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormInput
                        label="Name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}  //{(e) => setForm({...form, name: e.tragetvalue}) }
                        error={errors.name}
                        required
                    />
                    <FormInput
                        label="Email Address"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                    />
                    <FormInput
                        label="Age"
                        name="age"
                        type="text"
                        value={form.age}
                        onChange={handleChange}
                        error={errors.age}
                    />
                    <SelectInput
                        label="Country"
                        name="country"
                        value={countryId}
                        onChange={handleChangeCountry}
                        options={countries}
                    />
                    <SelectInput
                        label="State"
                        name="state"
                        value={stateId}
                        onChange={handleChangeState}
                        options={states}
                    />
                    <SelectInput
                        label="City"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        options={cities}
                        error={errors.city}
                    />
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 py-2.5 font-semibold text-white hover:opacity-90 transition"
                    >
                        Update
                    </button>
                    {/* Success Message */}
                    {success && (
                        <div className="mt-4 p-3 rounded-lg bg-green-500/20 border border-green-500/50">
                            <p className="text-sm text-green-400 text-center">{success}</p>
                        </div>
                    )}

                    {/* General Error Message */}
                    {errors.general && (
                        <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50">
                            <p className="text-sm text-red-400 text-center">{errors.general}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default EditUser;