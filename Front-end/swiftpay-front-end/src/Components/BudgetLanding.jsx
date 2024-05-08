import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Settings, Bell, ArrowRight } from 'lucide-react';
import ReactPlayer from 'react-player';
import 'tailwindcss/tailwind.css';
import bull from "./../images/Bull.png"
import { Link } from 'react-router-dom';
import { CalculatorIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/solid';



const HorizontalScrollingNews = ({ newsStories }) => {
    return (
        <section className="mb-12">
            <h2 className="text-3xl font-semibold text-center mb-6">Latest News</h2>
            <div className="flex overflow-x-auto space-x-4 p-4 bg-white rounded-lg shadow-lg">
                {newsStories.map((story, index) => (
                    <motion.div
                        key={index}
                        className="w-64 p-4 rounded-lg bg-gray-100"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <img src={story.image} alt={story.title} className="rounded-lg mb-2 w-full" />
                        <h3 className="text-lg font-semibold mb-2">{story.title}</h3>
                        <p className="text-gray-700 mb-4">{story.excerpt}</p>
                        <Link to='/Crypto'><button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition duration-300">
                            Read More <ArrowRight className="ml-2" />
                        </button></Link> 
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

const BudgetLanding = () => {
    // Sample data for HorizontalScrollingNews
    const newsStories = [
        {
            image: 'https://st3.depositphotos.com/1396145/34405/i/600/depositphotos_344054554-stock-photo-close-up-of-bitcoin-coins.jpg',
            title: 'Crypto at high',
            excerpt: 'Crypto prices are high an it is the right time to inverst into the  market with the expect suggestion.at the same time it is important to learn about cryptos.',
        },
        {
            image: 'https://th.bing.com/th/id/OIP.Y2HdG0MVAaMjA4W3IEqhwwAAAA?rs=1&pid=ImgDetMain',
            title: 'Louis Vuitton Remains Number One',
            excerpt: 'Louis Vuitton continues to be the number one luxury brand, with impressive growth and brand loyalty. and everyone looking into it.',
        },
        {
            image: 'https://s.yimg.com/uu/api/res/1.2/KYddvHkDOq1qglwe6Nzagw--~B/aD0xNDE0O3c9MjEyMTtzbT0xO2FwcGlkPXl0YWNoeW9u/http://media.zenfs.com/en/homerun/feed_manager_auto_publish_494/d9334bb2d5b1bde737721f0f2e7670b4',
            title: 'Apple stcoks are stable',
            excerpt: 'Apple stocks show signs of stability, making it a reliable choice for investors in the current market.at the same time they are facing legal issue too with us government',
        },
        {
            image: 'https://th.bing.com/th/id/OIP.hvN5mJAbk1TjtMxLYdQ5tQAAAA?rs=1&pid=ImgDetMain',
            title: 'Indian markets are growing',
            excerpt:"Indian markets are showing robust growth, driven by a young workforce and rising middle class.more and more middle class people are investing"
           
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-cente">
            <div className="mx-auto max-w-6xl px-8 py-12 text-blue-500">
                {/* Header Section */}
                <header className="relative mb-12 text-center">
    {/* The absolute-positioned bull image */}
    <img
        src={bull}
        alt="Bull"
        className="w-10 h-10 mr-72 absolute top-0 left-0"
    />
    {/* Header text */}
    <motion.h1
        className="text-5xl font-bold text-blue-500"
        initial={{ opacity: 5, scale: 1.8 }}
        animate={{ opacity: 5, scale: 1 }}
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
                            Calculate with Confidence: Get Real-Time Financial News at Your Fingertips.
                        </motion.p>
                        <Link to="/Business"><motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-blue-500 px-6 py-3 rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                           Get started
                        </motion.button></Link>
                    </div>

                    {/* Image Content */}
                    <div className="md:w-1/2 p-6 flex justify-center">
                        <motion.img
                            src="https://th.bing.com/th/id/OIP.9rygV00aoLczekznaXefrwAAAA?rs=1&pid=ImgDetMain"
                            alt="Financial Times"
                            className="rounded-lg shadow-lg w-4/5 transform transition duration-300 hover:scale-110"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        />
                    </div>
                </section>

                {/* Latest News Section */}
                <HorizontalScrollingNews newsStories={newsStories} />

                {/* Video Play Area */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-center mb-6">How to make a Budget</h2>
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
        <CalculatorIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
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
        <ChartBarIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
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
        <ClockIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-blue-500 mb-2">Real-Time Monitoring</h3>
        <p className="text-gray-700">
            Monitor your expenses and budget in real time for immediate feedback.
        </p>
    </motion.div>
</section>


                {/* Testimonials Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-center mb-8">What Our Readers Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-700 italic">
                                "Financial Times provides the most up-to-date financial news coverage. I love how easy it is to stay informed!"
                            </p>
                            <p className="text-blue-500 font-semibold mt-4">- Alex P.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-700 italic">
                                "A great source for financial news from all over the world. Highly recommend subscribing!"
                            </p>
                            <p className="text-blue-500 font-semibold mt-4">- Maria S."
                        </p>
                    </div>
                    </div>
                </section>
                {/* FAQ Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-center mb-8">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-blue-500 mb-2">How do I subscribe?</h3>
                            <p className="text-gray-700">
                                Simply click the "Subscribe Now" button and follow the on-screen instructions.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-blue-500 mb-2">Is these news are real and genuine?</h3>
                            <p className="text-gray-700">
                                Yes, these news are real and genuine it is verifired by the top journalist and other.
                            </p>
                        </div>
                    </div>
                </section>
                {/* Footer Section */}
                <footer className="text-center text-blue-500 mt-6">
                    <p>&copy; {new Date().getFullYear()} Financial Times. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default BudgetLanding;
