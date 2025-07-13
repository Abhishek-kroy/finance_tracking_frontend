import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BudgetReport from "../components/BudgetReport";
import html2pdf from "html2pdf.js";
import { motion } from "framer-motion";
import {
    FaFileDownload,
    FaChartLine,
    FaSpinner,
    FaExclamationTriangle,
    FaPrint,
    FaShareAlt
} from "react-icons/fa";

const GenerateReport = ({ mode, setMode }) => {
    const [budget, setBudgets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [error, setError] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [showReportOptions, setShowReportOptions] = useState(false);
    const navigate = useNavigate();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4 }
        }
    };

    // Fetch budget data
    useEffect(() => {
        const fetchBudgets = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Unauthorized! Please log in again.");
                navigate("/login");
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(
                    "https://financetrackerbackend-production.up.railway.app/api/v1/getBudgetWithExpenses",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setBudgets(response.data.budgets || []);
            } catch (err) {
                console.error("Error fetching budgets:", err);
                setError("Failed to fetch budget data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchBudgets();
        // eslint-disable-next-line
    }, []);

    // Fetch AI response based on budget data
    useEffect(() => {
        const fetchData = async () => {
            if (!budget.length || !Array.isArray(budget)) {
                console.log("No valid budget data to process for AI response.");
                return;
            }

            let budgetDetail = "";
            budget.forEach((b) => {
                budgetDetail += `Budget Name: ${b.name}\n`;
                budgetDetail += `Total Amount for Budget: ${b.amount}\n`;
                budgetDetail += `Spent Amount: ${b.spentAmount}\n`;
                budgetDetail += `Start Date: ${b.startDate}\n`;
                budgetDetail += `End Date: ${b.endDate}\n`;

                if (b.expenses && b.expenses.length > 0) {
                    budgetDetail += `  Expenses:\n`;
                    b.expenses.forEach((e) => {
                        budgetDetail += `    - Amount: ${e.amount}\n`;
                        budgetDetail += `      Date: ${e.date}\n`;
                        budgetDetail += `      Description: ${e.description || "No description available"}\n`;
                    });
                } else {
                    budgetDetail += `  No expenses recorded for this budget.\n`;
                }

                budgetDetail += "\n"; // Separate budgets with a blank line
            });

            const promptData = {
                prompt: "Generate a detailed, styled budget report using Tailwind CSS, formatted for web rendering. The report should contain a series of individual sections for each budget, each in its own div with appropriate spacing from other sections. For each budget, include the following details:\n\n1. **Budget Overview**:\n   - Total Amount: Display the total allocated amount for the budget.\n   - Spent Amount: Show the total amount spent from the budget.\n   - Remaining: Display the remaining balance. If overspent, display 'Overspent' with the negative amount in red.\n   - Start Date: Display the starting date of the budget period.\n   - End Date: Display the end date of the budget period.\n\n2. **Expense Details**:\n   - List each recorded expense in an unordered list.\n   - Each expense should include:\n     - Amount: The cost of the expense.\n     - Date: The date when the expense occurred.\n     - Description: Provide a brief description if available, or state 'No description available.'\n\n3. **Suggestions**:\n   - Offer 2-3 actionable suggestions for improving budget management based on the observed spending behavior (e.g., ways to reduce overspending, organize spending, etc.).\n\n4. **Styling Guidelines**:\n   - Use Tailwind CSS classes that are compatible with both light and dark mode.\n   - Apply padding 'p-4', spacing 'space-y-4', borders 'border', and shadows 'shadow-md' for each section.\n   - Headings should have bold text 'font-bold' and appropriate sizes (e.g., 'text-lg', 'text-xl').\n   - For important details (like overspent amounts), use contrasting colors such as red 'text-red-500' to draw attention.\n   - Ensure the layout is responsive and visually appealing, keeping spacing consistent and details clearly separated.\n\nThe final response should be wrapped in a single <div> element containing all the formatted sections with Tailwind CSS classes applied to ensure proper styling and structure. The budget details (including amounts, expenses, and suggestions) are as follows:\n\n" + budgetDetail,
            };

            try {
                setAiLoading(true);
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Unauthorized! Please log in again.");
                    navigate("/login");
                    return;
                }

                const response = await axios.post(
                    "https://financetrackerbackend-production.up.railway.app/api/v1/getairesponse",
                    promptData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const responseData = response.data.response.replace(/```html|```/g, "");
                setAiResponse(responseData);

                // Show options after report is generated
                setShowReportOptions(true);
            } catch (error) {
                console.error("Error fetching AI response:", error);
                setError("Failed to fetch AI response. Please try again later.");
            } finally {
                setAiLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line
    }, [budget]);

    // Function to download PDF with fixed text visibility
    const downloadPDF = () => {
        // First, create a clone of the report content to modify
        const originalElement = document.getElementById("budget-report-content");
        const element = originalElement.cloneNode(true);

        // Create a temporary container for the PDF content
        const tempContainer = document.createElement('div');
        tempContainer.appendChild(element);
        document.body.appendChild(tempContainer);
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';

        // Fix styling for PDF export
        const style = document.createElement('style');
        style.textContent = `
      * {
        color: black !important;
        border-color: #ddd !important;
        background-color: white !important;
      }
      .text-red-500, .text-red-600 {
        color: #ef4444 !important;
      }
      .text-green-500, .text-green-600 {
        color: #22c55e !important;
      }
      .text-blue-500, .text-blue-600 {
        color: #3b82f6 !important;
      }
      h1, h2, h3, h4, h5, h6 {
        color: black !important;
        font-weight: bold !important;
      }
    `;
        tempContainer.appendChild(style);

        // Add a title to the PDF
        const title = document.createElement('h1');
        title.textContent = 'Budget Report';
        title.style.fontSize = '24px';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '20px';
        title.style.textAlign = 'center';
        element.prepend(title);

        // Configure PDF options with higher quality settings
        const options = {
            margin: 15,
            filename: 'budget-report.pdf',
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: false
            }
        };

        // Generate the PDF
        html2pdf()
            .from(element)
            .set(options)
            .save()
            .then(() => {
                // Clean up
                document.body.removeChild(tempContainer);
            });
    };

    // Function to share report - FIXED to share actual PDF
    const shareReport = async () => {
        try {
            // Show loading indicator
            setAiLoading(true);

            // First create the PDF blob
            const originalElement = document.getElementById("budget-report-content");
            const element = originalElement.cloneNode(true);

            // Apply the same styling fixes as in downloadPDF
            const style = document.createElement('style');
            style.textContent = `
        * {
          color: black !important;
          border-color: #ddd !important;
          background-color: white !important;
        }
        .text-red-500, .text-red-600 {
          color: #ef4444 !important;
        }
        .text-green-500, .text-green-600 {
          color: #22c55e !important;
        }
        .text-blue-500, .text-blue-600 {
          color: #3b82f6 !important;
        }
        h1, h2, h3, h4, h5, h6 {
          color: black !important;
          font-weight: bold !important;
        }
      `;
            element.appendChild(style);

            // Add a title
            const title = document.createElement('h1');
            title.textContent = 'Budget Report';
            title.style.fontSize = '24px';
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '20px';
            title.style.textAlign = 'center';
            element.prepend(title);

            // Configure options
            const options = {
                margin: 15,
                image: { type: 'jpeg', quality: 1.0 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    letterRendering: true
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait',
                    compress: false
                }
            };

            // Generate blob instead of saving directly
            const pdfBlob = await html2pdf()
                .from(element)
                .set(options)
                .outputPdf('blob');

            // Create a file from the blob
            const pdfFile = new File([pdfBlob], "budget-report.pdf", { type: "application/pdf" });

            // Check if Web Share API is available and supports files
            if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
                await navigator.share({
                    files: [pdfFile],
                    title: 'My Budget Report',
                    text: 'Check out my budget report generated with Finance Tracker!'
                });
            } else if (navigator.share) {
                // Fallback to sharing just text
                await navigator.share({
                    title: 'My Budget Report',
                    text: 'I\'ve generated a budget report with Finance Tracker!'
                });
            } else {
                alert('Sharing is not supported on this device or browser.');
            }
        } catch (err) {
            console.error('Share failed:', err);
            alert('Could not share the report: ' + (err.message || 'Unknown error'));
        } finally {
            setAiLoading(false);
        }
    };

    // Function to print report with fixed visibility
    const printReport = () => {
        const printContent = document.getElementById("budget-report-content");
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
      <html>
        <head>
          <title>Budget Report</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body { 
              padding: 20px; 
              color: black !important;
              background-color: white !important;
            }
            * {
              color: black !important;
              border-color: #ddd !important;
              background-color: white !important;
            }
            .text-red-500, .text-red-600 {
              color: #ef4444 !important;
            }
            .text-green-500, .text-green-600 {
              color: #22c55e !important;
            }
            .text-blue-500, .text-blue-600 {
              color: #3b82f6 !important;
            }
            h1, h2, h3, h4, h5, h6 {
              color: black !important;
              font-weight: bold !important;
            }
            @media print {
              body { 
                print-color-adjust: exact; 
                -webkit-print-color-adjust: exact; 
              }
            }
          </style>
        </head>
        <body>
          <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold mb-4">Budget Report</h1>
            ${printContent.innerHTML}
          </div>
          <script>
            // Force all text to be visible in print
            document.querySelectorAll('*').forEach(el => {
              el.style.color = '#000';
              if (el.classList.contains('text-red-500') || el.classList.contains('text-red-600')) {
                el.style.color = '#ef4444';
              }
              if (el.classList.contains('text-green-500') || el.classList.contains('text-green-600')) {
                el.style.color = '#22c55e';
              }
              if (el.classList.contains('text-blue-500') || el.classList.contains('text-blue-600')) {
                el.style.color = '#3b82f6';
              }
            });
          </script>
        </body>
      </html>
    `);

        printWindow.document.close();
        printWindow.focus();

        // Wait for content to load
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 1000); // Extended timeout to ensure content loads
    };

    return (
        <div className={`transition-colors duration-300 ${mode === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
        <div className="bg-gray-900 mt-10 mb-10"></div>
            <Navbar mode={mode} setMode={setMode} />

            <motion.div
                className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 ${mode === "dark" ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-b from-blue-50 via-white to-blue-50"}`}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div
                    className="max-w-4xl mx-auto"
                    variants={itemVariants}
                >
                    <div className="text-center mb-12">
                        <motion.div
                            className="mb-6 flex justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ duration: 0.8 }}
                        >
                            <FaChartLine className={`text-6xl ${mode === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                        </motion.div>

                        <motion.h1
                            className={`text-4xl font-extrabold mb-2 ${mode === "dark" ? "text-white" : "text-gray-900"}`}
                            variants={itemVariants}
                        >
                            Financial Report Generator
                        </motion.h1>

                        <motion.p
                            className={`text-lg ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}
                            variants={itemVariants}
                        >
                            Generate comprehensive AI-powered insights based on your budget data
                        </motion.p>
                    </div>

                    {loading ? (
                        <motion.div
                            className="flex flex-col items-center justify-center py-12"
                            variants={itemVariants}
                        >
                            <FaSpinner className={`animate-spin text-4xl mb-4 ${mode === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                            <p className="text-lg">Loading your budget data...</p>
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            className={`rounded-lg shadow-lg p-6 ${mode === "dark" ? "bg-red-900 border-red-700" : "bg-red-50 border-red-200"} border text-center`}
                            variants={itemVariants}
                        >
                            <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
                            <p className={`text-lg ${mode === "dark" ? "text-red-200" : "text-red-500"}`}>{error}</p>
                            <button
                                onClick={() => navigate("/dashboard")}
                                className={`mt-4 px-6 py-2 rounded-md font-medium transition-all ${mode === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                            >
                                Return to Dashboard
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            id="budget-report"
                            className={`rounded-xl shadow-xl overflow-hidden transition-all ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border`}
                            variants={itemVariants}
                        >
                            <div className={`py-6 px-8 border-b ${mode === "dark" ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-blue-50"}`}>
                                <h2 className="text-2xl font-bold">Your Budget Report</h2>
                                <p className={`${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                    Generated on {new Date().toLocaleDateString()}
                                </p>
                            </div>

                            <div
                                id="budget-report-content"
                                className="p-6 md:p-8"
                            >
                                {aiLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <FaSpinner className={`animate-spin text-5xl mb-4 ${mode === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                                        <p className="text-lg">Generating your personalized report...</p>
                                        <p className={`mt-2 text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                            Our AI is analyzing your budget data to provide insights
                                        </p>
                                    </div>
                                ) : aiResponse ? (
                                    <div className="animate-fadeIn">
                                        <BudgetReport aiResponse={aiResponse} mode={mode} />
                                    </div>
                                ) : (
                                    <p className="text-center py-12">No budget data available to generate a report.</p>
                                )}
                            </div>

                            {/*               

                    
              
              {/* Report options */}
                            {showReportOptions && !aiLoading && aiResponse && (
                                <motion.div
                                    className={`p-6 border-t ${mode === "dark" ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-blue-50"}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.4 }}
                                >
                                    <p className="text-lg font-medium mb-4">Report Options</p>
                                    <div className="flex flex-wrap gap-4">
                                        <button
                                            onClick={downloadPDF}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-md ${mode === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition-colors`}
                                        >
                                            <FaFileDownload /> Download as PDF
                                        </button>

                                        <button
                                            onClick={printReport}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-md ${mode === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} ${mode === "dark" ? "text-white" : "text-gray-800"} transition-colors`}
                                        >
                                            <FaPrint /> Print Report
                                        </button>

                                        <button
                                            onClick={shareReport}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-md ${mode === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} ${mode === "dark" ? "text-white" : "text-gray-800"} transition-colors`}
                                        >
                                            <FaShareAlt /> Share Report
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* Additional tips/information card */}
                    {!loading && !error && (
                        <motion.div
                            className={`mt-8 rounded-lg p-6 ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border shadow-md`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                        >
                            <h3 className="text-xl font-semibold mb-3">Understand Your Financial Report</h3>
                            <p className={`mb-4 ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                                Our AI-powered reports provide detailed insights and personalized suggestions to help you:
                            </p>
                            <ul className={`list-disc pl-5 space-y-2 ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                                <li>Identify spending patterns and potential areas for savings</li>
                                <li>Track your progress toward financial goals</li>
                                <li>Get actionable recommendations tailored to your unique situation</li>
                                <li>Visualize your financial data clearly and intuitively</li>
                            </ul>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>

            <Footer mode={mode} />

            {/* Global styles for animations */}
            <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default GenerateReport;