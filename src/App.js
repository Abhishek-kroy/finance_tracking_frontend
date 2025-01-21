import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";  // Ensure this component is created
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BudgetForm from "./pages/BudgetForm";
import BudgetView from "./pages/BudgetView"
import AddExpenseForm from "./pages/AddExpenseForm";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [mode,setMode]=useState("light");
  return (
    <div>
      
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<LandingPage  mode={mode} setMode={setMode}/>} />
        
        {/* Other page routes */}
        <Route path="/budget" element={<BudgetForm mode={mode} setMode={setMode}/>} />
        <Route path="/expenses" element={<AddExpenseForm mode={mode} setMode={setMode}/>}/>
        {/* <Route path="/reports" element={<div>Reports Page</div>} /> */}
        <Route path="/dashboard" element={<Dashboard mode={mode} setMode={setMode}/>} />
        {/* <Route path="/tax" element={<div>Tax Page</div>} /> */}
        <Route path="/budgetview" element={<BudgetView mode={mode} setMode={setMode}/>} />
        <Route path="/login" element={<Login mode={mode} setMode={setMode}/>} />
        <Route path="/signup" element={<Signup mode={mode} setMode={setMode}/>} />
      </Routes>
    </div>
  );
};

export default App;