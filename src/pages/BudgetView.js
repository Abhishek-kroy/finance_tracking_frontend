import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BudgetView = ({ mode, setMode }) => {
    const [budgets, setBudgets] = useState([]); // To store fetched budgets
    const [startDate, setStartDate] = useState(""); // Custom start date
    const [endDate, setEndDate] = useState(""); // Custom end date
    const [error, setError] = useState(""); // Error message
    const [loading, setLoading] = useState(false); // Loading indicator

    // Function to fetch budgets for the current month
    const fetchCurrentMonthBudgets = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Unauthorized! Please log in again.");
                return;
            }

            const response = await axios.get(
                "https://finance-tracker-backend-0h5z.onrender.com/api/v1/budgets/current-month",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                setBudgets(response.data.budgets);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "An error occurred while fetching budgets."
            );
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch budgets for a custom date range
    const fetchCustomBudgets = async (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            setError("Both start date and end date are required.");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            setError("Start date cannot be later than the end date.");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Unauthorized! Please log in again.");
                return;
            }

            const response = await axios.get(
                `https://finance-tracker-backend-0h5z.onrender.com/api/v1/budgets/range?startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                setBudgets(response.data.budgets);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "An error occurred while fetching budgets."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch budgets for the current month on component mount
        fetchCurrentMonthBudgets();
    }, []);

    return (
        <div className={`min-h-screen ${mode === 'dark' ? 'bg-gradient-to-b from-gray-900 to-grey-800 text-white' : 'bg-gradient-to-b from-gray-400 to-white text-gray-800'}`}>
            <Navbar mode={mode} setMode={setMode} />
            <div className="container mx-auto px-4 py-8">
                <div className={`px-4 py-6 rounded-lg `}>
                    <h2 className={`text-2xl font-semibold text-center mb-4 mode==="dark" ? 'bg-black':'bg-black'`}>
                        Budget Viewer
                    </h2>

                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                            <p>{error}</p>
                            <button onClick={() => setError("")} className="text-sm text-red-500 hover:underline">
                                Dismiss
                            </button>
                        </div>
                    )}
                    {loading && (
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}

                    {/* Form for custom date range */}
                    <form onSubmit={fetchCustomBudgets} className="mb-6">
                        <div className="flex flex-col justify-center gap-4">
                            <div>
                                <label className="block mb-1 font-medium">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-4 py-2 border rounded-lg w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-4 py-2 border rounded-lg w-full"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Get Budgets
                            </button>
                        </div>
                    </form>
                </div>


                {/* Budget List */}
                <div className={`flex mt-12 flex-col ${mode === 'light' ? 'bg-white text-white' : 'bg-gradient-to-b from-gray-600 to-grey-800 text-white'} rounded-lg shadow p-6`}>
                    <h3 className="text-lg font-semibold mb-4 text-center">This Month Budget</h3>
                    {budgets.length > 0 ? (
                        <div className="space-y-6">
                            {budgets.map((budget) => {
                                // Calculate total days, completed days, and remaining days
                                const totalDays = Math.ceil(
                                    (new Date(budget.endDate) - new Date(budget.startDate)) / (1000 * 60 * 60 * 24)
                                );
                                const completedDays = Math.ceil(
                                    (new Date() - new Date(budget.startDate)) / (1000 * 60 * 60 * 24)
                                );
                                const progress = Math.min(
                                    Math.max((completedDays / totalDays) * 100, 0), // Ensure valid range [0, 100]
                                    100
                                );

                                return (
                                    <div
                                        key={budget._id}
                                        className={`p-4 border rounded-lg ${mode === "dark" ? "border-gray-700 bg-gray-700" : "border-gray-300 bg-gray-50"} shadow`}
                                    >
                                        <h4 className="text-lg font-bold mb-2 text-blue-600">{budget.name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Total Amount: <span className="font-semibold">${budget.amount}</span>
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Spent Amount: <span className="font-semibold">${budget.spentAmount}</span>
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Date Range:{" "}
                                            <span className="font-semibold">
                                                {new Date(budget.startDate).toLocaleDateString()} -{" "}
                                                {new Date(budget.endDate).toLocaleDateString()}
                                            </span>
                                        </p>

                                        {/* Days Completed Progress Bar */}
                                        <div className="mt-4">
                                            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-4">
                                                <div
                                                    className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                                <span>
                                                    {completedDays > 0
                                                        ? `${completedDays} days completed`
                                                        : "0 days completed"}
                                                </span>
                                                <span>
                                                    {Math.max(totalDays - completedDays, 0)} days remaining
                                                </span>
                                            </div>
                                        </div>

                                        {/* Spending Progress Bar */}
                                        <div className="mt-4">
                                            <p className="text-sm mb-1">Spending Progress:</p>
                                            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-4">
                                                <div
                                                    className="h-4 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${Math.min((budget.spentAmount / budget.amount) * 100, 100)}%`,
                                                        backgroundColor:
                                                            budget.spentAmount / budget.amount <= 0.5
                                                                ? "green"
                                                                : budget.spentAmount / budget.amount <= 0.8
                                                                    ? "orange"
                                                                    : "red",
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                                <span>${budget.spentAmount} spent</span>
                                                <span>
                                                    ${Math.max(budget.amount - budget.spentAmount, 0)} remaining
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            No budgets found for the selected period.
                        </p>
                    )}
                </div>
            </div>
            <Footer mode={mode} />
        </div>
    );
};

export default BudgetView;