import React, { useState, useEffect } from 'react';
import SpendingDistribution from '../components/SpendingDistribution';
import SpendingDistributionBar from '../components/SpendingDistributionBar';
import ExpenseTrends from '../components/ExpenseTrends';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from "react-helmet-async";
const Dashboard = ({ mode, setMode }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate data fetching
        setTimeout(() => setLoading(false), 2000);
    }, []);

    if (loading) {
        return (
            <div>

                <Navbar mode={mode} setMode={setMode} />
                <div className={`min-h-screen flex justify-center items-center ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    <div className="text-2xl font-semibold">Loading Dashboard...</div>
                </div>
                <Footer mode={mode} />
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex flex-col ${mode === 'dark' ? 'bg-gradient-to-b from-gray-800 to-gray-400 text-white' : 'bg-gray-200 text-gray-800'}`}>
            {/* Navbar */}
            <Helmet>
        <title>Finance Tracker - Your Ultimate Finance Management Tool</title>
        <meta
          name="description"
          content="Simplify your finances with Finance Tracker. Track expenses, set budgets, and stay on top of your financial goals."
        />
        <meta
          name="keywords"
          content="finance tracker, personal finance, expense management, budgeting tools"
        />
      </Helmet>
            <Navbar mode={mode} setMode={setMode} />

            {/* Dashboard Header */}
            <header className={`mt-4 text-center py-8 ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-400'} text-white`}>
                <p className="text-xl mt-2">Monitor your spending and trends over time</p>
            </header>

            {/* Dashboard Content */}
            <div className="container px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10 justify-center items-center">
                {/* Flex Container for Dashboard Components */}
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Spending Distribution Component */}
                    <div className={`w-full flex flex-col shadow-lg rounded-lg p-6 transform hover:scale-105 transition-all duration-300 ${mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        <h2 className="text-xl font-semibold mb-4 text-center">Spending Distribution</h2>
                        <div className="h-full flex justify-center items-center">
                            <SpendingDistribution />
                        </div>
                    </div>

                    {/* Spending Distribution Bar Component */}
                    <div className={`w-full shadow-lg rounded-lg p-6 transform hover:scale-105 transition-all duration-300 ${mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        <h2 className="text-xl font-semibold mb-4 text-center">Spending Distribution by Category</h2>
                        <SpendingDistributionBar />
                    </div>
                </div>

                {/* Expense Trends Component */}
                <div className={`w-full lg:w-2/3 shadow-lg rounded-lg p-6 transform hover:scale-105 transition-all duration-300 ${mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <h2 className="text-xl font-semibold mb-4 text-center">Expense Trends Over Time</h2>
                    <ExpenseTrends mode={mode}/>
                </div>
            </div>

            {/* Footer */}
            <Footer mode={mode} />
        </div>
    );
};

export default Dashboard;