import React, { useState, useEffect } from 'react';
import contactImage from "./../images/ContactPop.png";
import './Contact.css'; // Import CSS for modal styles

const ContactUsPopup = ({ isOpen, onRequestClose }) => {
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
                <h1 className="text-center font-bold text-lg mb-10">Contact Us</h1>
                <div className="w-full max-w-md mx-auto bg-white bg-opacity-75 rounded-lg shadow-lg p-6 relative">
                    {/* Thin light effect going around the div */}
                    <div className="border-animation border border-blue-500 absolute inset-0 rounded-lg shadow-md"></div>
                    <p className="text-gray-600">
                        Get in touch with Financial Hub for any inquiries, feedback, or assistance.
                    </p>
                    <p className="text-gray-600">
                        Our contact information:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Address: 123 Wall Street, New York, NY 10005</li>
                        <li>Email: info@financialhub.com</li>
                        <li>Phone: 1-800-123-4567</li>
                    </ul>
                    <p className="text-gray-600">
                        We're here to help you achieve your financial goals. Reach out to us today!
                    </p>
                </div>
                <div className="text-center mt-4 mb-4">
                    <button className="bg-white hover:bg-blue-500 text-black hover:text-white font-bold py-2 px-4 rounded border border-blue-500 transition-colors duration-300" onClick={onRequestClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPopup;
