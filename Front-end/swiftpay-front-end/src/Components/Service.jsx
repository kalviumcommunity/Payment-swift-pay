import React from 'react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  return (
    <div className="min-h-screen  py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-10">
          <h1 className="text-4xl font-extrabold text-center text-blue-500 mb-8">Our Services</h1>
          <p className="text-gray-700 mb-10 text-center">
            Explore the range of services we offer to enhance your experience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-semibold text-blue-500 mb-4">Forum Discussions</h2>
              <p className="text-gray-700">
                Engage in insightful discussions with other users in our forums.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-semibold text-blue-500 mb-4">Blogs</h2>
              <p className="text-gray-700">
                Read and share your thoughts on various topics through our blogs.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-semibold text-blue-500 mb-4">Budget Making</h2>
              <p className="text-gray-700">
                Create and manage your budgets with our easy-to-use tools.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-semibold text-blue-500 mb-4">Cryptocurrency Tracking</h2>
              <p className="text-gray-700">
                Track the latest trends and your investments in cryptocurrencies.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-semibold text-blue-500 mb-4">News</h2>
              <p className="text-gray-700">
                Stay updated with the latest news from various sources.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md flex items-center justify-center h-full">
                <p className="text-gray-700">
                    Coming soon......
                </p>
        </div>
          </div>
          <div className="flex justify-center mt-10">
            <Link to="/" className="bg-white text-blue-500 font-semibold py-2 px-6 rounded ">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
