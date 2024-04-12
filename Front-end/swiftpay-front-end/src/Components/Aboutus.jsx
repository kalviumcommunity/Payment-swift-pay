import React from 'react';
import image from "./../images/About.png";
import { Link } from 'react-router-dom';

const Aboutus = () => {
    return (
        <div className="about-us-page relative">
            <div className="hero-banner relative">
                <img src={image} alt="Financial Hub" className="hero-image" />
                <div className="hero-content absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center">
                </div>
            </div>
            <div className="about-section">
                <div className="mx-auto py-8 md:py-12">
                <h1 className="hidden md:block text-center mb-10 text-2xl font-bold   text-blue-500">Welcome to Financial Hub</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:ml-10">
                        <div className="bg-blue-500 text-white p-4 md:p-8 rounded-lg">
                            <h2 className="text-lg md:text-2xl font-bold mb-4">Our Mission</h2>
                            <p className="text-base md:text-lg">To provide the latest news, educational resources, and a vibrant community forum to support individuals on their financial journey.</p>
                        </div>
                        <div className="bg-white p-4 md:p-8 rounded-lg">
                            <h2 className="text-lg md:text-2xl font-bold mb-4">Who We Are</h2>
                            <p className="text-base md:text-lg">Financial Hub is dedicated to empowering individuals to take control of their finances and build a secure future.</p>
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

export default Aboutus;
