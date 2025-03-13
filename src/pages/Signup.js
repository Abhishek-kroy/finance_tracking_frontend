import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReCaptchaV2Label from "../components/ReCaptcha";

import {
  PieChart,
  LineChart,
  CreditCard,
  BarChart2,
  TrendingUp,
  User,
  Mail,
  Lock,
  CheckCircle
} from "lucide-react";

const Signup = ({ mode, setMode }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState("");
  const [animationIndex, setAnimationIndex] = useState(0);

  const navigate = useNavigate();

  // Animation for benefits
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationIndex(prev => (prev + 1) % benefits.length);
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = (value) => {
    setRecaptchaValue(value);
  };

  const toLoginPage = () => {
    navigate('/login');
  };

  const sendOtp = async (e) => {
    e && e.preventDefault();

    if (!email) {
      setError("Please enter a valid email address");
      return;
    }

    if (!recaptchaValue) {
      setError("Please complete the reCAPTCHA verification");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post("https://finance-tracker-backend-0h5z.onrender.com/api/v1/sendOtp", {
        email,
        recaptchaToken: recaptchaValue
      });

      if (response.data.success) {
        setStep(2);
        setSuccessMessage("OTP sent to your email");
      } else {
        setError(response.data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(err.response?.data?.message || "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e && e.preventDefault();

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post("https://finance-tracker-backend-0h5z.onrender.com/api/v1/verifyOtp", {
        email,
        otp
      });

      if (response.data.success) {
        setStep(3);
        setSuccessMessage("Email verified successfully");
      } else {
        setError(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e && e.preventDefault();

    if (!name) {
      setError("Please enter your full name");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post("https://finance-tracker-backend-0h5z.onrender.com/api/v1/register", {
        name,
        email,
        password
      });

      if (response.data.success) {
        setSuccessMessage("Account created successfully!");
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setError(err.response?.data?.message || "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Benefits for the right panel
  const benefits = [
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Smart Expense Categorization",
      description: "Automatically categorize your expenses for insightful spending patterns.",
      color: "text-blue-500 dark:text-blue-400"
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Future Projection Analytics",
      description: "See where your finances are headed with AI-powered predictions.",
      color: "text-green-500 dark:text-green-400"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Personalized Saving Goals",
      description: "Set and track customized goals that match your financial journey.",
      color: "text-purple-500 dark:text-purple-400"
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Multi-Currency Support",
      description: "Track finances across different currencies with real-time conversions.",
      color: "text-orange-500 dark:text-orange-400"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Investment Performance Tracking",
      description: "Monitor your investment portfolio with comprehensive analytics.",
      color: "text-red-500 dark:text-red-400"
    }
  ];

  // Progress steps
  const steps = [
    { number: 1, title: "Email" },
    { number: 2, title: "Verification" },
    { number: 3, title: "Profile" }
  ];

  // Determine theme-based classes
  const isDark = mode === 'dark';

  return (
    <div className={`flex flex-col min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="bg-gray-900 mt-10 mb-10"></div>
      <Navbar mode={mode} setMode={setMode} />

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-6xl animate-fadeIn">
          <div className={`flex flex-col lg:flex-row rounded-xl overflow-hidden shadow-2xl 
            ${isDark ? 'bg-gray-800 shadow-blue-900/20' : 'bg-white shadow-gray-200/50'} 
            transition-all duration-300 transform hover:scale-[1.01]`}>

            {/* Right Side - Benefits and Info */}
            <div
              className={`animate-slide-left z-10 w-full lg:w-1/2 relative overflow-hidden transition-transform duration-700 ease-in-out transform ${isDark ? 'bg-gradient-to-br from-blue-900 to-indigo-900' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                } p-8 lg:p-12 text-white ${step === 1 ? 'translate-x-0' : '-translate-x-full'}`}
            >
              {/* Background animated particles */}
              <div className="absolute inset-0 overflow-hidden opacity-20">
                {[...Array(20)].map((_, index) => (
                  <div
                    key={index}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: `${Math.random() * 10 + 5}px`,
                      height: `${Math.random() * 10 + 5}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `float ${Math.random() * 10 + 10}s linear infinite`
                    }}
                  />
                ))}
              </div>

              <div className="max-w-md mx-auto relative z-10">
                <h2 className="text-3xl font-bold mb-6">Take Control of Your Financial Future</h2>
                <p className="text-blue-100 mb-8">
                  Join thousands of users who are achieving their financial goals with our powerful tracking and analysis tools.
                </p>

                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-4 p-3 rounded-lg transition-all duration-500 transform
                        ${animationIndex === index ? 'scale-105 bg-white/10' : 'scale-100 bg-transparent'}`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-300 ${benefit.color} ${animationIndex === index ? 'animate-pulse bg-white/20' : 'bg-white/10'}`}>
                        <div className="transform transition-transform duration-500 hover:rotate-12">
                          {benefit.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{benefit.title}</h3>
                        <p className="text-blue-100">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12">
                  <p className="font-medium mb-2">Sign up takes less than 2 minutes</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                    <span className="text-blue-200 text-sm ml-1">Secure & encrypted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Side - Signup Form */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>
                  Create Account
                </h2>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 transition-colors duration-300`}>
                  Start your journey to financial freedom
                </p>

                {/* Progress Indicator */}
                <div className="flex mb-8 justify-between">
                  {steps.map((s) => (
                    <div key={s.number} className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full mb-2 transition-colors duration-300
                        ${step === s.number
                          ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                          : step > s.number
                            ? isDark ? 'bg-green-600 text-white' : 'bg-green-600 text-white'
                            : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                        }`}>
                        {step > s.number ? <CheckCircle className="w-4 h-4" /> : s.number}
                      </div>
                      <span className={`text-xs transition-colors duration-300
                        ${step === s.number
                          ? isDark ? 'text-blue-400' : 'text-blue-600'
                          : isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        {s.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Error and Success Messages */}
                {error && (
                  <div className={`p-3 rounded-lg text-sm mb-4 ${isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-600'} animate-pulse transition-colors duration-300`}>
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className={`p-3 rounded-lg text-sm mb-4 ${isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-50 text-green-600'} animate-pulse transition-colors duration-300`}>
                    {successMessage}
                  </div>
                )}

                {/* Step 1: Email Input & reCAPTCHA */}
                {step === 1 && (
                  <form onSubmit={sendOtp} className="space-y-6">
                    <div className="group">
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                        Email Address
                      </label>
                      <div className="relative">
                        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Mail className="w-5 h-5" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full p-3 pl-10 rounded-lg focus:outline-none transition-all duration-300
                            ${isDark
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'}`}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <ReCaptchaV2Label onVerify={handleVerify} />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full flex justify-center items-center p-3 rounded-lg focus:outline-none transition-all duration-300
                        ${isDark
                          ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-gray-800'
                          : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'}
                        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending OTP...
                        </span>
                      ) : "Continue"}
                    </button>
                  </form>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                  <form onSubmit={verifyOtp} className="space-y-6">
                    <div className="text-center mb-4">
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        We've sent a verification code to
                      </p>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {email}
                      </p>
                    </div>

                    <div className="group">
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className={`w-full p-3 pl-3 text-center rounded-lg focus:outline-none transition-all duration-300 tracking-wider font-mono
                          ${isDark
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'}`}
                        placeholder="Enter OTP"
                        maxLength={6}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full flex justify-center items-center p-3 rounded-lg focus:outline-none transition-all duration-300
                        ${isDark
                          ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-gray-800'
                          : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'}
                        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </span>
                      ) : "Verify"}
                    </button>

                    <div className="text-center mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setOtp("");
                          sendOtp();
                        }}
                        disabled={isLoading}
                        className={`text-sm transition-colors duration-300 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                      >
                        Resend Code
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: Complete Profile */}
                {step === 3 && (
                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="group">
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                        Full Name
                      </label>
                      <div className="relative">
                        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full p-3 pl-10 rounded-lg focus:outline-none transition-all duration-300
                            ${isDark
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'}`}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                        Password
                      </label>
                      <div className="relative">
                        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Lock className="w-5 h-5" />
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full p-3 pl-10 rounded-lg focus:outline-none transition-all duration-300
                            ${isDark
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'}`}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Lock className="w-5 h-5" />
                        </div>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full p-3 pl-10 rounded-lg focus:outline-none transition-all duration-300
                            ${isDark
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'}`}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full flex justify-center items-center p-3 rounded-lg focus:outline-none transition-all duration-300
                        ${isDark
                          ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-gray-800'
                          : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'}
                        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Account...
                        </span>
                      ) : "Create Account"}
                    </button>
                  </form>
                )}

                <div className="mt-8 text-center">
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                    Already have an account?{" "}
                    <button
                      onClick={toLoginPage}
                      className={`font-medium transition-colors duration-300 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer mode={mode} />

      {/* Global styles for animations */}
      <style jsx>{`
      @keyframes slideLeft {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-slide-left {
  animation: slideLeft 0.7s ease-in-out;
}

        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Signup;