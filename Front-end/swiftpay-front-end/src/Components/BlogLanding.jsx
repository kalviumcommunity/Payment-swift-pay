import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaBook, FaNewspaper } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import bull from './../images/Bull.png';
import { Link } from 'react-router-dom';


const BlogLanding = () => {
    // Sample data for latest blogs
    const latestBlogs = [
        {
            headline: 'Understanding Financial Regulations',
            description: 'An in-depth look at the latest financial regulations and their impact on consumers and businesses.',
            image: 'https://media.npr.org/assets/img/2019/12/30/gettyimages-97970534_wide-dbd1e3f134480c39c67d282b360204ae009cf02e.jpg?s=2000',
        },
        {
            headline: 'The Ethereum Network Upgrade',
            description: 'An analysis of Ethereum’s EIP-1559 upgrade and its implications for the cryptocurrency market.',
            image: 'https://th.bing.com/th/id/OIP.KBw2AMGhrrukfaIiGG4J6gHaE8?rs=1&pid=ImgDetMain',
        },
        {
            headline: 'Innovations in Digital Banking',
            description: 'Exploring the latest digital banking solutions and how they are transforming the financial industry.',
            image: 'https://th.bing.com/th/id/OIP.BlXdhtWsggYKgots4USn2gAAAA?w=428&h=250&rs=1&pid=ImgDetMain',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="mx-auto max-w-6xl px-8 py-12 text-gray-800">
                {/* Header Section */}
                <header className="relative mb-12 flex justify-between items-center w-full">
                    <img className="w-10 h-10 hidden md:block" src={bull} alt="Financial Hub Logo" />
                    <div className="text-center w-full">
                        <h1 className="text-5xl font-bold text-blue-500">Financial Blogs</h1>
                        <motion.p 
                            className="text-xl mt-4"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            Navigating Finance, One Blog at a Time
                        </motion.p>
                    </div>
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
                            Read More About Finance
                        </motion.h2>
                        <motion.p
                            className="text-lg mb-6"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            Stay ahead of the market with insightful blogs and articles tailored for you.
                        </motion.p>
                        <div className="flex space-x-4">
                            <a href="https://my-next-app-p2rh.vercel.app/" target="_blank" rel="noopener noreferrer">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg transition duration-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.7 }}
                                >
                                    Explore Blogs
                                </motion.button>
                            </a>
                            <Link to="/mainpage"  rel="noopener noreferrer">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg  transition duration-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.7 }}
                                >
                                    Home
                                </motion.button>
                            </Link>
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="md:w-1/2 p-6 flex justify-center">
                        <motion.img
                            src="https://i0.wp.com/picjumbo.com/wp-content/uploads/girl-reading-a-blog-in-a-bedroom.jpg?w=2210&quality=70"
                            alt="Financial blog"
                            className="rounded-lg shadow-lg w-4/5 transform transition duration-300 hover:scale-110"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        />
                    </div>
                </section>

                {/* Latest Blogs Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-center mb-6 text-blue-500">Latest Blogs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                        {latestBlogs.map((blog, index) => (
                            <motion.div
                                key={index}
                                className="p-4 rounded-lg bg-gray-100"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={blog.image}
                                    alt={blog.headline}
                                    className="w-full h-32 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-lg font-semibold mb-2">{blog.headline}</h3>
                                <p className="text-gray-700 mb-4">{blog.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Video Play Area */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-center mb-6 text-blue-500">What is a Blog?</h2>
                    <div className="flex justify-center">
                        <ReactPlayer
                            url="https://www.youtube.com/watch?v=crzR4JucSBM"
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
                        <FaChartLine className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-blue-500 mb-2">In-Depth Analysis</h3>
                        <p className="text-gray-700">
                            Detailed articles on investments, markets, and financial trends.
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FaBook className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-blue-500 mb-2">Educational Content</h3>
                        <p className="text-gray-700">
                            Tutorials and guides for beginners on finance and investments.
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FaNewspaper className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-blue-500 mb-2">Market Updates & News</h3>
                        <p className="text-gray-700">
                            Stay up to date with the latest financial news and trends.
                        </p>
                    </motion.div>
                </section>

                {/* Testimonials Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-center mb-8 text-blue-500">What Our Readers Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-700 italic">
                                "Financial Hub offers in-depth analysis that helps me stay ahead in my investments."
                            </p>
                            <p className="text-blue-500 font-semibold mt-4">- Emily J.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-700 italic">
                                "The articles and tutorials are informative and easy to understand. Highly recommended!"
                            </p>
                            <p className="text-blue-500 font-semibold mt-4">- David L.</p>
                        </div>
                    </div>
                </section>
                <footer className="mt-12 pt-6 border-t border-gray-300 text-center">
                    <p className="text-gray-600">@2024 FinancialHub. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default BlogLanding;
