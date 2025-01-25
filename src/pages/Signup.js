import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const Signup = ({ mode, setMode }) => {
    const [name, setName] = useState(""); // Name state
    const [email, setEmail] = useState(""); // Email state
    const [password, setPassword] = useState(""); // Password state
    const [otp, setOtp] = useState(""); // OTP state
    const [otpSent, setOtpSent] = useState(false); // OTP sent state
    const [otpVerified, setOtpVerified] = useState(false); // OTP verified state
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(""); // Error message
    const [successMessage, setSuccessMessage] = useState(""); // Success message
    const navigate = useNavigate();

    const sendOtp = async () => {
        if (!email) {
            setError("Please enter a valid email.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const response = await axios.post("https://finance-tracker-backend-0h5z.onrender.com/api/v1/sendOtp", { email });
            if (response.data.success) {
                setOtpSent(true);
                setSuccessMessage("OTP sent to your email.");
            } else {
                setError(response.data.message || "Failed to send OTP. Please try again.");
            }
        } catch (err) {
            console.error("Error sending OTP:", err);
            setError("An error occurred while sending OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!otp) {
            setError("Please enter the OTP.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const response = await axios.post("https://finance-tracker-backend-0h5z.onrender.com/api/v1/verifyOtp", { email, otp });
            if (response.data.success) {
                setOtpVerified(true);
                setSuccessMessage("OTP verified successfully.");
            } else {
                setError(response.data.message || "Invalid OTP. Please try again.");
            }
        } catch (err) {
            console.error("Error verifying OTP:", err);
            setError("An error occurred while verifying OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async () => {
        if (!name) {
            setError("Please enter your name.");
            return;
        }

        if (!password) {
            setError("Please enter a password.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const response = await axios.post("https://finance-tracker-backend-0h5z.onrender.com/api/v1/register", { name, email, password });
            if (response.data.success) {
                setSuccessMessage("Signup successful! You can now log in.");
                navigate('/login')
            } else {
                setError(response.data.message || "Signup failed. Please try again.");
            }
        } catch (err) {
            console.error("Error during signup:", err);
            setError("An error occurred during signup. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
        <Helmet>
        <title>Finance Tracker - Your Ultimate Finance Management Tool</title>
        <meta
          name="description"
          content="Simplify your finances with Finance Tracker. Track expenses, set budgets, and stay on top of your financial goals."
        />
        <meta
          name="keywords"
          content="finance tracker, personal finance, expense management, budgeting tools"
        />
      </Helmet>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-gray-800 to-black">
                <div className="bg-white bg-opacity-30 backdrop-blur-lg border border-gray-300 rounded-lg shadow-xl w-full max-w-md transition-all transform hover:scale-105 p-8">
                    <h2 className="text-3xl font-semibold text-center text-indigo-600">Create Your Account</h2>

                    {/* Display error or success messages */}
                    {error && (
                        <p className="text-red-600 text-sm mt-4 bg-red-100 p-2 rounded-md border border-red-200">
                            {error}
                        </p>
                    )}
                    {successMessage && (
                        <p className="text-green-600 text-sm mt-4 bg-green-100 p-2 rounded-md border border-green-200">
                            {successMessage}
                        </p>
                    )}

                    {/* Name input */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="Enter your full name"
                            disabled={otpSent}
                        />
                    </div>

                    {/* Email input */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="Enter your email address"
                            disabled={otpSent}
                        />
                    </div>

                    {/* Password input */}
                    {!otpSent && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                placeholder="Create a password"
                            />
                        </div>
                    )}

                    {/* Send OTP button */}
                    {!otpSent && (
                        <button
                            onClick={sendOtp}
                            className="w-full mt-6 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    )}

                    {/* OTP input */}
                    {otpSent && !otpVerified && (
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                                maxLength={6}
                                placeholder="6-digit OTP"
                            />
                            <button
                                onClick={verifyOtp}
                                className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                                disabled={loading}
                            >
                                {loading ? "Verifying OTP..." : "Verify OTP"}
                            </button>
                        </div>
                    )}

                    {/* Signup button */}
                    {otpVerified && (
                        <button
                            onClick={handleSignup}
                            className="w-full mt-6 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            disabled={loading}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Signup;