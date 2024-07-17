import React from 'react';
import './FinancialTimes.css'; // Import additional CSS file if needed
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const FinancialTimes = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="financial-times mx-auto p-4 relative">
        {/* Back Icon */}
        <FaArrowLeft 
          className="text-2xl cursor-pointer text-blue-500 absolute top-4 left-4"
          onClick={() => navigate('/mainpage')}
        />

        {/* Heading section */}
        <h1 className="font-serif text-4xl font-bold text-center mb-10 text-blue-500">
          Financial Times
        </h1>

        {/* Categories section */}
        <div className="categories flex flex-wrap justify-center gap-4">
          <Link to="/Crypto">
            <div className="category pr-4 ml-6 text-black rounded-md text-center">
              Crypto
            </div>
          </Link>
          <Link to="/Business">
            <div className="category pr-4 ml-6 text-black rounded-md text-center">
              Business
            </div>
          </Link>
          <Link to="/Finance">
            <div className="category pr-4 ml-6 text-black rounded-md text-center">
              Finance
            </div>
          </Link>
          <Link to="/Stock">
            <div className="category pr-4 ml-6 text-black rounded-md text-center">
              Stocks
            </div>
          </Link>
        </div>

        {/* Horizontal line */}
        <hr className="my-8 border-gray-300" />
      </div>
    </>
  );
};

export default FinancialTimes;
