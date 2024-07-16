import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faChartBar, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import 'tailwindcss/tailwind.css';
import bull from './../images/Bull.png';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';

const BudgetLanding = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="mx-auto max-w-6xl px-8 py-12 text-blue-500">
                {/* Header Section */}
                <header className="relative mb-12 text-center">
                    <img src={bull} alt="Bull" className="w-10 h-10 absolute top-0 left-0" />
                    <motion.h1
                        className="text-5xl font-bold text-blue-500"
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9 }}
                    >
                        Finance Buddy
                    </motion.h1>
                    <motion.p
                        className="text-xl mt-4 text-black"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        Your trusted tool for smart expense tracking and financial insights.
                    </motion.p>
                </header>

                {/* Hero Section */}
                <section className="flex flex-col-reverse md:flex-row items-center justify-between mb-12">
                    {/* Text Content */}
                    <div className="md:w-1/2 p-6">
                        <motion.h2
                            className="text-3xl font-semibold mb-4"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Track Your Spending, Lead Your Future
                        </motion.h2>
                        <motion.p
                            className="text-lg mb-6 text-black"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            Calculate with Confidence: Get Real-Time Financial Insights at Your Fingertips.
                        </motion.p>
                        <div className="flex space-x-4">
                            <Link to="/Budget">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg transition duration-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.7 }}
                                >
                                    Get Started
                                </motion.button>
                            </Link>
                            <a href="/" target="_blank" rel="noopener noreferrer">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg transition duration-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.7 }}
                                >
                                    Home
                                </motion.button>
                            </a>
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="md:w-1/2 p-6 flex justify-center">
                        <motion.img
                            src="https://th.bing.com/th/id/OIP.9rygV00aoLczekznaXefrwAAAA?rs=1&pid=ImgDetMain"
                            alt="blog"
                            className="rounded-lg shadow-lg w-4/5 transform transition duration-300 hover:scale-110"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        />
                    </div>
                </section>

                {/* Money Management Tips Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-center mb-6 text-blue-500">Money Management Tips</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Tip 1: Creating a Monthly Budget */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-blue-500 mb-2">Creating a Monthly Budget</h3>
                            <p className="text-gray-700">
                                Learn how to create a realistic monthly budget that helps you track your income and expenses effectively.
                            </p>
                            <Link to="/budgeting-tips">
                                <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg flex items-center hover:bg-indigo-700 transition duration-300">
                                    Learn More <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                                </button>
                            </Link>
                        </div>
                        {/* Tip 4: Managing Debt Efficiently */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-blue-500 mb-2">Managing Debt Efficiently</h3>
                            <p className="text-gray-700">
                                Explore strategies for managing and paying off debt effectively while maintaining your financial well-being.
                            </p>
                            <Link to="/debt-management">
                                <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg flex items-center hover:bg-indigo-700 transition duration-300">
                                    Learn More <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Video Play Area */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-center mb-6">How to Make a Budget</h2>
                    <div className="flex justify-center">
                        <ReactPlayer
                            url="https://youtu.be/7lHNMGoACdQ?si=UwJ7Trsl0evOh5NU"
                            className="rounded-lg shadow-lg"
                            width="100%"
                            height="400px"
                            controls
                        />
                    </div>
                </section>

                {/* Features Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Feature Cards */}
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FontAwesomeIcon icon={faCalculator} className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-blue-500 mb-2">Quick Expense Tracking</h3>
                        <p className="text-gray-700">
                            Easily log and track your daily expenses to stay within your budget.
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FontAwesomeIcon icon={faChartBar} className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-blue-500 mb-2">Visual Budget Insights</h3>
                        <p className="text-gray-700">
                            Get visual summaries of your spending and savings to make better financial decisions.
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FontAwesomeIcon icon={faClock} className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-blue-500 mb-2">Real-Time Monitoring</h3>
                        <p className="text-gray-700">
                            Monitor your expenses and budget in real time for immediate feedback.
                        </p>
                    </motion.div>
                </section>

                {/* Testimonials Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-center mb-8 text-blue-500">What Our Users Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-700 italic">
                                "This expense calculator app has completely changed the way I manage my finances. It's easy to use and incredibly helpful!"
                            </p>
                            <p className="text-blue-500 font-semibold mt-4">- Alex P.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-700 italic">
                                "I love how this app allows me to track my expenses in real-time. It's so efficient and user-friendly!"
                            </p>
                            <p className="text-blue-500 font-semibold mt-4">- Maria S.</p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-center mb-8 text-blue-500">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-blue-500 mb-2">How do I start tracking expenses?</h3>
                            <p className="text-gray-700">
                                To start tracking expenses, enter your daily spending in the app. You can categorize expenses for more detailed tracking.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-blue-500 mb-2">Can I set a budget for specific categories?</h3>
                            <p className="text-gray-700">
                                Yes, you can set budgets for different categories to help manage your spending more effectively.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="text-center text-black mt-6">
                    <p>&copy; {new Date().getFullYear()} Financial Times. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default BudgetLanding;
