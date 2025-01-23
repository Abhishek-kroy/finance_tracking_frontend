import React from 'react';

const BudgetReport = ({ aiResponse }) => {
  return (
    <div>
      <h1>AI Generated Budget Report</h1>
      <div dangerouslySetInnerHTML={{ __html: aiResponse }} />
    </div>
  );
};

export default BudgetReport;