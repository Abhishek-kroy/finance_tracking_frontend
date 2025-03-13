import React from 'react';

const BudgetOverview = ({ mode }) => {
  // Sample budget data
  const budgetData = [
    { category: 'Housing', budget: 1200, spent: 1150, color: 'blue' },
    { category: 'Food', budget: 600, spent: 580, color: 'green' },
    { category: 'Transportation', budget: 300, spent: 250, color: 'purple' },
    { category: 'Entertainment', budget: 200, spent: 220, color: 'red' },
    { category: 'Utilities', budget: 400, spent: 380, color: 'yellow' },
    { category: 'Shopping', budget: 300, spent: 350, color: 'orange' },
  ];

  return (
    <div className={`w-full ${mode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className={`${mode === 'dark' ? 'border-gray-700' : 'border-gray-300'} border-b`}>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Budget</th>
              <th className="py-3 px-4 text-left">Spent</th>
              <th className="py-3 px-4 text-left">Remaining</th>
              <th className="py-3 px-4 text-left">Progress</th>
            </tr>
          </thead>
          <tbody>
            {budgetData.map((item, index) => {
              const remaining = item.budget - item.spent;
              const percentage = (item.spent / item.budget) * 100;
              let progressColor = 'bg-green-500';
              
              if (percentage > 90) {
                progressColor = 'bg-red-500';
              } else if (percentage > 75) {
                progressColor = 'bg-yellow-500';
              }

              return (
                <tr 
                  key={index} 
                  className={`${mode === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'} border-b transition-colors`}
                >
                  <td className="py-3 px-4 flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-${item.color}-500 mr-2`}></div>
                    {item.category}
                  </td>
                  <td className="py-3 px-4">${item.budget}</td>
                  <td className="py-3 px-4">${item.spent}</td>
                  <td className={`py-3 px-4 ${remaining < 0 ? 'text-red-500 font-semibold' : ''}`}>
                    ${remaining}
                  </td>
                  <td className="py-3 px-4 w-1/4">
                    <div className="relative w-full h-2 bg-gray-300 rounded-full">
                      <div 
                        className={`absolute left-0 top-0 h-2 rounded-full ${progressColor}`} 
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs mt-1 inline-block">{percentage.toFixed(0)}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={`font-bold ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <td className="py-3 px-4">Total</td>
              <td className="py-3 px-4">
                ${budgetData.reduce((sum, item) => sum + item.budget, 0)}
              </td>
              <td className="py-3 px-4">
                ${budgetData.reduce((sum, item) => sum + item.spent, 0)}
              </td>
              <td className="py-3 px-4">
                ${budgetData.reduce((sum, item) => sum + (item.budget - item.spent), 0)}
              </td>
              <td className="py-3 px-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default BudgetOverview;