import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = ({ mode }) => {
  const isDark = mode === 'dark';
  const currentYear = new Date().getFullYear();
  
  // Social media links with hover effects
  const socialLinks = [
    { icon: <FaFacebookF />, label: 'Facebook', color: 'hover:text-blue-500 hover:bg-white' },
    { icon: <FaTwitter />, label: 'Twitter', color: 'hover:text-blue-400 hover:bg-white' },
    { icon: <FaInstagram />, label: 'Instagram', color: 'hover:text-pink-500 hover:bg-white' },
    { icon: <FaLinkedinIn />, label: 'LinkedIn', color: 'hover:text-blue-700 hover:bg-white' }
  ];

  return (
    <footer className={`mt-20 pt-16 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-gray-900 to-black text-gray-200' 
        : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          {/* Quick Links Section */}
          <div className="transform transition-transform duration-300 hover:translate-y-[-5px]">
            <h3 className={`text-xl font-semibold mb-6 pb-2 border-b-2 ${
              isDark ? 'border-blue-600' : 'border-blue-500'
            } inline-block`}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/budget", label: "Budget Creation" },
                { to: "/budgetview", label: "View Budget" },
                { to: "/expenses", label: "Expense Tracking" },
                { to: "/dashboard", label: "Dashboard" },
                { to: "/login", label: "Login" }
              ].map((link, index) => (
                <li key={index} className="group transform transition-all duration-300">
                  <Link 
                    to={link.to} 
                    className={`flex items-center group-hover:translate-x-1 transition-all duration-300 ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">•</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="transform transition-transform duration-300 hover:translate-y-[-5px]">
            <h3 className={`text-xl font-semibold mb-6 pb-2 border-b-2 ${
              isDark ? 'border-blue-600' : 'border-blue-500'
            } inline-block`}>
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <FaEnvelope className={`mt-1 transition-colors duration-300 ${
                  isDark ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-600 group-hover:text-blue-700'
                }`} />
                <div>
                  <span className={`block text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Email:</span>
                  <a 
                    href="mailto:support@example.com" 
                    className={`group-hover:underline transition-all duration-300 ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    support@example.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 group">
                <FaPhone className={`mt-1 transition-colors duration-300 ${
                  isDark ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-600 group-hover:text-blue-700'
                }`} />
                <div>
                  <span className={`block text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Phone:</span>
                  <a 
                    href="tel:+1234567890" 
                    className={`group-hover:underline transition-all duration-300 ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 group">
                <FaMapMarkerAlt className={`mt-1 transition-colors duration-300 ${
                  isDark ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-600 group-hover:text-blue-700'
                }`} />
                <div>
                  <span className={`block text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Address:</span>
                  <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                    123 Street, City, Country
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div className="transform transition-transform duration-300 hover:translate-y-[-5px]">
            <h3 className={`text-xl font-semibold mb-6 pb-2 border-b-2 ${
              isDark ? 'border-blue-600' : 'border-blue-500'
            } inline-block`}>
              Follow Us
            </h3>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <button 
                  key={index}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                    isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                  } ${social.color}`} 
                  aria-label={social.label}
                >
                  {social.icon}
                </button>
              ))}
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-3">Subscribe to Newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className={`px-4 py-2 rounded-l-lg focus:outline-none w-full transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                  }`}
                />
                <button 
                  className={`px-4 py-2 rounded-r-lg transition-colors duration-300 ${
                    isDark 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <FaEnvelope />
                </button>
              </div>
            </div>
          </div>

          {/* Legal Section */}
          <div className="transform transition-transform duration-300 hover:translate-y-[-5px]">
            <h3 className={`text-xl font-semibold mb-6 pb-2 border-b-2 ${
              isDark ? 'border-blue-600' : 'border-blue-500'
            } inline-block`}>
              Legal
            </h3>
            <ul className="space-y-2">
              {[
                { to: "/privacy-policy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms & Conditions" },
                { to: "/accessibility", label: "Accessibility" },
                { to: "/cookie-policy", label: "Cookie Policy" }
              ].map((link, index) => (
                <li key={index} className="group transform transition-all duration-300">
                  <Link 
                    to={link.to} 
                    className={`flex items-center group-hover:translate-x-1 transition-all duration-300 ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">•</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={`relative py-6 text-center ${
          isDark ? 'border-t border-gray-800' : 'border-t border-gray-300'
        }`}>
          <div className="mb-2 flex justify-center items-center space-x-1 animate-pulse">
            <span>Made</span>
            <span>by Finance Tracker Team</span>
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            &copy; {currentYear} Finance Tracker Pvt Ltd. All rights reserved.
          </p>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Last Updated: March 11, 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;