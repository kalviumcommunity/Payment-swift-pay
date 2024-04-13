import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from './../images/Terms.webp';

const TermsAndConditions = () => {
    return (
        <div>
            {/* Hero Banner */}
            <div className="hero-banner relative">
                <img src={heroImage} alt="Hero Banner" className="hero-image w-full h-auto" />
                <div className="hero-content absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center text-white">
                    <h1 className="text-4xl font-bold">Terms and Conditions</h1>
                    <p className="mt-2 text-lg">Please read these terms and conditions carefully before using our services.</p>
                </div>
            </div>

            {/* Terms and Conditions Content */}
            <div className="mx-auto mt-8 max-w-3xl px-4">
                <h2 className="text-2xl font-bold mb-4 text-blue-500"> Introduction</h2>
                <p className="mb-4">These terms and conditions govern your use of the financial hub website; by using our website, you accept these terms and conditions in full.</p>
                
                <h2 className="text-2xl font-bold mb-4 text-blue-500"> Intellectual Property Rights</h2>
                <p className="mb-4">Unless otherwise stated, we or our licensors own the intellectual property rights in the website and material on the website.</p>
                
                <h2 className="text-2xl font-bold mb-4 text-blue-500"> Restrictions</h2>
                <p className="mb-4">You are prohibited from using the website in any way that is unlawful, illegal, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.</p>
                
                {/* Add more sections as needed */}
            </div>

            {/* Back to Home Link */}
            <div className="flex justify-center">
            <Link to='/'>
                <button className='border border-blue-500 px-4 py-2 rounded-md text-blue-500 hover:bg-blue-500 hover:text-white mb-5'>Home</button>
            </Link>
        </div>
        </div>
    );
};

export default TermsAndConditions;
