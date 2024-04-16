import React from 'react';
import ser from './../images/Ser.png'; // Assuming you have a services image
import { Link } from 'react-router-dom';
import "./Service.css"

const ServicesPage = () => {
    return (
        <div className="services-page">
            {/* Hero Banner */}
            <div className="hero-banner relative">
                <img src={ser} alt="Services Background" className="hero-image w-full h-auto" />
                <div className="hero-content absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center text-white">
                </div>
            </div>
            
            {/* Services Section */}
            <div className="services-section py-12 ml-10 mr-5 ">
                <div className=" mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Service 1 */}
                        <div className="bg-white shadow-md p-6 rounded-lg service-item">
                            <h3 className="text-xl font-semibold mb-2 text-blue-500">News</h3>
                            <p className="text-gray-700">
                                Stay updated with the latest financial news and trends in our News section. Get timely insights on market developments, economic indicators, and global events shaping the financial landscape
                            </p>
                        </div>
                        
                        {/* Service 2 */}
                        <div className="bg-white shadow-md p-6 rounded-lg service-item">
                            <h3 className="text-xl font-semibold mb-2 text-blue-500">Blog</h3>
                            <p className="text-gray-700">
                                Discover expert advice and insights on personal finance, investments, and financial trends in our Blogs section. Written by industry professionals, our articles empower you to make informed decisions and take control of your financial future
                            </p>
                        </div>
                        
                        {/* Service 3 */}
                        <div className="bg-white shadow-md p-6 rounded-lg service-item">
                            <h3 className="text-xl font-semibold mb-2 text-blue-500">Payment</h3>
                            <p className="text-gray-700">
                                Experience hassle-free payments with our secure and efficient payment feature. Make transactions seamlessly, manage your expenses, and stay in control of your finances effortlessly
                            </p>
                        </div>
                        
                        <div className="bg-white shadow-md p-6 rounded-lg service-item">
                            <h3 className="text-xl font-semibold mb-2 text-blue-500">Expense Calculator</h3>
                            <p className="text-gray-700">
                                Effortlessly manage your expenses with our intuitive expense calculator. Easily track your spending, set budgets, and gain insights into your financial habits. Take control of your finances and achieve your financial goals with ease
                            </p>
                        </div>

                        <div className="bg-white shadow-md p-6 rounded-lg service-item">
                            <h3 className="text-xl font-semibold mb-2 text-blue-500">Forum</h3>
                            <p className="text-gray-700">
                                Engage with a vibrant community of like-minded individuals in our forum. Share insights, ask questions, and connect with others on topics ranging from personal finance to investment strategies. Join the discussion, learn from others, and grow your financial knowledge together
                            </p>
                        </div>
                        <div className="bg-white shadow-md p-6 rounded-lg service-item">
                            <h3 className="text-xl font-semibold mb-2 text-blue-500">Learn</h3>
                            <p className="text-gray-700">
                                Finance is the art of managing money and assets to achieve financial goals. It involves budgeting, investing, and managing risk to build wealth and ensure economic stability. Financial literacy is crucial for making informed decisions about personal and business finance
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <Link to='/'>
                    <button className='border border-blue-500 px-4 py-2 rounded-md text-blue-500 hover:bg-blue-500 hover:text-white mb-5'>Home</button>
                </Link>
            </div>
        </div>
    );
};

export default ServicesPage;
