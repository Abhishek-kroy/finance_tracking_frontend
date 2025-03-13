import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { CreditCard, PieChart, LineChart, Home, FileText, BarChart2, LogIn, LogOut } from "lucide-react";

const Navbar = ({ mode, setMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in on component mount and when token changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  // Track scrolling to add shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
    setShowLogoutConfirm(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };
  
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };
  
  const confirmLogout = () => {
    localStorage.removeItem("token");  // Clear token
    setIsLoggedIn(false);
    setShowLogoutConfirm(false);
    navigate("/login");                // Redirect to login page
  };
  
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const isDark = mode === "dark";

  // Define navigation items with icons (excluding login/logout which is handled separately)
  const navItems = [
    { path: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { path: "/budget", label: "Budget Creation", icon: <CreditCard className="w-5 h-5" /> },
    { path: "/budgetview", label: "View Budget", icon: <PieChart className="w-5 h-5" /> },
    { path: "/expenses", label: "Expense Tracking", icon: <LineChart className="w-5 h-5" /> },
    { path: "/generateresponse", label: "Report", icon: <FileText className="w-5 h-5" /> },
    { path: "/dashboard", label: "Dashboard", icon: <BarChart2 className="w-5 h-5" /> },
  ];

  // Login/Logout item (changes based on authentication state)
  const authItem = isLoggedIn
    ? { action: handleLogout, label: "Logout", icon: <LogOut className="w-5 h-5" /> }
    : { path: "/login", label: "Login", icon: <LogIn className="w-5 h-5" /> };

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`mb-10 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3 shadow-lg" : "py-5"
      } ${
        isDark 
          ? scrolled ? "bg-gray-900/95 backdrop-blur-sm" : "bg-gradient-to-r from-gray-900 to-gray-800" 
          : scrolled ? "bg-blue-600/95 backdrop-blur-sm" : "bg-gradient-to-r from-blue-600 to-blue-500"
      } text-white`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo with animation */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white/20 transition-all duration-300 ${
              scrolled ? "scale-90" : "scale-100"
            } group-hover:rotate-3`}>
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold transform transition-all duration-300 group-hover:translate-x-1">
              Finance Tracker
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? isDark 
                      ? "bg-blue-900/70 text-white" 
                      : "bg-white/20 text-white"
                    : "hover:bg-white/10"
                }`}
              >
                <span className={`transition-transform duration-300 ${isActive(item.path) ? "scale-110" : ""}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Login/Logout Button */}
            {authItem.path ? (
              <Link
                to={authItem.path}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
              >
                <span>{authItem.icon}</span>
                <span>{authItem.label}</span>
              </Link>
            ) : (
              <button
                onClick={authItem.action}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
              >
                <span>{authItem.icon}</span>
                <span>{authItem.label}</span>
              </button>
            )}
            
            {/* Theme toggle button */}
            <button
              onClick={toggleMode}
              className="ml-2 p-2 rounded-full hover:bg-white/10 transition-colors duration-300"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <FaSun className="w-5 h-5 animate-spin-slow" />
              ) : (
                <FaMoon className="w-5 h-5 animate-pulse" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleMode}
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-300 mr-2"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <FaTimes className="text-2xl transition-transform duration-300 rotate-90" />
              ) : (
                <FaBars className="text-2xl transition-transform duration-300 hover:rotate-12" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-screen opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className={`space-y-1 py-2 ${menuOpen ? "animate-fadeIn" : ""}`}>
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? isDark 
                      ? "bg-blue-900/70 text-white" 
                      : "bg-white/20 text-white"
                    : "hover:bg-white/10"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span>{item.icon}</span>
                <span className="text-lg">{item.label}</span>
              </Link>
            ))}
            
            {/* Mobile Login/Logout Button */}
            {authItem.path ? (
              <Link
                to={authItem.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/10"
                style={{ animationDelay: `${navItems.length * 50}ms` }}
              >
                <span>{authItem.icon}</span>
                <span className="text-lg">{authItem.label}</span>
              </Link>
            ) : (
              <button
                onClick={authItem.action}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/10 w-full text-left"
                style={{ animationDelay: `${navItems.length * 50}ms` }}
              >
                <span>{authItem.icon}</span>
                <span className="text-lg">{authItem.label}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md mx-4 shadow-2xl`}>
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Confirm Logout</h3>
            <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className={`px-4 py-2 rounded-lg ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                } transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;