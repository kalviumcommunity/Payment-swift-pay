import React from 'react';
import Modal from 'react-modal';
import servicesImage from './../images/Services.png'; // Assuming you have a services image

const ServicesPopup = ({ isOpen, onRequestClose }) => {
    const isMobile = window.innerWidth <= 768; // Check if screen width is less than or equal to 768px (considered as mobile)

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                className="services-modal"
                overlayClassName="modal-overlay"
                ariaHideApp={false}
            >
                {/* Image at the top (only for desktop) */}
                {!isMobile && <img src={servicesImage} alt="Services Background" className="absolute inset-0 w-full h-40 object-cover" />}

                <div className={`services-content relative ${isMobile ? 'mt-4' : 'mt-40'}`}>
                    <h1 className="text-center font-bold text-lg mb-10">Our Services</h1>
                    <div className="w-full max-w-md mx-auto bg-white bg-opacity-75 rounded-lg shadow-lg p-6 border border-blue-500">
                        <p className="text-gray-600">
                            At Financial Hub, we offer a variety of services to meet your financial needs and goals.
                        </p>
                        <p className="text-gray-600">
                        Our platform offers a wide range of features, including:
                        </p>
                        <ul className="list-disc pl-6">
                        <li>News and Updates: Stay informed with the latest news and trends in the financial world.</li>
                            <li>Educational Resources: Access articles, videos, and courses to improve your financial literacy.</li>
                            <li>Community Forum: Engage with other users, ask questions, and share your insights.</li>
                            <li>Blog Section: Read articles from financial experts and enthusiasts on various finance-related topics.</li>
                        </ul>
                        <p className="text-gray-600">
                            Contact us today to learn more about how we can help you achieve financial success!
                        </p>
                    </div>
                    <div className="text-center mt-4 mb-4 ">
                        <button className="bg-white hover:bg-blue-500 text-black hover:text-white font-bold py-2 px-4 rounded border border-blue-500 transition-colors duration-300" onClick={onRequestClose}>Close</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ServicesPopup;
