import React from 'react';
import Modal from 'react-modal';
import contactImage from './../images/ContactPop.png'; // Assuming you have a contact image

const ContactUsPopup = ({ isOpen, onRequestClose }) => {
    const isMobile = window.innerWidth <= 768; // Check if screen width is less than or equal to 768px (considered as mobile)

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                className="contact-modal"
                overlayClassName="modal-overlay"
                ariaHideApp={false}
            >
                {/* Image at the top (only for desktop) */}
                {!isMobile && <img src={contactImage} alt="Contact Background" className="absolute inset-0 w-full h-40 object-cover" />}

                <div className={`contact-content relative ${isMobile ? 'mt-4 p-4' : 'mt-40'}`}>
                    <h1 className="text-center font-bold text-lg mb-10">Contact Us</h1>
                    <div className={`w-full max-w-md mx-auto bg-white bg-opacity-75 rounded-lg shadow-lg p-6 border border-blue-500 ${isMobile ? 'm-2' : ''}`}>
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
                    <div className="text-center mt-4 mb-4 ">
                        <button className="bg-white hover:bg-blue-500 text-black hover:text-white font-bold py-2 px-4 rounded border border-blue-500 transition-colors duration-300" onClick={onRequestClose}>Close</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ContactUsPopup;
