import React from "react";
import Slider from "react-slick"; // Importing react-slick carousel

// Carousel Component
const Carousel = ({ slides, mode }) => {
  // Slick slider settings
  const settings = {
    dots: true, // Show dots for navigation
    infinite: true, // Infinite scroll
    speed: 500, // Transition speed
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Auto-play the slides
    autoplaySpeed: 3000, // Speed of auto-play
    pauseOnHover: true, // Pause on hover
  };

  return (
    // how to set background with linar gradien #d0d4d9
    <div
      className={`w-full h-full py-10 mb-10 overflow-hidden ${
  mode === "dark" 
    ? "bg-gradient-to-b from-gray-800 to-gray-400" // Dark mode gradient
    : "bg-white" // Light mode gradient
}`}

    >
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="text-center px-4">
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full max-w-full h-[50vh] object-cover rounded-lg shadow-lg ${
                mode === "dark" ? "filter brightness-75" : ""
              }`}
            />
            <h3
              className={`text-2xl font-semibold mt-4 ${
                mode === "dark" ? "text-blue-600" : "text-blue-600"
              }`}
            >
              {slide.title}
            </h3>
            <p
              className={`text-md mt-2 ${
                mode === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {slide.description}
            </p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;