import React, { useEffect, useRef } from "react";

const ReCaptchaV2Label = ({ onVerify }) => {
  const captchaRef = useRef(null);

  useEffect(() => {
    // Dynamically load the reCAPTCHA script
    function funct() {

      if (!window.grecaptcha) {
        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
  
        script.onload = () => {
          waitForGrecaptcha().then(renderRecaptcha);
        };
  
        return () => {
          document.body.removeChild(script);
        };
      } else {
        waitForGrecaptcha().then(renderRecaptcha);
      }
    };
    funct();
  },[onVerify]);

  // Function to wait for the grecaptcha object to be available
  const waitForGrecaptcha = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.render) {
          clearInterval(interval);
          resolve();
        }
      }, 100); // Check every 100ms
    });
  };

  // Function to render the reCAPTCHA widget
  const renderRecaptcha = () => {
    if (captchaRef.current) {
      window.grecaptcha.render(captchaRef.current, {
        sitekey: process.env.REACT_APP_SITE_KEY_RECAPTCHA,
        callback: (token) => onVerify(token), // Callback function when reCAPTCHA is completed
      });
    }
  };

  return (
    <div className="mb-4">
      <div ref={captchaRef}></div>
    </div>
  );
};

export default ReCaptchaV2Label;