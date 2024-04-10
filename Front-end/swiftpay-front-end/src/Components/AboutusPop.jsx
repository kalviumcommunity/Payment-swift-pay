import React, { useState, useEffect } from 'react';

import './Contact.css'; // Import CSS for modal styles

const AboutUsPopup = ({ isOpen, onRequestClose }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (!isOpen) {
        return null; // Return null if the modal is closed
    }

    return (
        <div className="modal-overlay" onClick={onRequestClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h1 className="text-center font-bold text-lg mb-6 md:mb-10">About Us</h1>
                <div className="w-full max-w-md mx-auto bg-white bg-opacity-75 rounded-lg shadow-lg p-4 md:p-6 relative">
                    {/* Thin light effect going around the div */}
                    <div className="border-animation border border-blue-500 absolute inset-0 rounded-lg shadow-md"></div>
                    <p className="text-gray-600 mb-4 md:mb-6">
                        At Financial Hub, we strive to be your go-to platform for all things finance. Whether you're looking to stay updated on the latest financial news, learn about personal finance management, or connect with like-minded individuals in our forum, Financial Hub has you covered.
                    </p>
                    <p className="text-gray-600 mb-4 md:mb-6">
                        Our platform offers a wide range of features to help you achieve your financial goals.
                    </p>
                </div>
                <div className="text-center mt-4 mb-4">
                    <button className="bg-white hover:bg-blue-500 text-black hover:text-white font-bold py-2 px-4 rounded border border-blue-500 transition-colors duration-300" onClick={onRequestClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPopup;
