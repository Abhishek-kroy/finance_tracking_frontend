import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWallet, FaCalendarAlt, FaChartLine, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BudgetForm = ({ mode, setMode }) => {
    // Form state
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [category, setCategory] = useState('general');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    // Categories for budget
    const budgetCategories = [
        { id: 'general', name: 'General', icon: <FaWallet /> },
        { id: 'groceries', name: 'Groceries', icon: <FaWallet /> },
        { id: 'transportation', name: 'Transportation', icon: <FaWallet /> },
        { id: 'entertainment', name: 'Entertainment', icon: <FaWallet /> },
        { id: 'utilities', name: 'Utilities', icon: <FaWallet /> },
        { id: 'healthcare', name: 'Healthcare', icon: <FaWallet /> },
        { id: 'education', name: 'Education', icon: <FaWallet /> },
        { id: 'savings', name: 'Savings', icon: <FaWallet /> },
        { id: 'other', name: 'Other', icon: <FaWallet /> }
    ];

    // Progress bar calculation
    const calculateProgress = () => {
        let filledFields = 0;
        const totalFields = 5; // name, amount, startDate, endDate, category
        
        if (name.trim()) filledFields++;
        if (amount) filledFields++;
        if (startDate) filledFields++;
        if (endDate) filledFields++;
        if (category) filledFields++;
        
        return (filledFields / totalFields) * 100;
    };

    // Reset error when form data changes
    useEffect(() => {
        setError('');
    }, [name, amount, startDate, endDate, category]);

    const nextStep = () => {
        if (step === 1) {
            if (!name || !amount) {
                setError('Please fill in all required fields before proceeding.');
                return;
            }
        }
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation before submission
        if (!name || !amount || !startDate || !endDate || !category) {
            setError('All fields are required!');
            return;
        }
        
        if (new Date(startDate) > new Date(endDate)) {
            setError('Start date cannot be later than the end date.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Retrieve token from localStorage
            let token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized! Please log in again.');
                navigate('/login');
                return;
            }

            // Send POST request to create budget (with additional fields)
            const response = await axios.post(
                'https://financetrackerbackend-production.up.railway.app/api/v1/create',
                { 
                    name, 
                    amount, 
                    startDate, 
                    endDate, 
                    category, 
                    description,
                    createdAt: new Date(),
                    spent: 0, // Initialize spent amount to 0
                    remaining: parseFloat(amount) // Initialize remaining amount
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Handle response
            if (response.data.success) {
                // Success toast
                toast.success('Budget created successfully!');
                
                // Reset form
                setName('');
                setAmount('');
                setStartDate('');
                setEndDate('');
                setCategory('general');
                setDescription('');
                setStep(1);
            } else {
                setError(response.data.message);
                toast.error(response.data.message || 'Failed to create budget');
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    // Handle token expiry
                    toast.error('Session expired. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login'); // Redirect to login page
                } else {
                    setError(err.response.data.message || 'An error occurred.');
                    toast.error(err.response.data.message || 'An error occurred.');
                }
            } else if (err.request) {
                setError('Network error. Please try again later.');
                toast.error('Network error. Please try again later.');
            } else {
                setError('Something went wrong.');
                toast.error('Something went wrong.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const slideIn = {
        initial: { x: step === 1 ? -300 : 300, opacity: 0 },
        animate: { x: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 120 } },
        exit: { x: step === 1 ? 300 : -300, opacity: 0, transition: { duration: 0.2 } }
    };

    return (
        <div
            className={`min-h-screen flex flex-col ${mode === 'dark' 
                ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' 
                : 'bg-gradient-to-b from-blue-50 to-white text-gray-800'}`}
        >

            <div className="bg-gray-900 mt-10 mb-10"></div>
            <Navbar mode={mode} setMode={setMode} />
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                theme={mode === 'dark' ? 'dark' : 'light'}
            />

            {/* Progress bar */}
            <div className="container mx-auto px-4 pt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                    <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${calculateProgress()}%` }}
                    ></div>
                </div>
            </div>

            <main className="flex flex-col md:flex-row flex-grow container mx-auto px-4 py-6 gap-8">
                {/* Left Section: Form */}
                <motion.div
                    className={`w-full md:w-2/3 mx-auto ${mode === 'dark'
                        ? 'bg-gray-800 text-white shadow-xl'
                        : 'bg-white text-gray-900 shadow-lg'
                    } rounded-lg p-6`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-center mb-6">
                        <div className={`p-3 rounded-full ${mode === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
                            <FaChartLine className="text-blue-500 text-2xl" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold ml-3">
                            Create a Budget
                        </h2>
                    </div>

                    {error && (
                        <motion.div 
                            className={`p-4 mb-4 rounded-lg flex items-center ${mode === 'dark' ? 'bg-red-900/50' : 'bg-red-100'} text-red-500`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FaExclamationTriangle className="mr-2" />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 && (
                            <motion.div 
                                className="space-y-6" 
                                {...slideIn}
                            >
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Basic Details</h3>
                                <div>
                                    <label
                                        className="block mb-1 font-medium"
                                        htmlFor="budget-name"
                                    >
                                        Budget Name*
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <FaWallet className="text-gray-400" />
                                        </span>
                                        <input
                                            id="budget-name"
                                            type="text"
                                            placeholder="Enter budget name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className={`w-full pl-10 px-4 py-3 border ${mode === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        className="block mb-1 font-medium"
                                        htmlFor="total-amount"
                                    >
                                        Total Amount*
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            $
                                        </span>
                                        <input
                                            id="total-amount"
                                            type="number"
                                            placeholder="Enter budget amount"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            required
                                            className={`w-full pl-10 px-4 py-3 border ${mode === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Category*
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {budgetCategories.map((cat) => (
                                            <div 
                                                key={cat.id}
                                                onClick={() => setCategory(cat.id)} 
                                                className={`cursor-pointer p-3 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
                                                    category === cat.id 
                                                        ? (mode === 'dark' ? 'bg-blue-600' : 'bg-blue-100 border-blue-500 border-2') 
                                                        : (mode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200')
                                                }`}
                                            >
                                                {cat.icon}
                                                <span className="mt-1 text-sm">{cat.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className={`w-full py-3 px-4 ${mode === 'dark'
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                            } font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                    >
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div 
                                className="space-y-6"
                                {...slideIn}
                            >
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Date and Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            className="block mb-1 font-medium"
                                            htmlFor="start-date"
                                        >
                                            Start Date*
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FaCalendarAlt className="text-gray-400" />
                                            </span>
                                            <input
                                                id="start-date"
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                required
                                                className={`w-full pl-10 px-4 py-3 border ${mode === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-1 font-medium"
                                            htmlFor="end-date"
                                        >
                                            End Date*
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FaCalendarAlt className="text-gray-400" />
                                            </span>
                                            <input
                                                id="end-date"
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                required
                                                className={`w-full pl-10 px-4 py-3 border ${mode === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        className="block mb-1 font-medium"
                                        htmlFor="description"
                                    >
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        id="description"
                                        placeholder="Add notes or details about this budget"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="3"
                                        className={`w-full px-4 py-3 border ${mode === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                    />
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className={`w-1/2 py-3 px-4 ${mode === 'dark'
                                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                            } font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200`}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-1/2 py-3 px-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''} ${mode === 'dark'
                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                            : 'bg-green-500 hover:bg-green-600 text-white'
                                            } font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 flex justify-center items-center`}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating...
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <FaCheck className="mr-2" />
                                                Create Budget
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </motion.div>

                {/* Right Section: Information */}
                <motion.div
                    className={`p-6 rounded-lg shadow-md w-full md:w-1/3 ${mode === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-800'
                        }`}
                    {...fadeInUp}
                >
                    <div className="sticky top-20">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center">
                            <FaChartLine className="mr-2 text-blue-500" /> 
                            Budget Guidelines
                        </h2>
                        
                        <div className={`p-4 mb-4 rounded-lg ${mode === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                            <p className="text-base mb-2">
                                <span className="font-semibold">Pro tip:</span> Consider using the 50/30/20 rule for budgeting:
                            </p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>50% for needs (housing, groceries, utilities)</li>
                                <li>30% for wants (entertainment, dining out)</li>
                                <li>20% for savings and debt repayment</li>
                            </ul>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2">How to Create an Effective Budget</h3>
                        <ul className="list-disc pl-6 space-y-3 mb-4">
                            <li>
                                <span className="font-semibold">Be specific:</span> Give your budget a clear, meaningful name so you can easily identify it later.
                            </li>
                            <li>
                                <span className="font-semibold">Be realistic:</span> Set an amount that's achievable based on your income and other expenses.
                            </li>
                            <li>
                                <span className="font-semibold">Choose appropriate dates:</span> Align your budget with your pay periods for better tracking.
                            </li>
                            <li>
                                <span className="font-semibold">Categorize correctly:</span> Proper categorization helps with analyzing spending patterns.
                            </li>
                        </ul>
                        
                        <div className={`mt-6 p-4 rounded-lg ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <h3 className="font-semibold mb-2">Track Your Progress</h3>
                            <p>
                                After creating a budget, you can track expenses against it from the Budgets page. Regular monitoring helps you stay on track with your financial goals.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer mode={mode} />
        </div>
    );
};

export default BudgetForm;