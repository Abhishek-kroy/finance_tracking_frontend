import React, { createRef, useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldCheck, AlertCircle } from "lucide-react";

const ReCaptchaV2Label = ({ onVerify, mode = "light" }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const recaptchaRef = createRef();

  const isDark = mode === "light" ? true : false; // Determine if the mode is dark

  useEffect(() => {
    // Set loaded state after a short delay to enable animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleVerify = (value) => {
    if (value) {
      setIsVerified(true);
      setError(null);
      
      // Call the parent handler
      if (onVerify) {
        onVerify(value);
      }
    }
  };

  const handleExpired = () => {
    setIsVerified(false);
    setError("reCAPTCHA verification expired. Please verify again.");
  };

  const handleError = () => {
    setIsVerified(false);
    setError("An error occurred with reCAPTCHA. Please try again.");
  };

  const onSubmit = (event) => {
    event.preventDefault();
    
    const recaptchaValue = recaptchaRef.current?.getValue();
    
    if (recaptchaValue) {
      handleVerify(recaptchaValue);
    } else {
      setError("Please complete the reCAPTCHA verification.");
    }
  };

  // Determine container styles based on mode
  const containerStyles = `
    relative w-full max-w-md mx-auto p-6 rounded-xl 
    transition-all duration-500 transform
    ${isDark 
      ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500" 
      : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"}
  `;

  // Icon animation variants
  const iconVariants = {
    initial: { scale: 0, opacity: 0, rotate: -45 },
    animate: { scale: 1, opacity: 1, rotate: 0, transition: { duration: 0.5 } },
    exit: { scale: 0, opacity: 0, rotate: 45, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={containerStyles}
    >
      {/* Heading with status icon */}
      <div className="flex items-center justify-center mb-4">
        <AnimatePresence mode="wait">
          {isVerified ? (
            <motion.div 
              key="verified"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mr-2"
            >
              <ShieldCheck 
                size={24} 
                className={isDark ? "text-green-400" : "text-green-600"} 
              />
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mr-2"
            >
              <AlertCircle 
                size={24} 
                className={isDark ? "text-red-400" : "text-red-600"} 
              />
            </motion.div>
          ) : (
            <motion.div 
              key="shield"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mr-2"
            >
              <Shield 
                size={24} 
                className={isDark ? "text-blue-400" : "text-blue-600"} 
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>
          Security Verification
        </h2>
      </div>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-4 px-4 py-2 rounded text-sm ${
              isDark ? "bg-red-900/30 text-red-300" : "bg-red-50 text-red-600"
            } text-center`}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Success message */}
      <AnimatePresence>
        {isVerified && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-4 px-4 py-2 rounded text-sm ${
              isDark ? "bg-green-900/30 text-green-300" : "bg-green-50 text-green-600"
            } text-center`}
          >
            Verification successful. Thank you!
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* reCAPTCHA container with animation */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className={`${
          isDark ? "recaptcha-dark-theme" : ""
        } transform transition-transform duration-300 hover:scale-[1.02]`}>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={`${process.env.REACT_APP_SITE_KEY_RECAPTCHA}`}
            onChange={handleVerify}
            onExpired={handleExpired}
            onErrored={handleError}
            theme={isDark ? "dark" : "light"}
          />
        </div>
      </motion.div>
      
      {/* Submit button - optional, as most implementations auto-submit on verification */}
      <motion.div 
        className="mt-4 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSubmit}
          disabled={isVerified}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-300
          ${isVerified 
            ? isDark 
              ? "bg-green-800/50 text-green-200 cursor-not-allowed" 
              : "bg-green-100 text-green-700 cursor-not-allowed"
            : isDark
              ? "bg-blue-600 text-white hover:bg-blue-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isVerified ? "Verified" : "Verify"}
        </motion.button>
      </motion.div>
      
      {/* Info text */}
      <motion.p 
        className={`mt-4 text-xs text-center ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" className={`underline ${
          isDark ? "text-blue-400" : "text-blue-600"
        }`}>Privacy Policy</a> and <a href="https://policies.google.com/terms" className={`underline ${
          isDark ? "text-blue-400" : "text-blue-600"
        }`}>Terms of Service</a> apply.
      </motion.p>
    </motion.div>
  );
};

export default ReCaptchaV2Label;