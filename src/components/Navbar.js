import React, { useState } from "react";
import { Link } from "react-router-dom"; // Using react-router for navigation (you can adjust if needed)
import { FaBars, FaTimes } from "react-icons/fa"; // Hamburger menu and close icons

const Navbar = ({ mode, setMode }) => {
  // mode is light or dark
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setMode(mode === "light" ? "dark" : "dark"); // Toggle between light and dark mode
  };

  return (
    <nav className={`p-5 ${mode === "light" ? "bg-blue-500 text-white" : "bg-gray-900 text-gray-200"}`}>
      <div className="flex justify-between items-center">
        <div className="text-3xl font-bold">Finance Tracker</div>

        <div className="lg:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <FaTimes className="text-3xl" /> : <FaBars className="text-3xl" />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-8">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/budget" className="hover:text-gray-300">Budget Creation</Link>
          <Link to="/budgetview" className="hover:text-gray-300">View Budget</Link>
          <Link to="/expenses" className="hover:text-gray-300">Expense Tracking</Link>
          <Link to="/generateresponse" className="hover:text-gray-300">Report</Link>
          <Link to="/dashboard" className="hover:text-gray-300">DashBoard</Link>
          <Link to="/login" className="hover:text-gray-300">Login</Link>
        </div>
      </div>

      {/* Mobile Navigation (when menu is open) */}
      {menuOpen && (
        <div className="lg:hidden mt-4 space-y-4">
          <Link to="/" className="block text-xl py-2">Home</Link>
          <Link to="/budget" className="block text-xl py-2">Budget Creation</Link>
          <Link to="/budgetview" className="block text-xl py-2">View Budget</Link>
          <Link to="/expenses" className="block text-xl py-2">Expense Tracking</Link>
          <Link to="/generateresponse" className="block text-xl py-2">Report</Link>
          <Link to="/dashboard" className="block text-xl py-2">DashBoard</Link>
          <Link to="/login" className="block text-xl py-2">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;