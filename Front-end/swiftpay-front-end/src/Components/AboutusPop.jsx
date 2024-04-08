import React from 'react';
import Modal from 'react-modal';
import moneyImage from './../images/money.png'; 

const AboutUsPopup = ({ isOpen, onRequestClose }) => {
    const isMobile = window.innerWidth <= 768; // Check if screen width is less than or equal to 768px (considered as mobile)

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                className="about-us-modal"
                overlayClassName="modal-overlay"
                ariaHideApp={false}
            >
                {/* Image at the top (only for desktop) */}
                {!isMobile && <img src={moneyImage} alt="Money Background" className="absolute inset-0 w-full h-40 object-cover" />}

                <div className={`about-us-content relative ${isMobile ? 'mt-4' : 'mt-40'}`}>
                    <h1 className="text-center font-bold text-lg mb-10">About us</h1>
                    <div className="w-full max-w-md mx-auto bg-white bg-opacity-75 rounded-lg shadow-lg p-6 border border-blue-500">
                        <p className="text-gray-600">
                            At Financial Hub, we strive to be your go-to platform for all things finance. Whether you're looking to stay updated on the latest financial news, learn about personal finance management, or connect with like-minded individuals in our forum, Financial Hub has you covered.
                        </p>
                        <p className="text-gray-600">
                            Our platform offers a wide range of features, including:
                        </p>
                        <ul className="list-disc pl-6">
                            <li>News and Updates: Stay informed with the latest news and trends in the financial world.</li>
                            <li>Educational Resources: Access articles, videos, and courses to improve your financial literacy.</li>
                            <li>Community Forum: Engage with other users, ask questions, and share your insights.</li>
                            <li>Blog Section: Read articles from financial experts and enthusiasts on various finance-related topics.</li>
                            <li>Premium Services: Explore premium services tailored to help you achieve your financial goals.</li>
                        </ul>
                        <p className="text-gray-600">
                            At Financial Hub, we believe that financial education is key to a secure future. Join us today and take control of your financial journey!
                        </p>
                    </div>
                    <div className="text-center mt-4 mb-4">
                        <button className="bg-white hover:bg-blue-500 text-black hover:text-white font-bold py-2 px-4 rounded border border-blue-500 transition-colors duration-300" onClick={onRequestClose}>Close</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AboutUsPopup;




