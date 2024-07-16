import React from 'react';
import { useNavigate } from 'react-router-dom'; // or useNavigate for React Router v6
import { motion } from 'framer-motion';
import { FaUsers, FaComments, FaChartLine } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import forumLogo from './../images/Bull.png';

const ForumLanding = () => {
    const navigate = useNavigate();

    // Sample data for latest discussions
    const latestDiscussions = [
        {
            title: 'The Future of Cryptocurrency',
            summary: 'Discuss the latest trends and future outlook of cryptocurrencies.',
            image: 'https://lh5.googleusercontent.com/ACHuqfCo-vBpu8U-3rhH8eH66r98XJG4H4iDq0M2zfajpYX9mOvlEeMZdjL2gBC1Ayz0WXDIaGBBEy1rDLDxEKGVhbPECP1VewQF5tMJvFssEPrNHL11pRFWP6FbBe6QBXIyM78',
        },
        {
            title: 'Investing in 2024: Strategies and Tips',
            summary: 'Share your investment strategies and tips for 2024.',
            image: 'https://th.bing.com/th/id/OIP.h-Vx88shh2NJ2TS_Q539dAAAAA?rs=1&pid=ImgDetMain',
        },
        {
            title: 'Understanding Financial Regulations',
            summary: 'Discuss the impact of new financial regulations on businesses and consumers.',
            image: 'https://th.bing.com/th/id/OIP.npqAKG0uEvR9nx8bM3ws0gHaEM?rs=1&pid=ImgDetMain',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center mt-0 w-full">
            <div className="w-full px-4 md:px-8 py-12 text-gray-800">
                {/* Header Section */}
                <header className="relative mb-12 flex justify-between items-center w-full">
                    <img className="w-10 h-10 hidden md:block" src={forumLogo} alt="Finance Forum Logo" />
                    <div className="text-center w-full">
                        <h1 className="text-5xl font-bold text-blue-500">Finance Forum</h1>
                        <motion.p 
                            className="text-xl mt-4"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            Connect, Share, and Learn with Financial Experts
                        </motion.p>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="flex flex-col-reverse md:flex-row items-center justify-between mb-12 w-full">
                    {/* Text Content */}
                    <div className="md:w-1/2 p-6">
                        <motion.h2
                            className="text-3xl font-semibold mb-4 text-blue-500"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Join the Discussion
                        </motion.h2>
                        <motion.p
                            className="text-lg mb-6"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            Engage with industry experts and peers to stay ahead in the financial world.
                        </motion.p>
                        <a href='https://financialforum.netlify.app' target="_blank" rel="noopener noreferrer">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg transition duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                            >
                                Explore the Forum
                            </motion.button>
                        </a>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg transition duration-300 mt-4 ml-0 md:ml-5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            onClick={() => navigate('/mainPage')}
                        >
                            Home
                        </motion.button>
                    </div>

                    {/* Image Content */}
                    <div className="md:w-1/2 p-6 flex justify-center">
                        <motion.img
                            src="https://www.thecontentunlimited.com/blog/images/interactive-content.jpg"
                            alt="Forum discussion"
                            className="rounded-lg shadow-lg w-4/5 transform transition duration-300 hover:scale-110"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        />
                    </div>
                </section>

                {/* Latest Discussions Section */}
                <section className="mb-12 w-full">
                    <h2 className="text-3xl font-semibold text-center mb-6 text-blue-500">Latest Discussions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                        {latestDiscussions.map((discussion, index) => (
                            <motion.div
                                key={index}
                                className="p-4 rounded-lg bg-gray-100"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={discussion.image}
                                    alt={discussion.title}
                                    className="w-full h-32 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-lg font-semibold mb-2">{discussion.title}</h3>
                                <p className="text-gray-700 mb-4">{discussion.summary}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Video Play Area */}
                <section className="mb-12 w-full">
                    <h2 className="text-3xl font-semibold text-center mb-6 text-blue-500">What is Financial Literacy?</h2>
                    <div className="flex justify-center">
                        <ReactPlayer
                            url="https://www.youtube.com/watch?v=QjxjnwTuK8E&pp=ygUjd2hhdCBpcyBtZWFuIGJ5IGZpbmFuY2lhbCBsaXRlcmFjeSA%3D"
                            className="rounded-lg shadow-lg"
                            width="100%"
                            height="400px" // Increased height
                            controls
                        />
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="mb-12 w-full">
                    <h2 className="text-3xl font-semibold text-center mb-8 text-blue-500">What Our Members Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-700 italic">
                                "The Finance Forum has been instrumental in helping me understand market trends."
                            </p>
                            <p className="text-blue-500 font-semibold mt-4">- Sarah W.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-700 italic">
                                "I’ve learned so much from the resources and discussions here. Highly recommended!"
                            </p>
                            <p className="text-blue-500 font-semibold mt-4">- John D.</p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mb-12 w-full">
                    <h2 className="text-3xl font-semibold text-center mb-8 text-blue-500">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Question 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-blue-500 mb-2">What topics are discussed in the forum?</h3>
                            <p className="text-gray-700">
                                Our forum covers a wide range of financial topics including market analysis, investment strategies, and financial regulations.
                            </p>
                        </div>
                        {/* Question 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-blue-500 mb-2">How can I join the forum?</h3>
                            <p className="text-gray-700">
                                Simply click on the "Explore the Forum" button at the top of the page to get started. You can sign up for an account and start engaging with our community.
                            </p>
                        </div>
                        {/* Question 3 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-blue-500 mb-2">Are there any membership fees?</h3>
                            <p className="text-gray-700">
                                No, joining and participating in the forum is completely free. We believe in open access to financial education and discussions.
                            </p>
                        </div>
                        {/* Question 4 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-blue-500 mb-2">Can I contribute my own articles and posts?</h3>
                            <p className="text-gray-700">
                                Absolutely! We encourage our members to share their knowledge and insights by contributing articles and engaging in discussions.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="mt-12 pt-6 border-t border-gray-300 text-center w-full">
                    <p className="text-gray-600">@2024 FinancialHub. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default ForumLanding;
