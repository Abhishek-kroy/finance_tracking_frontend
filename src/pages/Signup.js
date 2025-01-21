import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Signup = ({mode,setMode}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if all fields are filled
        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required!");
            return;
        }
    
        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
    
        try {
            // Send signup data to the backend
            const response = await axios.post("https://finance-tracker-backend-0h5z.onrender.com/api/v1/register", {
                name,
                email,
                password,
            });
    
            // Handle successful signup
            if (response.data.success) {
                // Redirect to login page after successful signup
                navigate("/login");
            } else {
                setError(response.data.message); // Set the error message from the response
            }
        } catch (err) {
            // Handle any errors from the backend or during the request
            console.error("Signup Error: ", err);
            setError("An error occurred. Please try again later.");
        }
    };    

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar mode={mode} setMode={setMode}/>
            <div className="flex-grow min-w-[40vw] mb-4 mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white">
                <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

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

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-500 hover:text-blue-700">
                            Login
                        </a>
                    </p>
                </div>
            </div>
            <Footer mode={mode}/>
        </div>
    );
};

export default Signup;