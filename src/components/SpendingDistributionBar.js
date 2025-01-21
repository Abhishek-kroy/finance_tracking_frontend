import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    BarElement, 
    Tooltip, 
    Legend, 
    CategoryScale, 
    LinearScale 
} from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Register required Chart.js components
ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const SpendingDistributionBar = () => {
    const [budgets, setBudgets] = useState([]);
    const [error, setError] = useState('');
    const [chartData, setChartData] = useState(null);
    const navigate = useNavigate();

    // Fetch budgets from the API
    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Unauthorized! Please log in again.");
                    navigate("/login");
                    return;
                }

                const response = await axios.get(
                    'https://finance-tracker-backend-0h5z.onrender.com/api/v1/budgets/current-month',
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const budgetData = response.data?.budgets || [];
                setBudgets(budgetData);
            } catch (error) {
                console.error("Error fetching budgets:", error);
                setError("Failed to fetch budgets. Please try again.");
            }
        };

        fetchBudgets();
    }, [navigate]);

    // Prepare data for the chart
    useEffect(() => {
        if (budgets.length > 0) {
            const labels = budgets.map(budget => budget.name);
            const data = budgets.map(budget => budget.spentAmount || 0);

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Amount Spent',
                        data,
                        backgroundColor: 'rgba(75,192,192,0.6)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderWidth: 1,
                    },
                ],
            });
        } else {
            setChartData(null);
        }
    }, [budgets]);

    return (
        <div className="chart-container h-[60vh]">
            {error && <p className="text-red-500">{error}</p>}
            {chartData ? (
                <div className="w-full h-full p-4 bg-white shadow-lg rounded-lg">
                    <Bar data={chartData} options={{
                        responsive: true,
                        maintainAspectRatio: false, // To allow custom height
                        scales: {
                            x: {
                                grid: {
                                    display: true,
                                    color: 'rgba(0, 0, 0, 0.1)',
                                },
                            },
                            y: {
                                grid: {
                                    display: true,
                                    color: 'rgba(0, 0, 0, 0.1)',
                                },
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 50, // Customize the Y-axis step size
                                },
                            },
                        },
                        plugins: {
                            tooltip: {
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                titleColor: '#fff',
                                bodyColor: '#fff',
                            },
                            legend: {
                                position: 'top',
                                labels: {
                                    fontColor: '#333',
                                    fontSize: 14,
                                },
                            },
                        },
                    }} />
                </div>
            ) : (
                <p className="text-gray-500">No data available for the current month.</p>
            )}
        </div>
    );
};

export default SpendingDistributionBar;