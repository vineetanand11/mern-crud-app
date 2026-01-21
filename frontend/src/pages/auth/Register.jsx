import { useEffect, useState } from "react";
import FormInput from "../../components/FormInput";
import SelectInput from "../../components/SelectInput";
import { getCountries, getStatesByCountry, getCitiesByState } from "../../services/location.services";
import { register } from "../../services/auth.services";



function Register() {
    const initialForm = {
        name: "",
        email: "",
        password: "",
        age: "",
        city: ""
    };
    const [form, setForm] = useState(initialForm);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [countryId, setCountryId] = useState("");
    const [stateId, setStateId] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(""); // Add this

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name] : value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    }

    const handleChangeCountry = (e) => {
        setCountryId(e.target.value);
    }

    const handleChangeState = (e) => {
        setStateId(e.target.value);
    }

    useEffect(() => {
        getCountries()
            .then(res => {
                const countryOptions = res.data.map(country => ({
                    value: country._id,
                    label:country.name
                }));
                setCountries(countryOptions)
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (!countryId) return;
        getStatesByCountry(countryId)
            .then(res => {
                const stateOptions = res.data.map(state => ({
                    value: state._id,
                    label:state.name
                }));
                setStates(stateOptions)
            })
            .catch(err => console.error(err));
    }, [countryId]);

    useEffect(() => {
        if (!stateId) return;
        getCitiesByState(stateId)
            .then(res => {
                const cityOptions = res.data.map(city => ({
                    value: city._id,
                    label:city.name
                }));
                setCities(cityOptions)
            })
            .catch(err => console.error(err));
    }, [stateId]);
    

    // Register User function
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await register(form);
            setForm(initialForm);
            setStates([]);
            setCities([]);
            setCountryId("");
            setStateId("");
            setErrors("");

            console.log("Registered:", res.data);
            setSuccess("Registration successful! You can now login."); // Set success message

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            
            // Optional: Clear success message after 2 seconds and redirect
            setTimeout(() => {
                setSuccess("");
                if (res?.data?.user?.role == 'admin') {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/users';
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1025] via-[#14162e] to-[#0b0c1a]">
            <div className="w-full max-w-md px-8 py-10 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-4xl font-bold text-white mb-2">Register User</h1>
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
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        error={errors.password}
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
                        Register
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

export default Register;