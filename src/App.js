import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";  // Ensure this component is created
import { HelmetProvider, Helmet } from "react-helmet-async";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BudgetForm from "./pages/BudgetForm";
import BudgetView from "./pages/BudgetView"
import AddExpenseForm from "./pages/AddExpenseForm";
import Dashboard from "./pages/Dashboard";
import GenerateReport from './pages/GenerateReport'

const App = () => {
  const [mode,setMode]=useState("dark");
  return (
    <HelmetProvider>
    <div>
      <Helmet>
        <title>Finance Tracker | Manage Your Finances Effectively</title>
        <meta
          name="description"
          content="A comprehensive finance management tool to track expenses, set budgets, and generate financial reports."
        />
        <meta
          name="keywords"
          content="finance tracker, budget management, expense tracker, financial reports"
        />
      </Helmet>

      <Routes>
        <Route path="/" element={<LandingPage mode={mode} setMode={setMode} />} />
        <Route path="/budget" element={<BudgetForm mode={mode} setMode={setMode} />} />
        <Route path="/expenses" element={<AddExpenseForm mode={mode} setMode={setMode} />} />
        <Route path="/dashboard" element={<Dashboard mode={mode} setMode={setMode} />} />
        <Route path="/budgetview" element={<BudgetView mode={mode} setMode={setMode} />} />
        <Route path="/generateresponse" element={<GenerateReport mode={mode} setMode={setMode} />} />
        <Route path="/login" element={<Login mode={mode} setMode={setMode} />} />
        <Route path="/signup" element={<Signup mode={mode} setMode={setMode} />} />
      </Routes>
    </div>
  </HelmetProvider>
  );
};

export default App;