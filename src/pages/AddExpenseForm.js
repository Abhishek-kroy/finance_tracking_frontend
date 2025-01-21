import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const AddExpenseForm = ({ mode, setMode }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const [budgets, setBudgets] = useState([]);
    const [showExplanation, setShowExplanation] = useState(false); // For toggling explanation visibility
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
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
            } catch (error) {
                console.error('Error fetching budgets:', error);
            }
        };

        fetchBudgets();
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error adding expense');
        }
    };

    return (
        <div
            className={`${
                mode === 'dark'
                    ? 'bg-gradient-to-b from-gray-900 to-grey-800 text-white'
                    : 'bg-gradient-to-b from-gray-400 to-white text-gray-800'
            } min-h-screen`}
        >
            <Navbar mode={mode} setMode={setMode} />
            <div
                className={`${
                    mode === 'dark' ? 'bg-gray-800' : 'bg-white'
                } max-w-2xl mx-auto p-6 rounded-lg shadow-md mt-8 mb-10`}
            >
                <h3 className="text-2xl font-semibold mb-6">Add New Expense</h3>
                
                {/* Toggle Explanation Button */}
                <button
                    onClick={() => setShowExplanation((prev) => !prev)}
                    className="text-sm text-blue-500 underline mb-4"
                >
                    {showExplanation ? 'Hide Explanation' : 'What does this form do?'}
                </button>

                {/* Explanation Div */}
                {showExplanation && (
                    <div
                        className={`${
                            mode === 'dark'
                                ? 'bg-gray-700 text-white'
                                : 'bg-gray-100 text-gray-800'
                        } p-4 mb-6 rounded-md`}
                    >
                        <p>
                            <strong>Expense Name:</strong> The name of the expense you are adding (e.g., 'Groceries').<br />
                            <strong>Amount:</strong> The total cost of the expense in your local currency.<br />
                            <strong>Category (Budget):</strong> Select a budget category from the dropdown. This ensures the expense is tied to a specific budget, and the remaining amount will be calculated accordingly.<br />
                            <strong>Expense Date:</strong> The date the expense was incurred. Use the calendar picker for accurate entry.<br />
                            Once you fill out all fields and submit, the expense will be added, and your budget will update automatically.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Expense Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className={`${
                                mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'
                            } border rounded-md p-3 shadow-sm w-full`}
                            placeholder="Expense Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="amount" className="block text-sm font-medium mb-2">
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            className={`${
                                mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'
                            } border rounded-md p-3 shadow-sm w-full`}
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium mb-2">
                            Select Category (Budget)
                        </label>
                        <select
                            id="category"
                            className={`${
                                mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'
                            } border rounded-md p-3 shadow-sm w-full`}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select Budget</option>
                            {budgets.map((budget) => (
                                <option key={budget._id} value={budget._id}>
                                    {budget.name} - $ {budget.amount - parseInt(budget.spentAmount)} Remaining
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="date" className="block text-sm font-medium mb-2">
                            Expense Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            className={`${
                                mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'
                            } border rounded-md p-3 shadow-sm w-full`}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg focus:ring-2"
                    >
                        Add Expense
                    </button>
                    {message && (
                        <p className="mt-4 text-sm text-center text-red-600 dark:text-red-400">{message}</p>
                    )}
                </form>
            </div>
            <Footer mode={mode} />
        </div>
    );
};

export default AddExpenseForm;