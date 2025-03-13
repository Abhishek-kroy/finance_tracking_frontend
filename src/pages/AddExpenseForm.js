import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaReceipt, FaMoneyBillWave, FaCalendarAlt, FaListAlt, FaInfoCircle, FaSave, FaArrowRight, FaChartLine } from 'react-icons/fa';

const AddExpenseForm = ({ mode, setMode }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [budgets, setBudgets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Fade-in animation configuration
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    };

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                setIsLoading(true);
                let token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get(
                    'https://finance-tracker-backend-0h5z.onrender.com/api/v1/budgets/current-month',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setBudgets(response.data.budgets);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching budgets:', error);
                setIsLoading(false);
            }
        };

        fetchBudgets();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const amountSpentInt = parseInt(amount);
            const response = await axios.post(
                'https://finance-tracker-backend-0h5z.onrender.com/api/v1/addexpense',
                {
                    budgetId: category,
                    amountSpent: amountSpentInt,
                    name,
                    amount,
                    date,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(`Expense added successfully! Budget updated. ${response.data.message}`);
            setMessageType('success');
            
            // Clear form after successful submission
            setName('');
            setAmount('');
            setCategory('');
            setDate('');
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                setMessage('');
            }, 5000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error adding expense');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    // Format currency input
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    };

    const isDarkMode = mode === 'dark';

    // Floating coin animation for the background
    const floatingCoins = Array(8).fill().map((_, i) => ({
        id: i,
        delay: i * 0.7,
        duration: 15 + Math.random() * 20,
        scale: 0.4 + Math.random() * 0.6,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100
    }));

    return (
        <div
            className={`${
                isDarkMode
                    ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white'
                    : 'bg-gradient-to-b from-blue-50 to-white text-gray-800'
            } min-h-screen transition-colors duration-300 relative overflow-hidden`}
        >
            {/* Background animated elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {floatingCoins.map(coin => (
                    <motion.div
                        key={coin.id}
                        className="absolute opacity-10"
                        initial={{ 
                            x: `${coin.initialX}%`, 
                            y: `${coin.initialY}%`,
                            scale: coin.scale 
                        }}
                        animate={{ 
                            y: [`${coin.initialY}%`, `${coin.initialY - 30}%`, `${coin.initialY}%`],
                            rotate: [0, 180, 360]
                        }}
                        transition={{ 
                            duration: coin.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: coin.delay
                        }}
                    >
                    </motion.div>
                ))}
                
                {/* Abstract financial chart background */}
                <svg className="absolute bottom-0 left-0 w-full h-40 opacity-5" viewBox="0 0 1200 200">
                    <path
                        d="M0,150 Q300,100 600,160 T1200,110 L1200,200 L0,200 Z"
                        fill={isDarkMode ? "#3B82F6" : "#2563EB"}
                    />
                    <path
                        d="M0,180 Q400,120 800,170 T1200,140 L1200,200 L0,200 Z"
                        fill={isDarkMode ? "#1D4ED8" : "#3B82F6"}
                        opacity="0.7"
                    />
                </svg>
            </div>

            <div className="bg-gray-900 mt-20 mb-10"></div>
            <Navbar mode={mode} setMode={setMode} />
            
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto"
                >
                    {/* Main form container */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        } lg:w-2/3 p-8 rounded-lg shadow-lg transition-colors duration-300 relative z-10`}
                    >
                        <div className="flex items-center mb-6">
                            <FaReceipt className={`text-2xl mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <h3 className="text-2xl font-bold">Add New Expense</h3>
                        </div>
                        
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mb-6 p-4 rounded-md ${
                                    messageType === 'success' 
                                        ? (isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800') 
                                        : (isDarkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800')
                                } border-l-4 ${messageType === 'success' ? 'border-green-500' : 'border-red-500'}`}
                            >
                                {message}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div {...fadeIn} className="mb-4">
                                <label htmlFor="name" className="flex items-center text-sm font-medium mb-2">
                                    <FaListAlt className="mr-2" />
                                    Expense Description
                                </label>
                                <div className={`relative rounded-md shadow-sm`}>
                                    <input
                                        type="text"
                                        id="name"
                                        className={`${
                                            isDarkMode ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-500'
                                        } border rounded-md p-3 pl-4 shadow-sm w-full transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                                        placeholder="What did you purchase? (e.g., Grocery shopping, Coffee)"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Enter a clear, descriptive name for this expense</p>
                            </motion.div>

                            <motion.div {...fadeIn} className="mb-4">
                                <label htmlFor="amount" className="flex items-center text-sm font-medium mb-2">
                                    <FaMoneyBillWave className="mr-2" />
                                    Amount Spent
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
                                    </div>
                                    <input
                                        type="number"
                                        id="amount"
                                        min="0"
                                        step="0.01"
                                        className={`${
                                            isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                                        } border rounded-md p-3 pl-8 shadow-sm w-full transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Enter the exact amount you spent</p>
                            </motion.div>

                            <motion.div {...fadeIn} className="mb-4">
                                <label htmlFor="category" className="flex items-center text-sm font-medium mb-2">
                                    <FaListAlt className="mr-2" />
                                    Budget Category
                                </label>
                                <select
                                    id="category"
                                    className={`${
                                        isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                                    } border rounded-md p-3 shadow-sm w-full transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    <option value="">Select a budget category</option>
                                    {budgets.map((budget) => (
                                        <option key={budget._id} value={budget._id}>
                                            {budget.name} - {formatCurrency(budget.amount - parseInt(budget.spentAmount))} Remaining
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select which budget this expense belongs to</p>
                            </motion.div>

                            <motion.div {...fadeIn} className="mb-4">
                                <label htmlFor="date" className="flex items-center text-sm font-medium mb-2">
                                    <FaCalendarAlt className="mr-2" />
                                    Transaction Date
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    className={`${
                                        isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                                    } border rounded-md p-3 shadow-sm w-full transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">When did this expense occur?</p>
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 px-4 ${
                                    isLoading 
                                        ? 'bg-gray-500' 
                                        : isDarkMode 
                                            ? 'bg-blue-600 hover:bg-blue-700' 
                                            : 'bg-blue-500 hover:bg-blue-600'
                                } text-white font-semibold rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 flex items-center justify-center`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <FaSave className="mr-2" />
                                        Save Expense
                                    </span>
                                )}
                            </motion.button>
                            
                            <div className="flex justify-center mt-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className={`flex items-center text-sm px-4 py-2 rounded-md ${
                                        isDarkMode 
                                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    } transition-colors duration-200`}
                                >
                                    <span>Return to Dashboard</span>
                                    <FaArrowRight className="ml-2" />
                                </motion.button>
                            </div>
                        </form>
                        
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="mt-6 p-4 border border-dashed rounded-md bg-opacity-50 text-center text-sm text-gray-600 dark:text-gray-400"
                        >
                            <p>Need to create a new budget category first?</p>
                            <button
                                onClick={() => navigate('/budget')}
                                className={`mt-2 text-sm px-4 py-2 rounded-md ${
                                    isDarkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'
                                } hover:opacity-90 transition-opacity duration-200`}
                            >
                                Create New Budget
                            </button>
                        </motion.div>
                    </motion.div>
                    
                    {/* Side explanation panel - always visible */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={`lg:w-1/3 ${
                            isDarkMode
                                ? 'bg-gray-700 text-gray-200'
                                : 'bg-blue-50 text-gray-700'
                        } p-6 rounded-lg shadow-lg border-l-4 ${isDarkMode ? 'border-blue-400' : 'border-blue-500'}`}
                    >
                        <div className="flex items-center mb-4">
                            <FaInfoCircle className={`text-xl mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <h4 className="text-xl font-semibold">How To Use This Form</h4>
                        </div>
                        
                        <div className="space-y-4">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="relative"
                            >
                                <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} text-white font-bold`}>1</div>
                                <div className="ml-8">
                                    <h5 className="font-semibold mb-1">Expense Description</h5>
                                    <p className="text-sm">Enter a clear description of what you purchased (e.g., "Grocery shopping at Walmart", "Monthly internet bill").</p>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="relative"
                            >
                                <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} text-white font-bold`}>2</div>
                                <div className="ml-8">
                                    <h5 className="font-semibold mb-1">Amount Spent</h5>
                                    <p className="text-sm">Enter the exact amount you spent in your local currency (numbers only).</p>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="relative"
                            >
                                <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} text-white font-bold`}>3</div>
                                <div className="ml-8">
                                    <h5 className="font-semibold mb-1">Budget Category</h5>
                                    <p className="text-sm">Select which of your budget categories this expense belongs to. The dropdown shows how much is remaining in each budget.</p>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="relative"
                            >
                                <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} text-white font-bold`}>4</div>
                                <div className="ml-8">
                                    <h5 className="font-semibold mb-1">Transaction Date</h5>
                                    <p className="text-sm">Select the date when the expense occurred. This helps with accurate monthly reporting.</p>
                                </div>
                            </motion.div>
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className={`mt-6 p-4 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-l-4 ${isDarkMode ? 'border-yellow-500' : 'border-yellow-400'}`}
                        >
                            <div className="flex items-start">
                                <FaChartLine className="text-yellow-500 mt-1 mr-2" />
                                <div>
                                    <p className="text-sm font-semibold mb-1">Pro Tip</p>
                                    <p className="text-xs">Regularly tracking your expenses helps you stay within budget and identify spending patterns over time.</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
            
            <Footer mode={mode} />
        </div>
    );
};

export default AddExpenseForm;