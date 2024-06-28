import React from 'react';
import { Link } from 'react-router-dom'; // assuming you are using react-router for navigation

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-extrabold text-center text-blue-500 mb-6">Privacy Policy</h1>
          <p className="text-gray-700 mb-6 text-justify">
            Welcome to our Privacy Policy page! When you use our app, you trust us with your information.
            This Privacy Policy is meant to help you understand what data we collect, why we collect it,
            and what we do with it. This is important; we hope you will take time to read it carefully.
          </p>
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Information We Collect</h2>
          <p className="text-gray-700 mb-6 text-justify">
            Our app provides a platform for users to discuss in the forum, read blogs, make budgets, track
            cryptocurrencies, and read news. To provide these services, we may collect the following types of information:
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-700">
            <li>Personal identification information (Name, email address, phone number, etc.)</li>
            <li>Financial information (for budget tracking and cryptocurrency tracking)</li>
            <li>Browsing and usage data</li>
          </ul>
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">How We Use Information</h2>
          <p className="text-gray-700 mb-6 text-justify">
            The information we collect from you is used in the following ways:
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-700">
            <li>To personalize your experience on our app</li>
            <li>To provide, operate, and maintain our services</li>
            <li>To improve our app and services</li>
            <li>To understand and analyze how you use our app</li>
            <li>To develop new products, services, features, and functionality</li>
            <li>To communicate with you, either directly or through one of our partners</li>
          </ul>
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Data Protection</h2>
          <p className="text-gray-700 mb-6 text-justify">
            We implement a variety of security measures to maintain the safety of your personal information.
            However, no method of transmission over the Internet or method of electronic storage is 100% secure,
            and we cannot guarantee its absolute security.
          </p>
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Changes to This Privacy Policy</h2>
          <p className="text-gray-700 mb-6 text-justify">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting
            the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically
            for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Contact Us</h2>
          <p className="text-gray-700 text-justify">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <p className="text-gray-700 text-justify">Email: support@example.com</p>
          <p className="text-gray-700 text-justify mb-6">Phone: (123) 456-7890</p>
          <div className="flex justify-center">
            <Link to="/" className="bg-white text-blue-500 font-semibold py-2 px-4 rounded ">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
