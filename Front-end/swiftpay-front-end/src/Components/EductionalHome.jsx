import React, { useState } from 'react';

// Sample data for courses
const coursesData = [
  {
    id: 1,
    name: 'Crypto Basics',
    imageUrl: 'crypto_image_url.jpg',
    topics: ['Introduction to Cryptocurrency', 'Blockchain Technology', 'Crypto Trading Strategies'],
    description: 'Learn the fundamentals of cryptocurrency, including blockchain technology and trading strategies.',
  },
  {
    id: 2,
    name: 'Business Fundamentals',
    imageUrl: 'business_image_url.jpg',
    topics: ['Entrepreneurship', 'Financial Management', 'Marketing Essentials'],
    description: 'Master the essential skills for running a successful business, from entrepreneurship to financial management.',
  },
  {
    id: 3,
    name: 'Investment Strategies',
    imageUrl: 'investment_image_url.jpg',
    topics: ['Stock Market Investing', 'Real Estate Investment', 'Portfolio Diversification'],
    description: 'Discover proven investment strategies for building wealth, including stock market investing and real estate investment.',
  },
  {
    id: 4,
    name: 'Personal Finance Management',
    imageUrl: 'personal_finance_image_url.jpg',
    topics: ['Budgeting', 'Saving and Investing', 'Debt Management'],
    description: 'Take control of your finances with techniques for budgeting, saving, investing, and managing debt.',
  },
  // Add more courses as needed
];

const HomePage = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  return (
    <div className=" mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Financial Educational App</h1>

      {/* Display selected course */}
      {selectedCourse && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">{selectedCourse.name}</h2>
          <img src={selectedCourse.imageUrl} alt={selectedCourse.name} className="w-full rounded-lg mb-2" />
          <p className="mb-2">{selectedCourse.description}</p>
          <h3 className="text-lg font-medium mb-2">Topics:</h3>
          <ul>
            {selectedCourse.topics.map((topic, index) => (
              <li key={index} className="ml-2">{topic}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display list of courses */}
      <div className="grid grid-cols-2 gap-4">
        {coursesData.map((course) => (
          <div key={course.id} className="bg-gray-100 p-4 rounded-lg cursor-pointer" onClick={() => handleCourseClick(course)}>
            <img src={course.imageUrl} alt={course.name} className="w-full rounded-lg mb-2" />
            <h2 className="text-lg font-semibold">{course.name}</h2>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
