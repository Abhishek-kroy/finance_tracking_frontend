import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Custom arrow components with animations
const PrevArrow = (props) => {
  const { className, style, onClick, mode } = props;
  return (
    <motion.div
      className={`${className} absolute left-4 z-10 cursor-pointer`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      <ChevronLeft 
        size={32} 
        className={`${mode === "dark" ? "text-gray-200" : "text-gray-800"} 
                  drop-shadow-md transition-colors duration-300`} 
      />
    </motion.div>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick, mode } = props;
  return (
    <motion.div
      className={`${className} absolute right-4 z-10 cursor-pointer`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      <ChevronRight 
        size={32} 
        className={`${mode === "dark" ? "text-gray-200" : "text-gray-800"} 
                  drop-shadow-md transition-colors duration-300`} 
      />
    </motion.div>
  );
};

// Enhanced Carousel Component
const Carousel = ({ slides, mode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Set visibility after component mounts for entrance animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Enhanced slick slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    beforeChange: (current, next) => setCurrentSlide(next),
    prevArrow: <PrevArrow mode={mode} />,
    nextArrow: <NextArrow mode={mode} />,
    customPaging: (i) => (
      <div
        className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
          i === currentSlide
            ? mode === "dark"
              ? "bg-blue-400 scale-125"
              : "bg-blue-600 scale-125"
            : mode === "dark"
            ? "bg-gray-600"
            : "bg-gray-300"
        }`}
      />
    ),
    dotsClass: "slick-dots custom-dots flex justify-center mt-6"
  };

  // Background gradient variants based on mode
  const gradientBg = mode === "dark" 
    ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700" 
    : "bg-gradient-to-b from-blue-50 via-white to-gray-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 50 
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`w-full py-12 px-4 md:px-8 mb-10 overflow-hidden rounded-xl ${gradientBg} 
                shadow-xl transition-all duration-500`}
    >
      <Slider {...settings} className="carousel-container">
        {slides.map((slide, index) => (
          <div key={index} className="focus-visible:outline-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="px-4 pb-6 text-center"
            >
              <div className="relative overflow-hidden rounded-xl shadow-2xl group">
                <motion.img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full max-w-full h-[50vh] object-cover transition-all duration-700 ${
                    mode === "dark" ? "brightness-90" : "brightness-100"
                  } group-hover:scale-105`}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.7 }}
                />
                <motion.div 
                  className={`absolute inset-0 ${
                    mode === "dark" 
                      ? "bg-gradient-to-t from-black/70 to-transparent" 
                      : "bg-gradient-to-t from-black/40 to-transparent"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                />
              </div>
              
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className={`text-2xl md:text-3xl font-bold mt-6 ${
                  mode === "dark" ? "text-blue-400" : "text-blue-600"
                } transition-colors duration-300`}
              >
                {slide.title}
              </motion.h3>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className={`text-md md:text-lg mt-3 max-w-3xl mx-auto ${
                  mode === "dark" ? "text-gray-300" : "text-gray-700"
                } transition-colors duration-300`}
              >
                {slide.description}
              </motion.p>
            </motion.div>
          </div>
        ))}
      </Slider>
    </motion.div>
  );
};

export default Carousel;