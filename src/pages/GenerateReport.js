import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BudgetReport from "../components/BudgetReport";
import html2pdf from "html2pdf.js";  // Import the html2pdf library

const GenerateReport = ({ mode, setMode }) => {
    const [budget, setBudgets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [error, setError] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const navigate = useNavigate();

    // Fetch budget data
    useEffect(() => {
        const fetchBudgets = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Unauthorized! Please log in again.");
                navigate("/login");
                return;
            }

            console.log("Fetching budgets...");

            try {
                setLoading(true);
                const response = await axios.get("https://finance-tracker-backend-0h5z.onrender.com/api/v1/getBudgetWithExpenses", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Budget data received:", response.data.budgets); // Log the received data
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
            budget.forEach(b => {
                budgetDetail += `Budget Name: ${b.name}\n`;
                budgetDetail += `Total Amount for Budget: ${b.amount}\n`;
                budgetDetail += `Spent Amount: ${b.spentAmount}\n`;
                budgetDetail += `Start Date: ${b.startDate}\n`;
                budgetDetail += `End Date: ${b.endDate}\n`;

                if (b.expenses && b.expenses.length > 0) {
                    budgetDetail += `  Expenses:\n`;
                    b.expenses.forEach(e => {
                        budgetDetail += `    - Amount: ${e.amount}\n`;
                        budgetDetail += `      Date: ${e.date}\n`;
                        budgetDetail += `      Description: ${e.description || "No description available"}\n`;
                    });
                } else {
                    budgetDetail += `  No expenses recorded for this budget.\n`;
                }

                budgetDetail += '\n'; // Separate budgets with a blank line
            });

            const promptData = {
                prompt: "Generate a detailed, styled budget report using Tailwind CSS, formatted for web rendering. The report should contain a series of individual sections for each budget, each in its own div with appropriate spacing from other sections. For each budget, include the following details:\n\n1. **Budget Overview**:\n   - Total Amount: Display the total allocated amount for the budget.\n   - Spent Amount: Show the total amount spent from the budget.\n   - Remaining: Display the remaining balance. If overspent, display 'Overspent' with the negative amount in red.\n   - Start Date: Display the starting date of the budget period.\n   - End Date: Display the end date of the budget period.\n\n2. **Expense Details**:\n   - List each recorded expense in an unordered list.\n   - Each expense should include:\n     - Amount: The cost of the expense.\n     - Date: The date when the expense occurred.\n     - Description: Provide a brief description if available, or state 'No description available.'\n\n3. **Suggestions**:\n   - Offer 2-3 actionable suggestions for improving budget management based on the observed spending behavior (e.g., ways to reduce overspending, organize spending, etc.).\n\n4. **Styling Guidelines**:\n   - Use Tailwind CSS classes to ensure the report is styled clearly and responsively.\n   - Apply padding 'p-4', spacing 'space-y-4', borders 'border', and shadows 'shadow-md' for each section.\n   - Headings should have bold text 'font-bold' and appropriate sizes (e.g., 'text-lg', 'text-xl').\n   - For important details (like overspent amounts), use contrasting colors such as red 'text-red-500' to draw attention.\n   - Ensure the layout is responsive and visually appealing, keeping spacing consistent and details clearly separated.\n\nThe final response should be wrapped in a single <div> element containing all the formatted sections with Tailwind CSS classes applied to ensure proper styling and structure. The budget details (including amounts, expenses, and suggestions) are as follows:\n\n" + budgetDetail,
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
                    "https://finance-tracker-backend-0h5z.onrender.com/api/v1/getairesponse",
                    promptData, // Correctly pass the promptData here
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                console.log("AI response received:", response.data); // Log the AI response
                const responseData = response.data.response.replace(/```html|```/g, '');

                // Now set the cleaned response to the state variable
                setAiResponse(responseData);

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

    // Function to download PDF
    const downloadPDF = () => {
        const element = document.getElementById("budget-report");
        const options = {
            margin: 0,
            filename: 'budget-report.pdf',
            html2canvas: { scale: 1.5 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };
        html2pdf().from(element).set(options).save();
    };

    return (
        <div>
            <Navbar mode={mode} setMode={setMode} />
            <div id="budget-report" className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-400 text-white flex flex-col items-center p-6">
                <h1 className="text-4xl font-bold mb-4">Expense Report</h1>
                <p className="text-lg mb-8">Generate your financial report for the current month based on your budget.</p>
    
                {loading ? (
                    <p className="mt-6 text-lg">Loading your budget data...</p>
                ) : error ? (
                    <p className="mt-6 text-lg text-red-500">{error}</p>
                ) : (
                    budget && (
                        <div className="bg-white rounded-lg shadow-lg p-6 mt-8 w-[100vw] max-w-3xl text-gray-800 overflow-auto">
                            <h2 className="text-xl font-bold mb-4">Generated Budget Report</h2>
                            {aiLoading ? (
                                <p>Generating AI response...</p>
                            ) : aiResponse ? (
                                <div> 
                                    <BudgetReport aiResponse={aiResponse} />
                                    <button
                                        onClick={downloadPDF}
                                        className="mt-6 py-2 px-4 bg-blue-500 text-white rounded-md"
                                    >
                                        Download as PDF
                                    </button>
                                </div>
                            ) : (
                                <p>No AI response generated yet.</p>
                            )}
                        </div>
                    )
                )}
            </div>
            <Footer mode={mode} />
        </div>
    );        
};

export default GenerateReport;