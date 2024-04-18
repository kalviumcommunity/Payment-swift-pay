import React from 'react';
import './FinancialTimes.css'; // Import CSS file for styling
import { Link } from 'react-router-dom';

const FinancialTimes = () => {
  return (
    <div className="financial-times">
      {/* Heading section */}
      <h1 className="font-serif text-4xl font-bold text-center mb-10 text-blue-500">Financial Times</h1>
      {/* Categories section */}
      <div className="categories flex justify-center">
        <Link to='/Crypto'><div className="category ml-10">Crypto</div></Link>
        <Link  to='/Business'><div className="category ml-16">Business</div></Link>
        <Link to='/Finance'><div className="category  ml-16">Finance</div></Link>
        <Link to='/Wealth'><div className="category ml-16">Wealth</div></Link>
        <Link to='/Stock'><div className="category ml-16">Stocks</div></Link>
        <Link to='/Job'><div className="category ml-16">Jobs</div></Link>
      </div>
      {/* Horizontal line */}
      <hr className="horizontal-line-gray" />
    </div>
  );
};

export default FinancialTimes;
