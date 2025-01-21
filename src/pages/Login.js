import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReCaptcha from "../components/ReCaptcha";

const Login = ({ mode, setMode }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const navigate = useNavigate();

    const ToSignuppage = () => {
        navigate('/signup');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for empty fields
        if (!email || !password) {
            setError("Both fields are required!");
            return;
        }

        if (!recaptchaValue) {
            setError("Please complete the reCAPTCHA verification.");
            return;
        }

        try {
            // Make the API call to login
            const response = await axios.post("https://finance-tracker-backend-0h5z.onrender.com/api/v1/login", {
                email,
                password,
                recaptchaToken: recaptchaValue,
            });

            // Check the success status in the response
            if (response.data.success) {
                // Store the token in localStorage (or sessionStorage if preferred)
                localStorage.setItem("token", response.data.token);

                // Redirect to the dashboard or home page
                navigate("/");
            } else {
                setError(response.data.message);
                setRecaptchaValue(null);
            }
        } catch (err) {
            // Handle any errors that occur during the request
            console.error("Login Error: ", err);
            setError("An error occurred. Please try again later.");
        }
    };


    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar mode={mode} setMode={setMode} />

            <div className="flex-grow min-w-[40vw] mb-4 mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white">
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <ReCaptcha
                        onVerify={(value) =>{ setRecaptchaValue(value);console.log("recaptcha token",value)}} // Set reCAPTCHA value
                    />

                    {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm">
                        Don't have an account?{" "}<button className="text-blue-500" onClick={ToSignuppage}>SignUp</button>
                    </p>
                </div>
            </div>

            {/* Footer fixed at the bottom */}
            <Footer mode={mode} />
        </div>
    );
};

export default Login;