import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const LandingPage = ({ mode, setMode }) => {
  const slides = [
    {
      image: "https://assets.ycodeapp.com/assets/app18525/images/O30b82M5XoLnXIuKHKs8lp6FaEXgy51OgyMLtdAk-published.webp",
      title: "Budget Creation",
      description:
        "Create and manage budgets for different categories like savings, rent, utilities, and more. Stay on top of your spending!",
    },
    {
      image: "https://i.etsystatic.com/39814081/r/il/333c55/5075627972/il_fullxfull.5075627972_czri.jpg",
      title: "Expense Tracking",
      description:
        "Track all your expenses with ease. Categorize and review your spending to make sure you're sticking to your budget.",
    },
    {
      image: "https://i.etsystatic.com/39814081/r/il/333c55/5075627972/il_fullxfull.5075627972_czri.jpg",
      title: "Reports and Insights",
      description:
        "Generate visual reports to understand your financial habits. View monthly and yearly summaries to improve your financial strategy.",
    },
    {
      image: "https://i.etsystatic.com/39814081/r/il/333c55/5075627972/il_fullxfull.5075627972_czri.jpg",
      title: "Tax Calculations",
      description:
        "Estimate your taxes based on your income and expenses. Set reminders for important filing dates and avoid penalties.",
    },
    {
      image: "https://i.etsystatic.com/39814081/r/il/333c55/5075627972/il_fullxfull.5075627972_czri.jpg",
      title: "Bank Sync",
      description:
        "Sync with your bank account to automatically import transactions. Categorize them for a complete overview of your finances.",
    },
    {
      image: "https://i.etsystatic.com/39814081/r/il/333c55/5075627972/il_fullxfull.5075627972_czri.jpg",
      title: "Secure Login",
      description:
        "Ensure your financial data is safe with secure authentication methods. Login securely and access your data with ease.",
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [activeFeature, setActiveFeature] = useState("");

  const handleFeatureHover = (feature) => {
    setActiveFeature(feature);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className={mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}>
      {/* Navigation */}
      <Navbar mode={mode} setMode={setMode} />

      {/* Carousel with seamless transition */}
      <div className="relative">
        <Carousel slides={slides} mode={mode} />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 opacity-40"
        ></div>
      </div>

      {/* Hero Section */}
      <section className="flex justify-center items-center h-[40vh] text-center px-5 py-10 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url("https://via.placeholder.com/1500x900")' }}
        ></div>
        <div className="max-w-3xl space-y-6 z-10">
          <h2 className={`text-4xl font-semibold ${mode === "dark" ? "text-white" : "text-black"} animate__animated animate__fadeIn animate__delay-1s`}>
            Track and Manage Your Finances with Ease
          </h2>
          <p className={`text-lg ${mode === "dark" ? "text-white" : "text-black"} animate__animated animate__fadeIn animate__delay-1.5s`}>
            Our app helps you track income, expenses, savings, and much more. Take control of your financial future today!
          </p>
          <Link to='/login'>
            <button className="mt-6 px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ease-in-out duration-300">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Interactive Image Section */}
      <section className={`mx-10 py-20 px-10 text-center ${mode === "light" ? "bg-[#d1d5db]" : "bg-gray-600"} text-white relative`}>
        <h2 className="text-3xl font-semibold mb-8">Our App in Action</h2>
        <div className="relative flex justify-center items-center">
          <div className="animate__animated animate__fadeIn animate__delay-2s">
            <img
              src="https://via.placeholder.com/150"
              alt="App in action"
              className="w-32 h-32 rounded-full transition transform hover:scale-110 duration-500"
            />
          </div>
          <div className="absolute top-0 left-0">
            <img
              src="https://via.placeholder.com/150"
              alt="App in action"
              className="w-32 h-32 rounded-full transition transform hover:scale-110 duration-500"
            />
          </div>
          <div className="absolute top-0 right-0">
            <img
              src="https://via.placeholder.com/150"
              alt="App in action"
              className="w-32 h-32 rounded-full transition transform hover:scale-110 duration-500"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-10">
  <div className={`p-6 rounded-lg`}>
    <h2 className={`text-3xl font-semibold text-center mb-8 ${mode === "dark" ? "text-white" : "text-blue-500"}`}>
      Key Features
    </h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
      {/* Budget Creation Feature */}
      <div
        className={`rounded-lg p-6 rounded-20 transition duration-300 ease-in-out group relative ${mode === "dark" ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white" : "bg-gradient-to-r from-blue-400 to-blue-200 text-white"}`}
        onClick={() => handleFeatureHover("Budget Creation")}
      >
        <h3 className="text-2xl font-semibold mb-4">Budget Creation</h3>
        <p>Set budgets for different categories and get alerts for overspending.</p>
        <div>Click for more details</div>
        <div className="absolute top-0 left-0 w-full h-full transition-opacity duration-300 ease-in-out group-hover:opacity-30"></div>
      </div>

      {/* Expense Categorization Feature */}
      <div
        className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out group relative ${mode === "dark" ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white" : "bg-gradient-to-r from-blue-400 to-blue-200 text-white"}`}
        onClick={() => handleFeatureHover("Expense Categorization")}
      >
        <h3 className="text-2xl font-semibold mb-4">Expense Categorization</h3>
        <p>Automatically categorize your expenses and track where your money goes.</p>
        <div>Click for more details</div>
        <div className="absolute top-0 left-0 w-full h-full transition-opacity duration-300 ease-in-out group-hover:opacity-30"></div>
      </div>

      {/* Visual Reports Feature */}
      <div
        className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out group relative ${mode === "dark" ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white" : "bg-gradient-to-r from-blue-400 to-blue-200 text-white"}`}
        onClick={() => handleFeatureHover("Visual Reports")}
      >
        <h3 className="text-2xl font-semibold mb-4">Visual Reports</h3>
        <p>Get visual insights into your spending habits with monthly and yearly reports.</p>
        <div>Click for more details</div>
        <div className="absolute top-0 left-0 w-full h-full transition-opacity duration-300 ease-in-out group-hover:opacity-30"></div>
      </div>
    </div>
  </div>
</section>



      {showModal && (
        <div
          className={`fixed inset-0 ${mode === "dark" ? "bg-gray-800" : "bg-gray-800"} bg-opacity-50 flex justify-center items-center z-50`}
        >
          <div
            className={`p-8 rounded-lg shadow-lg max-w-lg w-full ${mode === "dark"
              ? "bg-gradient-to-t from-gray-800 to-gray-600 opacity-90" // Dark mode gradient
              : "bg-gradient-to-r from-gray-200 to-gray-100 opacity-90" // Light mode gradient
              }`}
          >
            <h3 className="text-2xl font-semibold">{activeFeature}</h3>
            <p className="mt-4">
              More detailed information about the {activeFeature} feature will be displayed here.
            </p>
            <button
              onClick={handleCloseModal}
              className={`mt-6 px-6 py-2 rounded-lg transition duration-300 ease-in-out ${mode === "dark"
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer mode={mode} />
    </div>
  );
};

export default LandingPage;