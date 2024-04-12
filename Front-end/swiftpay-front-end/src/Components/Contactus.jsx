import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from './../images/Contactus.png';

const ContactUs = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            {/* Hero Banner */}
            <div className="hero-banner relative">
                <img src={heroImage} alt="Hero Banner" className="hero-image w-full h-auto" />
                <div className="hero-content absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center text-white">
                    <h1 className="text-4xl font-bold">Contact Us</h1>
                    <p className="mt-2 text-lg">Feel free to reach out to us for any inquiries or assistance.</p>
                </div>
            </div>

            {/* Contact Details */}
            <div className="mx-auto mt-8 bg-white p-6 rounded-md shadow-md border border-blue-500">
    <h2 className="text-2xl font-bold mb-4">Contact Details</h2>
    <p className="mb-2"><strong>Email:</strong> info@example.com</p>
    <p className="mb-2"><strong>Phone:</strong> +1 123 456 7890</p>
    <p className="mb-2"><strong>Address:</strong> 123 Main Street, City, Country</p>
</div>

            {/* Back to Home Link */}
            <div className="flex justify-center mt-5">
            <Link to='/'>
                <button className='border border-blue-500 px-4 py-2 rounded-md text-blue-500 hover:bg-blue-500 hover:text-white mb-5'>Home</button>
            </Link>
        </div>
        </div>
    );
};

export default ContactUs;
