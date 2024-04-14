import React, { useState } from 'react';
import Bull from "./../images/Bull.png"
import { Link } from 'react-router-dom';
import LandingPage from './landingpage';

const CustomNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <>
            <nav className="bg-white shadow-lg">
                <div className="mx-auto px-4 py-2 max-w-7xl">
                    <div className="flex justify-between items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <img src={Bull} alt="" className="h-10 w-auto" />
                            <a href="#" className="text-blue-500 text-lg font-bold ml-2 hover:text-shadow text-shadow-blur-2">Financial hub</a>
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-blue-500 hover:text-blue-700 focus:outline-none">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                                    )}
                                </svg>
                            </button>
                        </div>
                        <div className="hidden md:flex md:items-center md:justify-center flex-1">
                            <Link to="/About">
                                <a href="#" className="text-blue-500 hover:text-blue-700 mx-4 relative hover:text-shadow text-shadow-blur-2" onMouseEnter={(e) => { e.target.style.borderBottom = '2px solid blue' }} onMouseLeave={(e) => { e.target.style.borderBottom = 'none' }}>About Us<span className="absolute bottom-0 left-0 w-full border-b-2 border-blue-500 opacity-0 transition-opacity duration-300"></span></a>
                            </Link>
                            <span className="text-gray-400 mx-2">|</span>
                            <Link to='/Service'>
                                <a href="#" className="text-blue-500  hover:text-shadow text-shadow-blur-2 hover:text-blue-700 mx-4 relative" onMouseEnter={(e) => { e.target.style.borderBottom = '2px solid blue' }} onMouseLeave={(e) => { e.target.style.borderBottom = 'none' }} >Services<span className="absolute bottom-0 left-0 w-full border-b-2 border-blue-500 opacity-0 transition-opacity duration-300"></span></a>
                            </Link>
                            <span className="text-gray-400 mx-2">|</span>
                            <Link to="/contact"><a href="#" className="text-blue-500  hover:text-shadow text-shadow-blur-2 hover:text-blue-700 mx-4 relative" onMouseEnter={(e) => { e.target.style.borderBottom = '2px solid blue' }} onMouseLeave={(e) => { e.target.style.borderBottom = 'none' }} >Contact Us
                                <span className="absolute bottom-0 left-0 w-full border-b-2 border-blue-500 opacity-0 transition-opacity duration-300"></span>
                            </a></Link>
                        </div>
                        <div className="hidden md:flex md:items-center">
                            <Link to="/signIn-signUp">
                                <button className="text-black bg-transparent border border-blue-500 px-4 py-2 transition duration-300 transform hover:scale-105 hover:shadow-md hover:bg-blue-500 hover:text-white">Get Started</button>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                    <div className="bg-gray-50 py-4">
                        <Link to='/About'><a href="#" className={`block py-2 px-4 text-sm text-blue-500 hover:bg-gray-100`}>About</a></Link>
                        <Link to='/Service'><a href="#" className={`block py-2 px-4 text-sm text-blue-500 hover:bg-gray-100`} >Services</a></Link>
                        <a href="#" className={`block py-2 px-4 text-sm text-blue-500 hover:bg-gray-100 `} >Contact Us</a>
                    </div>
                    <Link to="/signIn-signUp">
                        <div className="bg-gray-100 py-4 px-4 flex justify-center">
                            <button className="text-black bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 transition duration-300">Get Started</button>
                        </div>
                    </Link>
                </div>
            </nav>
            <LandingPage/>
        </>
    );
};

export default CustomNavbar;
