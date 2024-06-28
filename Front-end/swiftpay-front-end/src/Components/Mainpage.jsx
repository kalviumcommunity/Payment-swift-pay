import React, { useState, useEffect } from 'react';
import { auth } from '../../Firebase/Fire.config';
import Men from './../images/mainpage.png';
import Main from './Main';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Mainpage = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName);
    }
  }, []);

  return (
    <>
      <Main />
      <div className="sm:mb-8 md:flex flex-col md:flex-row justify-between items-start h-screen mt-8">
        {/* Left section */}
        <div className='md:w-1/2 px-8 md:pr-0'>
          <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-5 leading-tight text-center">
              Grow your <span className="text-blue-500">Money</span> With
              <span className="block text-2xl md:text-5xl font-bold mt-1">
                <span className="text-blue-500">Financial</span> hub
              </span>
            </h1>
            <p className="text-sm md:text-lg ml-2 text-center mb-5">
              {userName ? (
                <>Welcome aboard, <strong>{userName}</strong>! Step into a world of financial possibilities with Finance! Our experts are here to provide you with exciting, tailored solutions that delve into finance, investment, and a range of other services.</>
              ) : (
                <>Step into a world of financial possibilities with Finance! Our experts are here to provide you with exciting, tailored solutions that delve into finance, investment, and a range of other services. Welcome aboard!</>
              )}
            </p>
            <div className="flex mt-10">
              <button className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full mr-4 transition duration-300 ease-in-out transform hover:-translate-y-1">Learn More</button>
              <button className="bg-white text-blue-500 font-bold py-3 px-6 rounded-full border border-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1">Get Started</button>
            </div>
          </div>
        </div>
        {/* Right section */}
        <div className='md:w-1/2 hidden md:block flex justify-center items-center mt-6 md:mt-0 overflow-hidden'>
          <img src={Men} alt="Head" className="mx-auto max-w-2/3 md:max-w-full max-h-64 md:max-h-full mt-6 ml-5" />
        </div>
      </div>

      {/* Our Features Section */}
      <h2 className="text-4xl font-extrabold text-center text-blue-900 mb-8 mt-16">Our Features</h2>
      <p className="text-gray-700 mb-10 text-center">
        Explore the range of features we offer to enhance your experience.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <i className="fas fa-comments h-10 w-10 text-blue-500 mb-4 mx-auto text-4xl"></i>
          <h3 className="text-2xl font-semibold text-blue-800 mb-4 text-center">Forum Discussions</h3>
          <p className="text-gray-700 text-center">
            Engage in insightful discussions with other users in our forums.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <i className="fas fa-blog h-10 w-10 text-blue-500 mb-4 mx-auto text-4xl"></i>
          <h3 className="text-2xl font-semibold text-blue-800 mb-4 text-center">Blogs</h3>
          <p className="text-gray-700 text-center">
            Read and share your thoughts on various topics through our blogs.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <i className="fas fa-calculator h-10 w-10 text-blue-500 mb-4 mx-auto text-4xl"></i>
          <h3 className="text-2xl font-semibold text-blue-800 mb-4 text-center">Budget Making</h3>
          <p className="text-gray-700 text-center">
            Create and manage your budgets with our easy-to-use tools.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <i className="fas fa-chart-line h-10 w-10 text-blue-500 mb-4 mx-auto text-4xl"></i>
          <h3 className="text-2xl font-semibold text-blue-800 mb-4 text-center">Cryptocurrency Tracking</h3>
          <p className="text-gray-700 text-center">
            Track the latest trends and your investments in cryptocurrencies.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <i className="fas fa-newspaper h-10 w-10 text-blue-500 mb-4 mx-auto text-4xl"></i>
          <h3 className="text-2xl font-semibold text-blue-800 mb-4 text-center">News Reading</h3>
          <p className="text-gray-700 text-center">
            Stay updated with the latest news from various sources.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center h-full">
          <p className="text-gray-700 text-center">
            Coming soon......
          </p>
        </div>
      </div>
    </>
  );
}

export default Mainpage;
