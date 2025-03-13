import React from 'react';

const RecentTransactions = ({ mode }) => {
  // Sample transaction data
  const transactions = [
    {
      id: 1,
      date: '2025-03-10',
      merchant: 'Grocery Store',
      category: 'Food',
      amount: 85.42,
      type: 'expense'
    },
    {
      id: 2,
      date: '2025-03-08',
      merchant: 'Gas Station',
      category: 'Transportation',
      amount: 45.00,
      type: 'expense'
    },
    {
      id: 3,
      date: '2025-03-07',
      merchant: 'Restaurant',
      category: 'Food',
      amount: 62.50,
      type: 'expense'
    },
    {
      id: 4,
      date: '2025-03-05',
      merchant: 'Amazon',
      category: 'Shopping',
      amount: 129.99,
      type: 'expense'
    },
    {
      id: 5,
      date: '2025-03-01',
      merchant: 'Salary Deposit',
      category: 'Income',
      amount: 3200.00,
      type: 'income'
    }
  ];

  // Function to format dates
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Function to get category icon (simplified with emoji for this example)
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'food': return '🍔';
      case 'transportation': return '🚗';
      case 'shopping': return '🛍️';
      case 'income': return '💰';
      default: return '💳';
    }
  };

  return (
    <div className={`w-full ${mode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
      <div className="overflow-y-auto max-h-80">
        {transactions.map(transaction => (
          <div 
            key={transaction.id} 
            className={`flex items-center p-3 mb-2 rounded-lg ${
              mode === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-50 hover:bg-gray-100'
            } transition-colors`}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              transaction.type === 'income' 
                ? 'bg-green-100 text-green-500' 
                : 'bg-blue-100 text-blue-500'
            }`}>
              {getCategoryIcon(transaction.category)}
            </div>
            
            <div className="ml-4 flex-grow">
              <div className="flex justify-between">
                <p className="font-semibold">{transaction.merchant}</p>
                <p className={`font-bold ${
                  transaction.type === 'income' 
                    ? 'text-green-500' 
                    : mode === 'dark' ? 'text-red-400' : 'text-red-500'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <p>{transaction.category}</p>
                <p>{formatDate(transaction.date)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button className={`px-4 py-2 rounded-lg ${
          mode === 'dark' 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white transition-colors`}>
          View All Transactions
        </button>
      </div>
    </div>
  );
};

export default RecentTransactions;