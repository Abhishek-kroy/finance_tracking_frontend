import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaChartLine, 
  FaWallet, 
  FaArrowRight, 
  FaArrowDown, 
  FaExclamationCircle, 
  FaCheckCircle,
  FaMoon,
  FaSun,
  FaInfoCircle,
  FaMoneyBillWave
} from "react-icons/fa";

const BudgetView = ({ mode, setMode }) => {
    const [budgets, setBudgets] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const isDarkMode = mode === 'dark';

    // Function to display toast notification
    const displayToast = (message, type = "success") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

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
                "https://financetrackerbackend-production.up.railway.app/api/v1/budgets/current-month",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                setBudgets(response.data.budgets);
                displayToast("Current month budgets loaded successfully");
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
                `https://financetrackerbackend-production.up.railway.app/api/v1/budgets/range?startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                setBudgets(response.data.budgets);
                displayToast("Custom date range budgets loaded successfully");
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    // Eye-friendly color schemes
    const colors = {
        dark: {
            background: "bg-gray-900",
            cardBg: "bg-gray-800",
            cardHover: "hover:bg-gray-750",
            itemBg: "bg-gray-700",
            itemHover: "hover:bg-gray-650",
            border: "border-gray-700",
            text: "text-gray-200",
            textSecondary: "text-gray-400",
            textMuted: "text-gray-500",
            primary: "text-indigo-400",
            primaryButton: "bg-indigo-600 hover:bg-indigo-700",
            progressBar: "bg-gray-600",
        },
        light: {
            background: "bg-gray-50",
            cardBg: "bg-white",
            cardHover: "hover:bg-gray-50",
            itemBg: "bg-gray-100",
            itemHover: "hover:bg-white",
            border: "border-gray-200",
            text: "text-gray-800",
            textSecondary: "text-gray-600",
            textMuted: "text-gray-500",
            primary: "text-indigo-600",
            primaryButton: "bg-indigo-500 hover:bg-indigo-600",
            progressBar: "bg-gray-200",
        }
    };

    const currentColors = isDarkMode ? colors.dark : colors.light;

    return (
        <div className={`min-h-screen ${isDarkMode 
            ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200' 
            : 'bg-gradient-to-b from-gray-50 to-white text-gray-800'} transition-colors duration-300`}>
            <div className="bg-gray-900 mt-16 mb-10"></div>
            <Navbar mode={mode} setMode={setMode} />
            
            {/* Toast Notification */}
            {showToast && (
                <motion.div 
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className={`fixed top-20 right-5 z-50 p-4 rounded-lg shadow-lg ${
                        toastType === "success" 
                            ? isDarkMode ? "bg-green-700" : "bg-green-500" 
                            : isDarkMode ? "bg-red-700" : "bg-red-500"
                    } text-white max-w-xs`}
                >
                    <div className="flex items-center space-x-2">
                        {toastType === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
                        <p>{toastMessage}</p>
                    </div>
                </motion.div>
            )}
            
            <div className="container mx-auto px-4 py-8">
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className={`max-w-5xl mx-auto`}
                >
                    <motion.div 
                        variants={itemVariants}
                        className={`mb-8 text-center`}
                    >
                        <div className="flex justify-center mb-6">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className={`${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'} p-4 rounded-full inline-block`}
                            >
                                <FaMoneyBillWave className={`text-4xl ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                            </motion.div>
                        </div>
                        <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                            Budget Dashboard
                        </h1>
                        <p className={`text-lg ${currentColors.textSecondary}`}>
                            Track your spending and stay on top of your financial goals
                        </p>
                    </motion.div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`${isDarkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'} border-l-4 text-red-${isDarkMode ? '300' : '700'} p-4 mb-6 rounded-r-lg shadow`}
                        >
                            <div className="flex items-center">
                                <FaExclamationCircle className="mr-2" />
                                <p>{error}</p>
                            </div>
                            <button 
                                onClick={() => setError("")} 
                                className={`mt-2 text-sm ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'} hover:underline`}
                            >
                                Dismiss
                            </button>
                        </motion.div>
                    )}

                    <motion.div 
                        variants={itemVariants}
                        className={`rounded-xl shadow-lg overflow-hidden ${currentColors.cardBg} mb-8 border ${currentColors.border}`}
                    >
                        <div className={`p-6 border-b ${currentColors.border}`}>
                            <div className="flex items-center mb-4">
                                <FaCalendarAlt className={`text-xl ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} mr-2`} />
                                <h2 className={`text-xl font-semibold ${currentColors.text}`}>
                                    Custom Date Range
                                </h2>
                            </div>
                            
                            <form onSubmit={fetchCustomBudgets} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={`block mb-2 font-medium ${currentColors.textSecondary}`}>
                                            Start Date
                                        </label>
                                        <div className={`relative rounded-lg overflow-hidden border ${currentColors.border} focus-within:ring-2 focus-within:ring-indigo-${isDarkMode ? '400' : '500'}`}>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className={`w-full px-4 py-3 outline-none ${isDarkMode 
                                                    ? 'bg-gray-700 text-white' 
                                                    : 'bg-white text-gray-800'}`}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={`block mb-2 font-medium ${currentColors.textSecondary}`}>
                                            End Date
                                        </label>
                                        <div className={`relative rounded-lg overflow-hidden border ${currentColors.border} focus-within:ring-2 focus-within:ring-indigo-${isDarkMode ? '400' : '500'}`}>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className={`w-full px-4 py-3 outline-none ${isDarkMode 
                                                    ? 'bg-gray-700 text-white' 
                                                    : 'bg-white text-gray-800'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    type="submit"
                                    className={`px-6 py-3 ${currentColors.primaryButton} text-white rounded-lg transition duration-300 flex items-center justify-center shadow-md`}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Loading...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            Get Budgets <FaArrowRight className="ml-2" />
                                        </span>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    <motion.div 
                        variants={itemVariants}
                        className={`rounded-xl shadow-lg overflow-hidden ${currentColors.cardBg} border ${currentColors.border}`}
                    >
                        <div className={`p-6 border-b ${currentColors.border}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <FaWallet className={`text-xl ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} mr-2`} />
                                    <h3 className={`text-xl font-semibold ${currentColors.text}`}>
                                        Budget Summary
                                    </h3>
                                </div>
                                <div className="flex items-center">
                                    <div className={`mr-3 flex items-center px-3 py-1 rounded-full ${isDarkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                                        <FaInfoCircle className="mr-1" />
                                        <span className="text-xs">Updated: {new Date().toLocaleDateString()}</span>
                                    </div>
                                    <motion.button
                                        onClick={fetchCurrentMonthBudgets}
                                        className={`px-3 py-1 text-sm rounded-full ${isDarkMode 
                                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition duration-200`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Refresh
                                    </motion.button>
                                </div>
                            </div>
                            
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <motion.div 
                                        animate={{ 
                                            rotate: 360
                                        }}
                                        transition={{ 
                                            duration: 1.5, 
                                            repeat: Infinity, 
                                            ease: "linear" 
                                        }}
                                        className={`h-12 w-12 rounded-full border-2 border-t-indigo-${isDarkMode ? '400' : '500'} border-r-transparent border-b-transparent border-l-transparent`}
                                    ></motion.div>
                                </div>
                            ) : budgets.length > 0 ? (
                                <motion.div 
                                    className="grid gap-6 md:grid-cols-2"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {budgets.map((budget) => {
                                        // Calculate total days, completed days, and remaining days
                                        const totalDays = Math.ceil(
                                            (new Date(budget.endDate) - new Date(budget.startDate)) / (1000 * 60 * 60 * 24)
                                        );
                                        const completedDays = Math.ceil(
                                            (new Date() - new Date(budget.startDate)) / (1000 * 60 * 60 * 24)
                                        );
                                        const progress = Math.min(
                                            Math.max((completedDays / totalDays) * 100, 0),
                                            100
                                        );
                                        
                                        // Calculate spending percentage
                                        const spendingPercentage = Math.min((budget.spentAmount / budget.amount) * 100, 100);
                                        
                                        // Define eye-friendly color scheme based on progress
                                        let spendingColor;
                                        let spendingTextColor;
                                        if (spendingPercentage <= 50) {
                                            spendingColor = isDarkMode ? "bg-emerald-600" : "bg-emerald-500";
                                            spendingTextColor = isDarkMode ? "text-emerald-300" : "text-emerald-700";
                                        } else if (spendingPercentage <= 80) {
                                            spendingColor = isDarkMode ? "bg-amber-600" : "bg-amber-500";
                                            spendingTextColor = isDarkMode ? "text-amber-300" : "text-amber-700";
                                        } else {
                                            spendingColor = isDarkMode ? "bg-rose-600" : "bg-rose-500";
                                            spendingTextColor = isDarkMode ? "text-rose-300" : "text-rose-700";
                                        }

                                        return (
                                            <motion.div
                                                key={budget._id}
                                                variants={itemVariants}
                                                className={`rounded-xl shadow-md overflow-hidden ${currentColors.itemBg} ${currentColors.itemHover} transition duration-300 border ${currentColors.border}`}
                                                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                            >
                                                <div className={`p-5 border-b ${currentColors.border}`}>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className={`text-lg font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                                            {budget.name}
                                                        </h4>
                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                            budget.spentAmount > budget.amount
                                                                ? isDarkMode ? 'bg-rose-900/40 text-rose-300' : 'bg-rose-100 text-rose-800'
                                                                : progress > 90
                                                                    ? isDarkMode ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-800'
                                                                    : isDarkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                                                        }`}>
                                                            {budget.spentAmount > budget.amount
                                                                ? 'Over Budget'
                                                                : progress > 90
                                                                    ? 'Ending Soon'
                                                                    : 'Active'}
                                                        </span>
                                                    </div>
                                                    <p className={`text-sm ${currentColors.textSecondary} mb-4`}>
                                                        {budget.description || "Monthly budget allocation"}
                                                    </p>
                                                    
                                                    <div className={`grid grid-cols-2 gap-4 mb-4 text-sm ${currentColors.textSecondary}`}>
                                                        <div>
                                                            <p>Budget:</p>
                                                            <p className={`text-xl font-bold ${currentColors.text}`}>
                                                                ${budget.amount.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p>Spent:</p>
                                                            <p className={`text-xl font-bold ${
                                                                budget.spentAmount > budget.amount 
                                                                    ? isDarkMode ? 'text-rose-400' : 'text-rose-600' 
                                                                    : currentColors.text
                                                            }`}>
                                                                ${budget.spentAmount.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className={`text-xs ${currentColors.textMuted} mb-2`}>
                                                        <div className="flex items-center">
                                                            <FaCalendarAlt className="mr-1" />
                                                            <span>
                                                                {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="p-5">
                                                    {/* Time Progress */}
                                                    <div className="mb-5">
                                                        <div className="flex justify-between mb-1 text-sm">
                                                            <span className={currentColors.textSecondary}>Time Elapsed</span>
                                                            <span className={`font-medium ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                                                                {Math.round(progress)}%
                                                            </span>
                                                        </div>
                                                        <div className={`h-2 rounded-full ${currentColors.progressBar} overflow-hidden`}>
                                                            <motion.div 
                                                                className={`h-full ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-500'} rounded-full`}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${progress}%` }}
                                                                transition={{ duration: 1, ease: "easeOut" }}
                                                            ></motion.div>
                                                        </div>
                                                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                                                            <span>
                                                                {completedDays > 0 ? `${completedDays} days completed` : "0 days completed"}
                                                            </span>
                                                            <span>
                                                                {Math.max(totalDays - completedDays, 0)} days left
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Spending Progress */}
                                                    <div>
                                                        <div className="flex justify-between mb-1 text-sm">
                                                            <span className={currentColors.textSecondary}>Budget Utilization</span>
                                                            <span className={`font-medium ${
                                                                spendingPercentage > 100
                                                                    ? isDarkMode ? 'text-rose-400' : 'text-rose-600'
                                                                    : spendingTextColor
                                                            }`}>
                                                                {Math.round(spendingPercentage)}%
                                                            </span>
                                                        </div>
                                                        <div className={`h-2 rounded-full ${currentColors.progressBar} overflow-hidden`}>
                                                            <motion.div 
                                                                className={`h-full ${spendingColor} rounded-full`}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${spendingPercentage}%` }}
                                                                transition={{ duration: 1, ease: "easeOut" }}
                                                            ></motion.div>
                                                        </div>
                                                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                                                            <span>${budget.spentAmount.toLocaleString()} spent</span>
                                                            <span>
                                                                ${Math.max(budget.amount - budget.spentAmount, 0).toLocaleString()} remaining
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    className={`text-center p-12 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <motion.div
                                        animate={{ 
                                            scale: [1, 1.05, 1],
                                            opacity: [0.8, 1, 0.8]
                                        }}
                                        transition={{ 
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="inline-block"
                                    >
                                        <FaChartLine className={`text-5xl mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                    </motion.div>
                                    <p className={`text-lg ${currentColors.textSecondary}`}>
                                        No budgets found for the selected period.
                                    </p>
                                    <p className={`mt-2 ${currentColors.textMuted}`}>
                                        Try adjusting your date range or create a new budget.
                                    </p>
                                    <motion.button
                                        onClick={fetchCurrentMonthBudgets}
                                        className={`mt-4 px-4 py-2 ${currentColors.primaryButton} text-white rounded-lg transition duration-300 inline-flex items-center`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaArrowDown className="mr-2" /> 
                                        Load Current Month
                                    </motion.button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                    
                    {/* Theme toggle button with animation */}
                    <motion.div 
                        className="fixed bottom-6 right-6 z-10"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, type: "spring" }}
                    >
                        <motion.button
                            onClick={() => setMode(isDarkMode ? 'light' : 'dark')}
                            className={`p-3 rounded-full shadow-lg ${
                                isDarkMode 
                                    ? 'bg-gray-700 text-yellow-300' 
                                    : 'bg-indigo-100 text-indigo-700'
                            }`}
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isDarkMode ? (
                                <FaSun className="text-xl" />
                            ) : (
                                <FaMoon className="text-xl" />
                            )}
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
            <Footer mode={mode} />
        </div>
    );
};

export default BudgetView;