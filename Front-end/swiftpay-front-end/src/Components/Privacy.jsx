import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from './../images/R.gif'; // Replace this with your actual image

const PrivacyPolicy = () => {
    return (
        <div>
            {/* Hero Banner */}
            <div className="hero-banner relative">
                <img src={heroImage} alt="Hero Banner" className="hero-image w-full h-auto" />
            </div>

            {/* Privacy Policy Content */}
            <div className="max-w-4xl mx-auto mt-8 px-4">
                <h2 className="text-2xl font-bold mb-4 text-blue-500">Introduction</h2>
                <p className="mb-4">At Financial Hub, we take your privacy seriously. This Privacy Policy outlines the types of personal information we collect, how we use it, and the steps we take to ensure it remains secure.</p>
                
                <h2 className="text-2xl font-bold mb-4 text-blue-500">Information We Collect</h2>
                <p className="mb-4">We collect personal information such as your name, email address, phone number, and payment details when you sign up for our services or interact with our website. We may also collect information about your device and browsing activity.</p>
                
                <h2 className="text-2xl font-bold mb-4 text-blue-500">How We Use Information</h2>
                <p className="mb-4">We use the information we collect to provide and improve our services, communicate with you, customize your experience, and ensure the security of our platform. We may also use your information for marketing purposes with your consent.</p>
                
                <h2 className="text-2xl font-bold mb-4 text-blue-500">Data Security</h2>
                <p className="mb-4">We take measures to protect your personal information from unauthorized access, use, and disclosure. These measures include encryption, secure server infrastructure, and regular security audits.</p>
                
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

export default PrivacyPolicy;
