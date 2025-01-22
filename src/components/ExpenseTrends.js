import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Chart,
    PointElement,
    LineElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register required components
Chart.register(PointElement, LineElement, LinearScale, Title, Tooltip, Legend);

const ExpenseTrends = ({ mode }) => {
    const [expenses, setExpenses] = useState([]);
    const [chartData, setChartData] = useState({});
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    const getCurrentMonthDates = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        return { firstDay, lastDay };
    };

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const { firstDay, lastDay } = getCurrentMonthDates();
                const token = localStorage.getItem("token");
                if (!token) {
                    console.log("Unauthorized! Redirecting to login.");
                    navigate("/login");
                    return;
                }
    
                const response = await axios.get('https://finance-tracker-backend-0h5z.onrender.com/api/v1/getexpense', {
                    params: { startDate: firstDay, endDate: lastDay },
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                setExpenses(response.data.expenses);
                console.log(response.data.expenses);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        }; 
        fetchExpenses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures one-time execution    

    useEffect(() => {
        const showLinerChart = () => {
            const expenseData=expenses;
            expenseData.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Sort expenses by date

            const groupedExpenses = expenseData.reduce((acc, expense) => {
                const date = new Date(expense.date).toLocaleDateString();
                if (acc[date]) {
                    acc[date] += expense.amount;
                } else {
                    acc[date] = expense.amount;
                }
                return acc;
            }, {});

            // Convert grouped data to arrays
            const dates = Object.keys(groupedExpenses);
            const amounts = Object.values(groupedExpenses);

            setExpenses(expenseData);

            setChartData({
                labels: dates,
                datasets: [
                    {
                        label: 'Expenses Over Time',
                        data: amounts,
                        fill: false,
                        borderColor: '#FF5733',
                        tension: 0.1,
                    },
                ],
            });
        }
        showLinerChart();
    }, [expenses]);

    const handleFilter = async (e) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.');
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await axios.get('https://finance-tracker-backend-0h5z.onrender.com/api/v1/getexpense', {
                params: { startDate: startDate, endDate: endDate },
                headers: { Authorization: `Bearer ${token}` }
            });

            const expenseData = response.data.expenses;
            expenseData.sort((a, b) => new Date(a.date) - new Date(b.date));
            // Group expenses by date and sum the amounts for each date
            const groupedExpenses = expenseData.reduce((acc, expense) => {
                const date = new Date(expense.date).toLocaleDateString();
                if (acc[date]) {
                    acc[date] += expense.amount;
                } else {
                    acc[date] = expense.amount;
                }
                return acc;
            }, {});

            // Convert grouped data to arrays
            const dates = Object.keys(groupedExpenses);
            const amounts = Object.values(groupedExpenses);

            setExpenses(expenseData);

            // Prepare chart data
            setChartData({
                labels: dates,
                datasets: [
                    {
                        label: `Expenses from ${startDate} to ${endDate}`,
                        data: amounts,
                        fill: false,
                        borderColor: '#36A2EB',
                        tension: 0.1,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching filtered expenses:', error);
        }
    };
    return (
        <div className="chart-container">
            <h3 className="text-xl font-semibold mb-4">Expense Trends Over Time</h3>

            {/* Filter Form */}
            <form className="mb-6" onSubmit={handleFilter}>
                <div className="flex items-center gap-4">
                    <label>
                        Start Date:
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className={`border p-2 rounded ml-2 ${mode === "dark" ? 'bg-gray-600' : 'bg-white'}`}
                        />
                    </label>
                    <label>
                        End Date:
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className={`border p-2 rounded ml-2 ${mode === "dark" ? 'bg-gray-600' : 'bg-white'}`}
                        />
                    </label>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Filter
                    </button>
                </div>
            </form>

            {/* Line Chart */}
            {chartData.labels && chartData.labels.length > 0 ? (
                <Line data={chartData} />
            ) : (
                <p>No expense data available for the selected period.</p>
            )}
        </div>
    );
};

export default ExpenseTrends;