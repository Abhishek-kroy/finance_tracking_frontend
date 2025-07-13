import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Register the required elements for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingDistribution = () => {
    const [error, setError] = useState('');
    const [budgets, setBudgets] = useState([]);
    const [chartData, setChartData] = useState(null); // Initialize as null
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                let token = localStorage.getItem("token");
                if (!token) {
                    setError("Unauthorized! Please log in again.");
                    navigate("/login");
                    return;
                }

                const response = await axios.get('https://financetrackerbackend-production.up.railway.app/api/v1/budgets/current-month', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const budgetData = response.data?.budgets || []; // Ensure budgets exist
                setBudgets(budgetData);

            } catch (error) {
                console.error('Error fetching budgets:', error);
                setError(error.response?.data?.message || "Failed to load budgets.");
            }
        };

        fetchBudgets();
    }, [navigate]);

    useEffect(() => {
        // Prepare data for the Pie chart
        if (budgets.length > 0) {
            const labels = budgets.map(budget => budget.name || 'Unnamed'); // Default label if missing
            const data = budgets.map(budget => budget.spentAmount || 0); // Default to 0 if undefined
            const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF5733', '#C70039', '#900C3F']; // Dynamic colors if more categories

            setChartData({
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length), // Ensure colors match the number of categories
                }],
            });
        } else {
            setChartData(null); // Handle case with no budgets
        }
    }, [budgets]);

    return (
        <div className="chart-container w-full">
            {error && <p className="text-red-500">{error}</p>}
            {chartData ? (
                <Pie data={chartData} />
            ) : (
                <p className="text-gray-500">No data available for the current month.</p>
            )}
        </div>
    );
};

export default SpendingDistribution;