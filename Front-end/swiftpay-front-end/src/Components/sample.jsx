import React from 'react';
import { motion } from 'framer-motion';
import { FaCoins, FaListAlt, FaBell } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import Bit from "./../images/Bitcoin.jpg"
import Eth from "./../images/Eth.png"
import bull from './../images//Bull.png';

const LandingPage = () => {
    // Sample data for latest news
    const latestNews = [
        {
            headline: 'Bitcoin Breaks New Record High',
            description: 'Bitcoin has reached a new all-time high, surpassing $60,000.',
            image: Bit, // Directly use the bull variable as the image URL
        },
        {
            headline: 'Ethereum Upgrades EIP-1559',
            description: 'The Ethereum network has successfully upgraded its fee structure with EIP-1559.',
            image: Eth,
        },
        {
            headline: 'Ripple Expands Partnerships in Asia',
            description: 'Ripple continues its growth in Asia with new partnerships in the region.',
            image: 'https://th.bing.com/th/id/OIP.QdYVosOtmCnzY-9orYrZcAHaHa?w=600&h=600&rs=1&pid=ImgDetMain',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="mx-auto max-w-6xl px-8 py-12 text-gray-800">
                {/* Header Section */}
                <header className="relative mb-12 text-center">
                    <img  className="w-10 h-10" src={bull} alt="" />
                    <h1 className="text-5xl font-bold text-blue-500">CryptoTracker</h1>
                    <motion.p 
                        className="text-xl mt-4 "
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        Your ultimate destination for tracking the crypto market.
                    </motion.p>
                </header>

                {/* Hero Section */}
                <section className="flex flex-col-reverse md:flex-row items-center justify-between mb-12">
                    {/* Text Content */}
                    <div className="md:w-1/2 p-6">
                        <motion.h2
                            className="text-3xl font-semibold mb-4 text-blue-500"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Track Your Crypto Portfolio
                        </motion.h2>
                        <motion.p
                            className="text-lg mb-6"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            Stay ahead of the market with real-time data, customizable watchlists, and alerts.
                        </motion.p>
                        <Link to="/Coin">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                            >
                                Get Started
                            </motion.button>
                        </Link>
                    </div>

                    {/* Image Content */}
                    <div className="md:w-1/2 p-6 flex justify-center">
                        <motion.img
                            src="https://www.geekextreme.com/wp-content/uploads/2020/05/person-trading-crypto.jpg"
                            alt="Crypto Tracker Dashboard"
                            className="rounded-lg shadow-lg w-4/5 transform transition duration-300 hover:scale-110"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        />
                    </div>
                </section>

                {/* Latest News Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-center mb-6 text-blue-500">Latest News</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                        {latestNews.map((newsItem, index) => (
                            <motion.div
                                key={index}
                                className="p-4 rounded-lg bg-gray-100"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={newsItem.image}
                                    alt={newsItem.headline}
                                    className="w-full h-32 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-lg font-semibold mb-2">{newsItem.headline}</h3>
                                <p className="text-gray-700 mb-4">{newsItem.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Video Play Area */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-center mb-6 text-blue-500">What is Mean by Crypto</h2>
                    <div className="flex justify-center">
                        <ReactPlayer
                            url="https://www.youtube.com/watch?v=rYQgy8QDEBI"
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
                        <FaCoins className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-blue-500 mb-2">Real-Time Market Data</h3>
                        <p className="text-gray-700">
                            Stay up to date with live price data and market trends.
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FaListAlt className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-blue-500 mb-2">Customizable Watchlists</h3>
                        <p className="text-gray-700">
                            Create and manage your own watchlists for specific cryptocurrencies.
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FaBell className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-blue-500 mb-2">Price Alerts</h3>
                        <p className="text-gray-700">
                            Set price alerts and notifications for your favorite coins.
                        </p>
                    </motion.div>
                </section>

                {/* Testimonials Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-center mb-8 text-blue-500">What Our Users Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-700 italic">
                                "CryptoTracker is my go-to app for staying updated on the latest crypto market trends."
                            </p>
                            <p className="text-blue-500 font-semibold mt-4">- Alex P.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-700 italic">
                                "A must-have for any crypto enthusiast. I love the customizable watchlists!"
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
                            <h3 className="text-xl font-bold text-blue-500 mb-2">How does CryptoTracker work?</h3>
                            <p className="text-gray-700">
                                CryptoTracker uses real-time data to provide you with the latest market trends and news.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-blue-500 mb-2">Can I customize my watchlists?</h3>
                            <p className="text-gray-700">
                                Yes, you can create and customize your own watchlists for specific cryptocurrencies.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="text-center mt-12">
                    <p className="text-gray-600">&copy; 2024 CryptoTracker. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;
