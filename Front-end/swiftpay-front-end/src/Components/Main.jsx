import React, { useState } from 'react';
import Bull from "./../images/Bull.png"
import { Link } from 'react-router-dom';
import { auth } from '../../Firebase/Fire.config'; // Import the auth module from your firebase configuration
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Main = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate=useNavigate();

    const handleLogout = () => {
        auth.signOut() // Use signOut method from the imported auth module
            .then(() => {
                // Sign-out successful.
                console.log('User signed out');
                navigate('/')
              toast.success("Logged out successfully")

                
            })
            .catch((error) => {
                // An error happened.
                console.error('Error signing out:', error);
            });
    };
   

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
                           
                        </div>
                        <div className="hidden md:flex md:items-center">
                            <button onClick={handleLogout} className="text-black bg-transparent border border-blue-500 px-4 py-2 transition duration-300 transform hover:scale-105 hover:shadow-md hover:bg-blue-500 hover:text-white">Log out</button>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                    <div className="bg-gray-50 py-4">
                        <Link to='/About'><a href="#" className={`block py-2 px-4 text-sm text-blue-500 hover:bg-gray-100`}>Features</a></Link>
                        <Link to='/Service'><a href="#" className={`block py-2 px-4 text-sm text-blue-500 hover:bg-gray-100`} ></a></Link>
                        <Link to='contact'><a href="#" className={`block py-2 px-4 text-sm text-blue-500 hover:bg-gray-100`} >Contact Us</a></Link>
                    </div>
                    <div className="bg-gray-100 py-4 px-4 flex justify-center">
                        <button onClick={handleLogout} className="text-black bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 transition duration-300">Log out</button>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Main;
