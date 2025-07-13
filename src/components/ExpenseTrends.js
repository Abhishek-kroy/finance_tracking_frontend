import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Chart,
    PointElement,
    LineElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

// Register required components
Chart.register(
    PointElement, 
    LineElement, 
    LinearScale, 
    CategoryScale,
    Title, 
    Tooltip, 
    Legend,
    Filler
);

const ExpenseTrends = ({ mode, period = 'month' }) => {
    const [expenses, setExpenses] = useState([]);
    const [chartData, setChartData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [comparePrevious, setComparePrevious] = useState(false);
    const [aggregateBy, setAggregateBy] = useState('day'); // 'day', 'week', 'month'
    const navigate = useNavigate();

    const getDateRange = () => {
        const now = new Date();
        let firstDay, lastDay;
        
        if (period === 'week') {
            // Set to the beginning of the current week (Sunday)
            const day = now.getDay(); // 0 = Sunday, 6 = Saturday
            firstDay = new Date(now);
            firstDay.setDate(now.getDate() - day);
            firstDay.setHours(0, 0, 0, 0);
            
            lastDay = new Date(firstDay);
            lastDay.setDate(firstDay.getDate() + 6);
            lastDay.setHours(23, 59, 59, 999);
        } else if (period === 'month') {
            firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            lastDay.setHours(23, 59, 59, 999);
        } else if (period === 'year') {
            firstDay = new Date(now.getFullYear(), 0, 1);
            lastDay = new Date(now.getFullYear(), 11, 31);
            lastDay.setHours(23, 59, 59, 999);
        }
        
        return { 
            firstDay: firstDay.toISOString().split('T')[0], 
            lastDay: lastDay.toISOString().split('T')[0] 
        };
    };

    const getPreviousPeriodRange = () => {
        const now = new Date();
        let firstDay, lastDay;
        
        if (period === 'week') {
            // Previous week
            const day = now.getDay();
            firstDay = new Date(now);
            firstDay.setDate(now.getDate() - day - 7);
            firstDay.setHours(0, 0, 0, 0);
            
            lastDay = new Date(firstDay);
            lastDay.setDate(firstDay.getDate() + 6);
            lastDay.setHours(23, 59, 59, 999);
        } else if (period === 'month') {
            // Previous month
            firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
            lastDay.setHours(23, 59, 59, 999);
        } else if (period === 'year') {
            // Previous year
            firstDay = new Date(now.getFullYear() - 1, 0, 1);
            lastDay = new Date(now.getFullYear() - 1, 11, 31);
            lastDay.setHours(23, 59, 59, 999);
        }
        
        return { 
            firstDay: firstDay.toISOString().split('T')[0], 
            lastDay: lastDay.toISOString().split('T')[0] 
        };
    };

    useEffect(() => {
        const fetchExpenses = async () => {
            setIsLoading(true);
            try {
                const { firstDay, lastDay } = getDateRange();
                setStartDate(firstDay);
                setEndDate(lastDay);
                
                const token = localStorage.getItem("token");
                if (!token) {
                    console.log("Unauthorized! Redirecting to login.");
                    navigate("/login");
                    return;
                }
    
                const response = await axios.get('https://financetrackerbackend-production.up.railway.app/api/v1/getexpense', {
                    params: { startDate: firstDay, endDate: lastDay },
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                setExpenses(response.data.expenses || []);
                
                if (comparePrevious) {
                    fetchPreviousPeriodData();
                } else {
                    processExpenseData(response.data.expenses || []);
                }
            } catch (error) {
                console.error('Error fetching expenses:', error);
                setIsLoading(false);
            }
        };

        const fetchPreviousPeriodData = async () => {
            try {
                const { firstDay, lastDay } = getPreviousPeriodRange();
                
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }
    
                const response = await axios.get('https://financetrackerbackend-production.up.railway.app/api/v1/getexpense', {
                    params: { startDate: firstDay, endDate: lastDay },
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                processExpenseDataWithComparison(expenses, response.data.expenses || []);
            } catch (error) {
                console.error('Error fetching previous period data:', error);
                processExpenseData(expenses);
            }
        };
        
        fetchExpenses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period, comparePrevious, aggregateBy, navigate]);

    const aggregateExpenses = (expenses, aggregation) => {
        if (!expenses || expenses.length === 0) return {};
        
        // Sort expenses by date
        expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return expenses.reduce((acc, expense) => {
            let key;
            const expenseDate = new Date(expense.date);
            
            if (aggregation === 'day') {
                key = expenseDate.toLocaleDateString();
            } else if (aggregation === 'week') {
                // Get the week number
                const firstDayOfYear = new Date(expenseDate.getFullYear(), 0, 1);
                const pastDaysOfYear = (expenseDate - firstDayOfYear) / 86400000;
                const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
                key = `Week ${weekNum}`;
            } else if (aggregation === 'month') {
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                key = `${monthNames[expenseDate.getMonth()]} ${expenseDate.getFullYear()}`;
            }
            
            if (acc[key]) {
                acc[key] += expense.amount;
            } else {
                acc[key] = expense.amount;
            }
            return acc;
        }, {});
    };

    const processExpenseData = (expenseData) => {
        const groupedExpenses = aggregateExpenses(expenseData, aggregateBy);
        
        // Convert grouped data to arrays
        const labels = Object.keys(groupedExpenses);
        const amounts = Object.values(groupedExpenses);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: `Expenses (${period})`,
                    data: amounts,
                    fill: {
                        target: 'origin',
                        above: 'rgba(53, 162, 235, 0.2)',
                    },
                    borderColor: '#36A2EB',
                    tension: 0.3,
                    pointBackgroundColor: '#36A2EB',
                    pointBorderColor: '#fff',
                    pointRadius: 5,
                    pointHoverRadius: 8,
                },
            ],
        });
        
        setIsLoading(false);
    };
    
    const processExpenseDataWithComparison = (currentData, previousData) => {
        const currentGrouped = aggregateExpenses(currentData, aggregateBy);
        const previousGrouped = aggregateExpenses(previousData, aggregateBy);
        
        // For comparison, we'll use the current period's labels
        const labels = Object.keys(currentGrouped);
        const currentAmounts = Object.values(currentGrouped);
        
        // For previous period, we'll match the number of data points
        // but not necessarily the exact labels (e.g., comparing days of different months)
        // const previousLabels = Object.keys(previousGrouped);
        const previousAmounts = Object.values(previousGrouped);
        
        // If previous period has fewer data points, we'll extend with nulls
        // If it has more, we'll truncate
        const normalizedPreviousAmounts = previousAmounts.length >= currentAmounts.length 
            ? previousAmounts.slice(0, currentAmounts.length) 
            : [...previousAmounts, ...Array(currentAmounts.length - previousAmounts.length).fill(null)];

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: `Current ${period}`,
                    data: currentAmounts,
                    fill: false,
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    tension: 0.3,
                    pointBackgroundColor: '#36A2EB',
                    pointBorderColor: '#fff',
                    pointRadius: 5,
                    pointHoverRadius: 8,
                },
                {
                    label: `Previous ${period}`,
                    data: normalizedPreviousAmounts,
                    fill: false,
                    borderColor: '#FF6384',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.3,
                    pointBackgroundColor: '#FF6384',
                    pointBorderColor: '#fff',
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    borderDash: [5, 5],
                }
            ],
        });
        
        setIsLoading(false);
    };

    const handleFilter = async (e) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.');
            return;
        }

        setIsLoading(true);
        
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            
            const response = await axios.get('https://financetrackerbackend-production.up.railway.app/api/v1/getexpense', {
                params: { startDate: startDate, endDate: endDate },
                headers: { Authorization: `Bearer ${token}` }
            });

            const expenseData = response.data.expenses || [];
            setExpenses(expenseData);
            
            if (comparePrevious) {
                // Calculate the equivalent previous period
                const start = new Date(startDate);
                const end = new Date(endDate);
                const duration = end - start;
                
                const prevEnd = new Date(start);
                prevEnd.setDate(prevEnd.getDate() - 1);
                
                const prevStart = new Date(prevEnd);
                prevStart.setTime(prevEnd.getTime() - duration);
                
                const prevStartStr = prevStart.toISOString().split('T')[0];
                const prevEndStr = prevEnd.toISOString().split('T')[0];
                
                const prevResponse = await axios.get('https://financetrackerbackend-production.up.railway.app/api/v1/getexpense', {
                    params: { startDate: prevStartStr, endDate: prevEndStr },
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                processExpenseDataWithComparison(expenseData, prevResponse.data.expenses || []);
            } else {
                processExpenseData(expenseData);
            }
        } catch (error) {
            console.error('Error fetching filtered expenses:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="chart-container">
            {/* Controls */}
            <div className={`mb-6 p-4 rounded-lg ${mode === "dark" ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {/* Date Filter Form */}
                <form className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" onSubmit={handleFilter}>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">Start Date:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className={`border p-2 rounded ${mode === "dark" ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">End Date:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className={`border p-2 rounded ${mode === "dark" ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`}
                        />
                    </div>
                    <div className="flex flex-col justify-end">
                        <button type="submit" className="h-10 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
                            Apply Filter
                        </button>
                    </div>
                    <div className="flex items-end">
                        <button 
                            type="button" 
                            onClick={() => {
                                const { firstDay, lastDay } = getDateRange();
                                setStartDate(firstDay);
                                setEndDate(lastDay);
                            }}
                            className="h-10 w-full border border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-2 rounded transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </form>
                
                {/* Advanced Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <label className="mr-2 text-sm font-medium">Aggregate by:</label>
                        <select 
                            value={aggregateBy}
                            onChange={(e) => setAggregateBy(e.target.value)}
                            className={`border p-2 rounded ${mode === "dark" ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`}
                        >
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="comparePrevious"
                            checked={comparePrevious}
                            onChange={(e) => setComparePrevious(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="comparePrevious" className="text-sm font-medium">
                            Compare with previous period
                        </label>
                    </div>
                </div>
            </div>

            {/* Chart Display Area */}
            {isLoading ? (
                <div className="h-64 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : chartData.labels && chartData.labels.length > 0 ? (
                <Line 
                    data={chartData} 
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        interaction: {
                            mode: 'index',
                            intersect: false,
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.dataset.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed.y !== null) {
                                            label += new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: 'USD'
                                            }).format(context.parsed.y);
                                        }
                                        return label;
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: true,
                                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                },
                                ticks: {
                                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined,
                                }
                            },
                            y: {
                                grid: {
                                    display: true,
                                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                },
                                ticks: {
                                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined,
                                    callback: function(value) {
                                        return '$' + value;
                                    }
                                },
                                beginAtZero: true
                            }
                        }
                    }}
                />
            ) : (
                <div className={`h-64 flex justify-center items-center text-lg ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    No expense data available for the selected period.
                </div>
            )}
        </div>
    );
};

export default ExpenseTrends;