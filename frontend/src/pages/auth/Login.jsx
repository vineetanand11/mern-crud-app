import { useState } from "react";
import {Link} from "react-router-dom";
import FormInput from "../../components/FormInput";
import { login } from "../../services/auth.services";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await login({
                email: email,
                password: password
            });

            console.log("Login successful: ", res.data);
            // Store token
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            setSuccess("Login successful! Redirecting...");

            // Redirect after 1 second
            setTimeout(() => {
                if (res?.data?.user?.role == 'admin') {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/users';
                }
                
            }, 1000);
        } catch (err) {
            console.error("Login error:", err);

            // Handle validation errors from backend
            if (err.response?.data?.errors) { 
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrors({ general: err.response.data.message });
            } else {
                setErrors({ general: "Network error. Please try again." });
            }
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1025] via-[#14162e] to-[#0b0c1a]">
            <div className="w-full max-w-md px-8 py-10 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10">
                {/* Title */}
                <h2 className="text-center text-2xl font-bold text-white mb-8">
                    Sign in to your account
                </h2>
                <form onSubmit={submit} className="space-y-6">
                    {/* Email */}
                    <FormInput
                        label="Email address"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        required
                    />
                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="password" className="block text-white text-sm font-medium">
                                Password
                            </label>
                            <Link href="#" className="text-purple-500 text-sm font-medium hover:text-purple-400">
                                Forgot password?
                            </Link>
                        </div>
                        <FormInput 
                            name="name"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 py-2.5 font-semibold text-white hover:opacity-90 transition"
                    >
                        Sign in
                    </button>
                </form>
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
                {/* Footer */}
                 <p className="mt-8 text-center text-sm text-gray-400">
                    Not a member?{" "}
                    <Link to="/register" className="text-purple-500 font-medium hover:text-purple-400">
                        Register Here
                    </Link>
                 </p>
            </div>
        </div>
    );
}

export default Login;