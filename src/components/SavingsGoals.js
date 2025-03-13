import React, { useState } from 'react';

const SavingsGoals = ({ mode }) => {
  // Sample savings goals data
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Emergency Fund',
      target: 10000,
      current: 6500,
      deadline: '2025-06-30'
    },
    {
      id: 2,
      name: 'Vacation',
      target: 3000,
      current: 1200,
      deadline: '2025-07-15'
    },
    {
      id: 3,
      name: 'New Laptop',
      target: 1500,
      current: 800,
      deadline: '2025-04-01'
    }
  ]);

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadlineStr) => {
    const today = new Date();
    const deadline = new Date(deadlineStr);
    const timeDiff = deadline.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  };

  // Calculate monthly savings needed to reach goal
  const getMonthlyNeeded = (goal) => {
    const daysRemaining = getDaysRemaining(goal.deadline);
    const monthsRemaining = daysRemaining / 30;
    const remaining = goal.target - goal.current;
    
    if (monthsRemaining <= 0 || remaining <= 0) return 0;
    return remaining / monthsRemaining;
  };

  return (
    <div className={`w-full ${mode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
      <div className="space-y-4">
        {goals.map(goal => {
          const progress = (goal.current / goal.target) * 100;
          const daysRemaining = getDaysRemaining(goal.deadline);
          const monthlyNeeded = getMonthlyNeeded(goal);
          
          let statusColor = 'green';
          if (daysRemaining < 30) {
            statusColor = 'red';
          } else if (daysRemaining < 60) {
            statusColor = 'yellow';
          }
          
          return (
            <div 
              key={goal.id} 
              className={`p-4 rounded-lg ${
                mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{goal.name}</h3>
                <span className={`text-${statusColor}-500 text-sm font-medium`}>
                  {daysRemaining} days left
                </span>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span>${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              
              <div className="w-full h-2 bg-gray-300 rounded-full mb-3">
                <div 
                  className={`h-2 rounded-full bg-blue-500`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="text-sm">
                <p className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Need to save <span className="font-semibold">${monthlyNeeded.toFixed(2)}/month</span> to reach goal
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex justify-between">
        <button className={`px-4 py-2 rounded-lg ${
          mode === 'dark' 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white transition-colors`}>
          Add New Goal
        </button>
        
        <button className={`px-4 py-2 rounded-lg ${
          mode === 'dark' 
            ? 'bg-gray-600 hover:bg-gray-700' 
            : 'bg-gray-200 hover:bg-gray-300'
        } transition-colors`}>
          View All Goals
        </button>
      </div>
    </div>
  );
};

export default SavingsGoals;