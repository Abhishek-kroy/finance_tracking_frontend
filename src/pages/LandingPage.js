import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { FaChartLine, FaWallet, FaChartPie } from "react-icons/fa";

const LandingPage = ({ mode, setMode }) => {
  // const slides = [
  //   {
  //     image: "https://assets.ycodeapp.com/assets/app18525/images/O30b82M5XoLnXIuKHKs8lp6FaEXgy51OgyMLtdAk-published.webp",
  //     title: "Budget Creation",
  //     description:
  //       "Create and manage budgets for different categories like savings, rent, utilities, and more. Stay on top of your spending!",
  //     icon: <FaWallet className="text-4xl mb-4" />
  //   },
  //   {
  //     image: "https://i.etsystatic.com/39814081/r/il/333c55/5075627972/il_fullxfull.5075627972_czri.jpg",
  //     title: "Expense Tracking",
  //     description:
  //       "Track all your expenses with ease. Categorize and review your spending to make sure you're sticking to your budget.",
  //     icon: <FaChartLine className="text-4xl mb-4" />
  //   },
  //   {
  //     image: "https://i.etsystatic.com/39814081/r/il/333c55/5075627972/il_fullxfull.5075627972_czri.jpg",
  //     title: "Reports and Insights",
  //     description:
  //       "Generate visual reports to understand your financial habits. View monthly and yearly summaries to improve your financial strategy.",
  //     icon: <FaChartPie className="text-4xl mb-4" />
  //   },
  //   {
  //     image: "https://i.etsystatic.com/39814081/r/il/333c55/5075627972/il_fullxfull.5075627972_czri.jpg",
  //     title: "Tax Calculations",
  //     description:
  //       "Estimate your taxes based on your income and expenses. Set reminders for important filing dates and avoid penalties.",
  //     icon: <FaCalculator className="text-4xl mb-4" />
  //   },
  //   {
  //     image: "https://i.etsystatic.com/39814081/r/il/333c55/5075627972/il_fullxfull.5075627972_czri.jpg",
  //     title: "Bank Sync",
  //     description:
  //       "Sync with your bank account to automatically import transactions. Categorize them for a complete overview of your finances.",
  //     icon: <FaSyncAlt className="text-4xl mb-4" />
  //   },
  //   {
  //     image: "https://i.etsystatic.com/39814081/r/il/333c55/5075627972/il_fullxfull.5075627972_czri.jpg",
  //     title: "Secure Login",
  //     description:
  //       "Ensure your financial data is safe with secure authentication methods. Login securely and access your data with ease.",
  //     icon: <FaLock className="text-4xl mb-4" />
  //   },
  // ];
  // Carousel data with detailed slides
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3",
      title: "Track Expenses On The Go",
      description: "Capture receipts instantly with our mobile app and have them automatically categorized.",
      color: "from-blue-400 to-blue-600"
    },
    {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3",
      title: "Visualize Your Financial Health",
      description: "Interactive charts and reports give you insights into spending patterns and saving opportunities.",
      color: "from-green-400 to-green-600"
    },
    {
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3",
      title: "Set & Achieve Financial Goals",
      description: "Create custom savings goals with timeline projections and automatic progress tracking.",
      color: "from-purple-400 to-purple-600"
    },
    {
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3",
      title: "Intelligent Budget Recommendations",
      description: "Our AI analyzes your spending habits to suggest personalized budget allocations that work for you.",
      color: "from-red-400 to-red-600"
    }
  ];

  const [showModal, setShowModal] = useState(false);
  const [activeFeature, setActiveFeature] = useState("");
  const [featureDetails, setFeatureDetails] = useState("");
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    app: false,
  });

  // Scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      
      // Get positions of sections
      const heroSection = document.getElementById("hero-section");
      const featuresSection = document.getElementById("features-section");
      const appSection = document.getElementById("app-section");
      
      if (heroSection && scrollPosition > heroSection.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, hero: true }));
      }
      
      if (featuresSection && scrollPosition > featuresSection.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, features: true }));
      }
      
      if (appSection && scrollPosition > appSection.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, app: true }));
      }
    };

    // Initial check
    handleScroll();
    
    // Add scroll listener
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleFeatureHover = (feature) => {
    setActiveFeature(feature);
    
    // Set detailed information based on the feature
    switch (feature) {
      case "Budget Creation":
        setFeatureDetails(`Create personalized budgets for all aspects of your financial life. 
        Our intelligent budget creator suggests optimal allocations based on your income and financial goals. 
        Set monthly targets, track progress in real-time, and receive alerts when you approach your limits. 
        Adjust categories anytime to match your changing priorities.`);
        break;
      case "Expense Categorization":
        setFeatureDetails(`Our AI-powered system automatically categorizes your expenses with 98% accuracy. 
        Customize categories to match your unique spending habits, split transactions between multiple categories, 
        and use tags for detailed filtering. Get insights into spending patterns and identify areas for potential savings.`);
        break;
      case "Visual Reports":
        setFeatureDetails(`Transform your financial data into beautiful, easy-to-understand visualizations. 
        View spending breakdowns by category, track your net worth over time, and analyze income vs. expenses trends. 
        Export reports as PDFs or spreadsheets, and set up automated monthly financial summaries delivered to your inbox.`);
        break;
      default:
        setFeatureDetails("More detailed information about this feature will be displayed here.");
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className={`min-h-screen ${mode === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"} transition-colors duration-300`}>
    <div className="bg-gray-900 mt-10 mb-10"></div>
      {/* Navigation */}
      <Navbar mode={mode} setMode={setMode} />

      {/* Carousel with improved transition */}
      <div className="relative">
        <Carousel slides={slides} mode={mode} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 opacity-40"></div>
      </div>

      {/* Hero Section with animation */}
      <section 
        id="hero-section"
        className={`flex justify-center items-center h-[60vh] text-center px-5 py-16 relative overflow-hidden transition-all duration-1000 ease-in-out ${isVisible.hero ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
      >
        <div className="absolute inset-0 bg-cover bg-center opacity-30 transform hover:scale-105 transition-transform duration-7000"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3")' }}
        ></div>
        <div className="max-w-4xl space-y-8 z-10 py-10">
          <h1 className={`text-5xl md:text-7xl font-bold ${mode === "dark" ? "text-white" : "text-gray-800"} leading-tight`}>
            Financial Freedom <span className="text-blue-500">Starts Here</span>
          </h1>
          <h2 className={`text-3xl font-semibold ${mode === "dark" ? "text-gray-200" : "text-gray-700"}`}>
            Track and Manage Your Finances with Ease
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Our app helps you track income, expenses, savings, and investments all in one place. 
            Take control of your financial future today with powerful insights and easy-to-use tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to='/login'>
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300 shadow-lg text-lg font-semibold">
                Get Started Now
              </button>
            </Link>
            <Link to='/demo'>
              <button className={`px-8 py-4 rounded-lg transform hover:scale-105 transition duration-300 shadow-lg text-lg font-semibold ${mode === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>
                Watch Demo
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className={`py-16 ${mode === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <div className={`text-4xl font-bold mb-2 ${mode === "dark" ? "text-blue-400" : "text-blue-600"}`}>500K+</div>
              <div className={`${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>Active Users</div>
            </div>
            <div className="p-6">
              <div className={`text-4xl font-bold mb-2 ${mode === "dark" ? "text-blue-400" : "text-blue-600"}`}>$2.5B</div>
              <div className={`${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>Transactions Tracked</div>
            </div>
            <div className="p-6">
              <div className={`text-4xl font-bold mb-2 ${mode === "dark" ? "text-blue-400" : "text-blue-600"}`}>98%</div>
              <div className={`${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>Satisfaction Rate</div>
            </div>
            <div className="p-6">
              <div className={`text-4xl font-bold mb-2 ${mode === "dark" ? "text-blue-400" : "text-blue-600"}`}>30%</div>
              <div className={`${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>Average Savings Increase</div>
            </div>
          </div>
        </div>
      </section>

      {/* App Showcase Section with animations */}
      <section 
        id="app-section" 
        className={`py-24 px-8 text-center ${mode === "dark" ? "bg-gray-700" : "bg-blue-50"} relative transition-all duration-1000 ease-in-out ${isVisible.app ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl font-bold mb-12 ${mode === "dark" ? "text-white" : "text-gray-800"}`}>
            See Our App in Action
          </h2>
          
          <div className="relative flex justify-center items-center h-[500px]">
            {/* Center device - main phone mockup */}
            <div className="relative z-30 transform transition-all duration-500 hover:scale-110 hover:-translate-y-4">
              <div className={`w-64 h-[500px] rounded-3xl overflow-hidden border-8 ${mode === "dark" ? "border-gray-800" : "border-gray-300"} shadow-2xl`}>
                <img
                  src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3"
                  alt="Financial dashboard"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-70 text-white p-4 rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Main Dashboard</h3>
                    <p className="text-sm">Complete financial overview with real-time updates</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Multiple floating UI elements */}
            <div className="absolute top-10 -left-4 md:left-20 z-10 transform -rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-110">
              <div className={`w-48 h-48 rounded-2xl overflow-hidden shadow-xl ${mode === "dark" ? "bg-gray-800" : "bg-white"} p-3`}>
                <div className={`text-left mb-2 ${mode === "dark" ? "text-blue-400" : "text-blue-600"} font-bold`}>Monthly Budget</div>
                <div className="w-full h-32 bg-blue-100 rounded-lg overflow-hidden">
                  <div className="h-1/2 bg-blue-500 rounded-t-lg"></div>
                  <div className="flex justify-between px-2 py-1 text-xs text-gray-600">
                    <span>$1,240 spent</span>
                    <span>$2,500 total</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-20 -left-4 md:left-40 z-10 transform rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-110">
              <div className={`w-44 h-44 rounded-2xl overflow-hidden shadow-xl ${mode === "dark" ? "bg-gray-800" : "bg-white"} p-3`}>
                <div className={`text-left mb-2 ${mode === "dark" ? "text-green-400" : "text-green-600"} font-bold`}>Spending by Category</div>
                <div className="w-full h-32 bg-green-100 rounded-lg overflow-hidden p-2">
                  <div className="h-6 bg-green-500 rounded-sm mb-1 w-full"></div>
                  <div className="h-6 bg-blue-500 rounded-sm mb-1 w-3/4"></div>
                  <div className="h-6 bg-purple-500 rounded-sm mb-1 w-1/2"></div>
                  <div className="h-6 bg-yellow-500 rounded-sm w-1/4"></div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-20 -right-4 md:right-40 z-10 transform -rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-110">
              <div className={`w-44 h-44 rounded-2xl overflow-hidden shadow-xl ${mode === "dark" ? "bg-gray-800" : "bg-white"} p-3`}>
                <div className={`text-left mb-2 ${mode === "dark" ? "text-purple-400" : "text-purple-600"} font-bold`}>Recurring Bills</div>
                <div className="w-full h-32 bg-purple-100 rounded-lg overflow-hidden p-2">
                  <div className="flex justify-between items-center mb-2 text-xs">
                    <span>Netflix</span>
                    <span className="bg-purple-200 px-2 py-1 rounded">$14.99</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-xs">
                    <span>Utilities</span>
                    <span className="bg-purple-200 px-2 py-1 rounded">$85.50</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Rent</span>
                    <span className="bg-purple-200 px-2 py-1 rounded">$1,200</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Rent</span>
                    <span className="bg-purple-200 px-2 py-1 rounded">$1,200</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-10 -right-4 md:right-20 z-10 transform rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-110">
              <div className={`w-48 h-48 rounded-2xl overflow-hidden shadow-xl ${mode === "dark" ? "bg-gray-800" : "bg-white"} p-3`}>
                <div className={`text-left mb-2 ${mode === "dark" ? "text-red-400" : "text-red-600"} font-bold`}>Savings Goal</div>
                <div className="w-full h-32 bg-red-100 rounded-lg overflow-hidden p-2">
                  <div className="text-center mb-2 text-xs">Vacation Fund</div>
                  <div className="h-4 w-full bg-gray-200 rounded-full">
                    <div className="h-4 bg-red-500 rounded-full w-2/3"></div>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span>$2,000 saved</span>
                    <span>$3,000 goal</span>
                  </div>
                  <div className="text-center mt-4 text-xs text-red-600 font-semibold">67% complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with improved design and animations */}
      <section 
        id="features-section" 
        className={`py-24 px-6 ${mode === "dark" ? "bg-gray-800" : "bg-white"} transition-all duration-1000 ease-in-out ${isVisible.features ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-16 ${mode === "dark" ? "text-white" : "text-gray-800"}`}>
            <span className="border-b-4 border-blue-500 pb-2">Key Features</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Budget Creation Feature */}
            <div
              className={`rounded-xl p-8 transition duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl group relative overflow-hidden ${
                mode === "dark" 
                  ? "bg-gradient-to-br from-gray-700 to-gray-900 text-white border border-gray-700" 
                  : "bg-gradient-to-br from-white to-blue-50 text-gray-800 border border-gray-200 shadow-lg"
              }`}
              onClick={() => handleFeatureHover("Budget Creation")}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-10 rounded-full -mr-10 -mt-10 transform group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className={`text-5xl mb-6 ${mode === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                <FaWallet />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">Budget Creation</h3>
              
              <p className={`mb-6 ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Set budgets for different categories and get alerts when you're approaching limits. Our intelligent system adapts to your spending habits.
              </p>
              
              <button 
                className={`py-2 px-4 rounded-lg text-sm font-medium transition duration-300 ${
                  mode === "dark" 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Learn More
              </button>
            </div>

            {/* Expense Categorization Feature */}
            <div
              className={`rounded-xl p-8 transition duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl group relative overflow-hidden ${
                mode === "dark" 
                  ? "bg-gradient-to-br from-gray-700 to-gray-900 text-white border border-gray-700" 
                  : "bg-gradient-to-br from-white to-blue-50 text-gray-800 border border-gray-200 shadow-lg"
              }`}
              onClick={() => handleFeatureHover("Expense Categorization")}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-10 rounded-full -mr-10 -mt-10 transform group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className={`text-5xl mb-6 ${mode === "dark" ? "text-green-400" : "text-green-600"}`}>
                <FaChartLine />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">Expense Categorization</h3>
              
              <p className={`mb-6 ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Automatically categorize your expenses with AI and track where your money goes. Customize categories to match your unique spending patterns.
              </p>
              
              <button 
                className={`py-2 px-4 rounded-lg text-sm font-medium transition duration-300 ${
                  mode === "dark" 
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                Learn More
              </button>
            </div>

            {/* Visual Reports Feature */}
            <div
              className={`rounded-xl p-8 transition duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl group relative overflow-hidden ${
                mode === "dark" 
                  ? "bg-gradient-to-br from-gray-700 to-gray-900 text-white border border-gray-700" 
                  : "bg-gradient-to-br from-white to-blue-50 text-gray-800 border border-gray-200 shadow-lg"
              }`}
              onClick={() => handleFeatureHover("Visual Reports")}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 opacity-10 rounded-full -mr-10 -mt-10 transform group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className={`text-5xl mb-6 ${mode === "dark" ? "text-purple-400" : "text-purple-600"}`}>
                <FaChartPie />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">Visual Reports</h3>
              
              <p className={`mb-6 ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Get visual insights into your spending habits with beautiful charts and graphs. Export reports or schedule automated financial summaries.
              </p>
              
              <button 
                className={`py-2 px-4 rounded-lg text-sm font-medium transition duration-300 ${
                  mode === "dark" 
                    ? "bg-purple-600 text-white hover:bg-purple-700" 
                    : "bg-purple-500 text-white hover:bg-purple-600"
                }`}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 px-6 ${mode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-16 ${mode === "dark" ? "text-white" : "text-gray-800"}`}>
            <span className="border-b-4 border-blue-500 pb-2">What Our Users Say</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className={`p-8 rounded-xl ${mode === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg relative`}>
              <div className="absolute -top-5 -left-5 text-5xl text-blue-500 opacity-20">"</div>
              <p className={`mb-6 italic ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                "This app has completely transformed how I manage my finances. I've saved over $3,000 in just 6 months by identifying areas where I was overspending."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">JD</span>
                </div>
                <div className="ml-4">
                  <div className={`font-bold ${mode === "dark" ? "text-white" : "text-gray-800"}`}>Jessica D.</div>
                  <div className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>Marketing Director</div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className={`p-8 rounded-xl ${mode === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg relative`}>
              <div className="absolute -top-5 -left-5 text-5xl text-blue-500 opacity-20">"</div>
              <p className={`mb-6 italic ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                "As a freelancer, tracking my expenses was always a nightmare until I found this app. The tax calculation feature has saved me countless hours during tax season."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
                  <span className="text-green-600 font-bold">MT</span>
                </div>
                <div className="ml-4">
                  <div className={`font-bold ${mode === "dark" ? "text-white" : "text-gray-800"}`}>Michael T.</div>
                  <div className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>Freelance Developer</div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className={`p-8 rounded-xl ${mode === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg relative`}>
              <div className="absolute -top-5 -left-5 text-5xl text-blue-500 opacity-20">"</div>
              <p className={`mb-6 italic ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                "The visual reports make it so easy to see where my money is going. I've finally been able to start saving for retirement consistently thanks to this app."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
                  <span className="text-purple-600 font-bold">SL</span>
                </div>
                <div className="ml-4">
                  <div className={`font-bold ${mode === "dark" ? "text-white" : "text-gray-800"}`}>Sarah L.</div>
                  <div className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>Teacher</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${mode === "dark" ? "bg-gray-800" : "bg-blue-100"}`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className={`text-4xl font-bold mb-6 ${mode === "dark" ? "text-white" : "text-gray-800"}`}>
            Ready to Take Control of Your Finances?
          </h2>
          <p className={`text-xl max-w-2xl mx-auto mb-10 ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Join thousands of users who have transformed their financial lives with our powerful yet easy-to-use app.
          </p>
          <Link to='/signup'>
            <button className="px-10 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300 shadow-lg text-lg font-semibold">
              Start Your Free Trial
            </button>
          </Link>
          <p className={`mt-4 text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            No credit card required. 30-day free trial.
          </p>
        </div>
      </section>

      {/* Enhanced Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className={`p-10 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 ease-out scale-100 ${
              mode === "dark"
                ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700" 
                : "bg-white text-gray-800 border border-gray-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-bold mb-4 flex items-center">
              {activeFeature === "Budget Creation" && <FaWallet className="mr-3 text-blue-500" />}
              {activeFeature === "Expense Categorization" && <FaChartLine className="mr-3 text-green-500" />}
              {activeFeature === "Visual Reports" && <FaChartPie className="mr-3 text-purple-500" />}
              {activeFeature}
            </h3>
            
            <div className={`w-20 h-1 ${
              activeFeature === "Budget Creation" ? "bg-blue-500" : 
              activeFeature === "Expense Categorization" ? "bg-green-500" : 
              "bg-purple-500"
            } mb-6`}></div>
            
            <p className={`mt-4 text-lg leading-relaxed ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              {featureDetails}
            </p>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleCloseModal}
                className={`px-6 py-3 rounded-lg transition duration-300 ease-in-out text-white font-medium ${
                  activeFeature === "Budget Creation" ? "bg-blue-600 hover:bg-blue-700" : 
                  activeFeature === "Expense Categorization" ? "bg-green-600 hover:bg-green-700" : 
                  "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer mode={mode} />
    </div>
  );
};

export default LandingPage;