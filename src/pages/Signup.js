import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

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
            const response = await axios.post(`https://finance-tracker-backend-0h5z.onrender.com/api/v1/sendOtp`, { email });
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
            const response = await axios.post("https://finance-tracker-backend-0h5z.onrender.com:4000/api/v1/verifyOtp", { email, otp });
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
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>

                    {/* Display error or success messages */}
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

                    {/* Name input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            disabled={otpSent}
                            required
                        />
                    </div>

                    {/* Email input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            disabled={otpSent}
                            required
                        />
                    </div>

                    {/* Password input */}
                    {(
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                    )}

                    {/* Send OTP button */}
                    {!otpSent && (
                        <button
                            onClick={sendOtp}
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    )}

                    {/* OTP input */}
                    {otpSent && !otpVerified && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                maxLength={6}
                                required
                            />
                            <button
                                onClick={verifyOtp}
                                className="w-full mt-4 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
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
                            className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
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