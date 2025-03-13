import React, { useState, useEffect } from 'react';
import SpendingDistribution from '../components/SpendingDistribution';
import SpendingDistributionBar from '../components/SpendingDistributionBar';
import ExpenseTrends from '../components/ExpenseTrends';
// import BudgetOverview from '../components/BudgetOverview.js'; // New component
// import RecentTransactions from '../components/RecentTransactions'; // New component
// import SavingsGoals from '../components/SavingsGoals'; // New component
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard = ({ mode, setMode }) => {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        totalSpent: 0,
        totalBudget: 0,
        savingsRate: 0
    });
    const [period, setPeriod] = useState('month'); // 'week', 'month', 'year'
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate data fetching
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.log("Unauthorized! Redirecting to login.");
                    navigate("/login");
                    return;
                }
                
                // This would be replaced with actual API calls
                // Simulate summary data
                setSummary({
                    totalSpent: 2450,
                    totalBudget: 3000,
                    savingsRate: 18.3
                });
                
                setTimeout(() => setLoading(false), 1000);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };
        
        fetchDashboardData();
    }, [period]);

    if (loading) {
        return (
            <div>
                <Navbar mode={mode} setMode={setMode} />
                <div className={`min-h-screen flex flex-col justify-center items-center ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <div className="text-2xl font-semibold">Loading Dashboard...</div>
                </div>
                <Footer mode={mode} />
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex flex-col ${mode === 'dark' ? 'bg-gradient-to-b from-gray-900 to-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <div className="bg-gray-900 mt-10 mb-10"></div>    
            {/* Navbar */}
            <Navbar mode={mode} setMode={setMode} />

            {/* Dashboard Header */}
            <header className={`mb-10 text-center py-8 ${mode === 'dark' ? 'bg-gray-900' : 'bg-blue-600'} text-white`}>
                <h1 className="text-3xl font-bold">Financial Dashboard</h1>
                <p className="text-xl mt-2">Monitor your spending and trends over time</p>
                
                {/* Time Period Selector */}
                <div className="mt-4 flex justify-center gap-4">
                    <button 
                        onClick={() => setPeriod('week')}
                        className={`px-4 py-2 rounded-lg transition-all ${period === 'week' 
                            ? 'bg-white text-blue-600 font-bold' 
                            : 'bg-opacity-20 bg-white hover:bg-opacity-30'}`}
                    >
                        Week
                    </button>
                    <button 
                        onClick={() => setPeriod('month')}
                        className={`px-4 py-2 rounded-lg transition-all ${period === 'month' 
                            ? 'bg-white text-blue-600 font-bold' 
                            : 'bg-opacity-20 bg-white hover:bg-opacity-30'}`}
                    >
                        Month
                    </button>
                    <button 
                        onClick={() => setPeriod('year')}
                        className={`px-4 py-2 rounded-lg transition-all ${period === 'year' 
                            ? 'bg-white text-blue-600 font-bold' 
                            : 'bg-opacity-20 bg-white hover:bg-opacity-30'}`}
                    >
                        Year
                    </button>
                </div>
            </header>

            {/* Financial Summary Cards */}
            <div className="container mx-auto px-4 -mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Spent Card */}
                    <div className={`rounded-lg shadow-lg p-6 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <h3 className="text-lg font-semibold text-gray-500">Total Spent</h3>
                        <p className="text-3xl font-bold mt-2">${summary.totalSpent.toLocaleString()}</p>
                        <div className="mt-4 h-2 bg-gray-200 rounded-full">
                            <div 
                                className="h-2 bg-blue-500 rounded-full" 
                                style={{ width: `${(summary.totalSpent / summary.totalBudget) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-sm mt-2">{((summary.totalSpent / summary.totalBudget) * 100).toFixed(1)}% of budget</p>
                    </div>
                    
                    {/* Budget Remaining Card */}
                    <div className={`rounded-lg shadow-lg p-6 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <h3 className="text-lg font-semibold text-gray-500">Budget Remaining</h3>
                        <p className="text-3xl font-bold mt-2">${(summary.totalBudget - summary.totalSpent).toLocaleString()}</p>
                        <div className="mt-4 h-2 bg-gray-200 rounded-full">
                            <div 
                                className="h-2 bg-green-500 rounded-full" 
                                style={{ width: `${100 - (summary.totalSpent / summary.totalBudget) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-sm mt-2">{(100 - (summary.totalSpent / summary.totalBudget) * 100).toFixed(1)}% remaining</p>
                    </div>
                    
                    {/* Savings Rate Card */}
                    <div className={`rounded-lg shadow-lg p-6 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <h3 className="text-lg font-semibold text-gray-500">Savings Rate</h3>
                        <p className="text-3xl font-bold mt-2">{summary.savingsRate}%</p>
                        <div className="mt-4 h-2 bg-gray-200 rounded-full">
                            <div 
                                className="h-2 bg-purple-500 rounded-full" 
                                style={{ width: `${summary.savingsRate * 3}%` }} // Scaled for visual effect
                            ></div>
                        </div>
                        <p className="text-sm mt-2">Target: 20%</p>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Spending Distribution Component */}
                    <div className={`shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <h2 className="text-xl font-semibold mb-4">Spending Distribution</h2>
                        <SpendingDistribution />
                    </div>

                    {/* Spending Distribution Bar Component */}
                    <div className={`shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
                        <SpendingDistributionBar />
                    </div>
                </div>

                {/* Budget Overview Component */}
                {/* <div className={`mb-6 shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
                    <BudgetOverview mode={mode} />
                </div> */}

                {/* Expense Trends Component */}
                <div className={`mb-6 shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className="text-xl font-semibold mb-4">Expense Trends</h2>
                    <ExpenseTrends mode={mode} period={period} />
                </div>

                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
                    {/* Recent Transactions Component */}
                    {/* <div className={`shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}> */}
                        {/* <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2> */}
                        {/* <RecentTransactions mode={mode} /> */}
                    {/* </div> */}

                    {/* Savings Goals Component */}
                    {/* <div className={`shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}> */}
                        {/* <h2 className="text-xl font-semibold mb-4">Savings Goals</h2> */}
                        {/* <SavingsGoals mode={mode} /> */}
                    {/* </div> */}
                {/* </div> */}
            </div>

            {/* Footer */}
            <Footer mode={mode} />
        </div>
    );
};

export default Dashboard;