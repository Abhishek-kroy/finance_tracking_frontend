import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = ({ mode }) => {
  const backgroundColor = mode === 'light' ? 'bg-gray-100' : 'bg-gradient-to-b from-black to-gray-900';
  const textColor = mode === 'light' ? 'text-gray-800' : 'text-white';
  const borderColor = mode === 'light' ? 'border-gray-300' : 'border-gray-600';
  const linkHoverColor = mode === 'light' ? 'hover:text-blue-500' : 'hover:text-blue-600';

  return (
    <div className={`${backgroundColor} ${textColor} py-12 w-full`}>
      <div className="px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={`text-blue-400 ${linkHoverColor}`}>Home</Link>
              </li>
              <li>
                <Link to="/budget" className={`text-blue-400 ${linkHoverColor}`}>Budget Creation</Link>
              </li>
              <li>
                <Link to="/budgetview" className={`text-blue-400 ${linkHoverColor}`}>View Budget</Link>
              </li>
              <li>
                <Link to="/expenses" className={`text-blue-400 ${linkHoverColor}`}>Expense Tracking</Link>
              </li>
              <li>
                <Link to="/dashboard" className={`text-blue-400 ${linkHoverColor}`}>DashBoard</Link>
              </li>
              <li>
                <Link to="/login" className={`text-blue-400 ${linkHoverColor}`}>Login</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul>
              <li className="text-sm">
                Email: <a href="mailto:support@example.com" className={`text-blue-400 ${linkHoverColor}`}>support@example.com</a>
              </li>
              <li className="text-sm">
                Phone: <a href="tel:+1234567890" className={`text-blue-400 ${linkHoverColor}`}>+1 (234) 567-890</a>
              </li>
              <li className="text-sm">Address: 123 Street, City, Country</li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <button className={`text-blue-400 ${linkHoverColor}`} aria-label="Facebook" onClick={() => { }}>
                <FaFacebookF />
              </button>
              <button className={`text-blue-400 ${linkHoverColor}`} aria-label="Twitter" onClick={() => { }}>
                <FaTwitter />
              </button>
              <button className={`text-blue-400 ${linkHoverColor}`} aria-label="Instagram" onClick={() => { }}>
                <FaInstagram />
              </button>
              <button className={`text-blue-400 ${linkHoverColor}`} aria-label="LinkedIn" onClick={() => { }}>
                <FaLinkedinIn />
              </button>

            </div>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className={`text-blue-400 ${linkHoverColor}`}>Privacy Policy</Link></li>
              <li><Link to="/terms" className={`text-blue-400 ${linkHoverColor}`}>Terms & Conditions</Link></li>
              <li><Link to="/accessibility" className={`text-blue-400 ${linkHoverColor}`}>Accessibility</Link></li>
              <li><Link to="/cookie-policy" className={`text-blue-400 ${linkHoverColor}`}>Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={`mt-8 border-t ${borderColor} pt-6 text-center text-sm`}>
          <p>&copy; 2025 Finance Tracker Pvt Ltd. All rights reserved.</p>
          <p className="text-gray-400">Last Updated: Jan 20, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;