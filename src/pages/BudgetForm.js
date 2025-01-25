import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
const BudgetForm = ({ mode, setMode }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation before submission
        if (!name || !amount || !startDate || !endDate) {
            setError('All fields are required!');
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            setError('Start date cannot be later than the end date.');
            return;
        }

        try {
            // Retrieve token from localStorage
            let token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized! Please log in again.');
                navigate('/login');
                return;
            }

            // Send POST request to create budget
            const response = await axios.post(
                'https://finance-tracker-backend-0h5z.onrender.com/api/v1/create',
                { name, amount, startDate, endDate },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Handle response
            if (response.data.success) {
                // Success feedback and reset form
                alert('Budget created successfully!');
                setName('');
                setAmount('');
                setStartDate('');
                setEndDate('');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    // Handle token expiry
                    setError('Session expired. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login'); // Redirect to login page
                } else {
                    setError(err.response.data.message || 'An error occurred.');
                }
            } else if (err.request) {
                setError('Network error. Please try again later.');
            } else {
                setError('Something went wrong.');
            }
        }
    };

    return (
        <div
            className={`min-h-screen flex flex-col ${mode === 'dark' ? 'bg-gradient-to-b from-gray-900 to-grey-800 text-white' : 'bg-gradient-to-b from-gray-400 to-white text-gray-800'
                }`}
        >
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
            <Navbar mode={mode} setMode={setMode} />
            <main className="flex flex-col md:flex-row flex-grow container mx-auto px-4 py-8 gap-8">
    {/* Left Section: Form */}
    <div
        className={`w-full md:w-2/3 mx-auto ${mode === 'dark'
            ? 'bg-gray-800 text-white shadow-xl'
            : 'bg-white text-gray-900 shadow-lg'
            } rounded-lg p-6`}
    >
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">
            Create a Budget
        </h2>
        {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label
                    className="block mb-1 font-medium"
                    htmlFor="budget-name"
                >
                    Budget Name
                </label>
                <input
                    id="budget-name"
                    type="text"
                    placeholder="Budget Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={`w-full px-4 py-2 border ${mode === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
            </div>
            <div>
                <label
                    className="block mb-1 font-medium"
                    htmlFor="total-amount"
                >
                    Total Amount
                </label>
                <input
                    id="total-amount"
                    type="number"
                    placeholder="Total Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className={`w-full px-4 py-2 border ${mode === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
            </div>
            <div>
                <label
                    className="block mb-1 font-medium"
                    htmlFor="start-date"
                >
                    Start Date
                </label>
                <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className={`w-full px-4 py-2 border ${mode === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
            </div>
            <div>
                <label
                    className="block mb-1 font-medium"
                    htmlFor="end-date"
                >
                    End Date
                </label>
                <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className={`w-full px-4 py-2 border ${mode === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
            </div>
            <button
                type="submit"
                className={`w-full py-2 px-4 ${mode === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
                Create Budget
            </button>
        </form>
    </div>

    {/* Right Section: Information */}
    <div
        className={`p-6 rounded-lg shadow-md w-full md:w-1/3 ${mode === 'dark'
            ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white'
            : 'bg-white text-gray-800'
            }`}
    >
        <h2 className="text-lg md:text-2xl font-bold mb-4">Create Your Budget</h2>
        <p className="text-base md:text-lg mb-4">
            To create a budget, provide the following details:
        </p>
        <ul className="list-disc pl-6 space-y-2">
            <li>
                <span className="font-semibold">Budget Name:</span> Give your budget a meaningful name (e.g., "Groceries", "Vacation").
            </li>
            <li>
                <span className="font-semibold">Total Amount:</span> Set the total amount you plan to allocate for this budget.
            </li>
            <li>
                <span className="font-semibold">Start Date:</span> Choose the date when this budget begins.
            </li>
            <li>
                <span className="font-semibold">End Date:</span> Specify when this budget ends.
            </li>
        </ul>
        <p className="mt-4">
            Once you fill in these details, you can create a budget to track your spending effectively.
        </p>
    </div>
</main>
            <Footer mode={mode} />
        </div>
    );
};

export default BudgetForm;