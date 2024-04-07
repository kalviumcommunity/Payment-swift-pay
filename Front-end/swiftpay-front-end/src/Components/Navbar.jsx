import React, { useState } from 'react';
import AboutUsPopup from './AboutusPop';
import Bull from "./../images/Bull.png"
import ServicesPopup from './ServicesPopup';
import ContactUsPopup from './Contactus';

const CustomNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAboutUsPopupOpen, setIsAboutUsPopupOpen] = useState(false);
    const [isAboutUsClicked, setIsAboutUsClicked] = useState(false);
    const [isServicesClicked, setIsServicesClicked] = useState(false);
    const [isContactUsClicked, setIsContactUsClicked] = useState(false);
    const [isServicesUsPopupOpen, setIsServicesPopupOpen] = useState(false);
    const [isContactUsPopupOpen, setIsContactPopupOpen] = useState(false);

    const openAboutUsPopup = () => {
        setIsAboutUsPopupOpen(true);
        setIsAboutUsClicked(true); 
    };

    const closeAboutUsPopup = () => {
        setIsAboutUsPopupOpen(false);
    };

    const openContactPopup = () => {
      setIsContactPopupOpen(true);
     
  };
  const closeContactPopup = () => {
    setIsContactPopupOpen(false);
};

    const openServicesPop=()=>{
      setIsServicesPopupOpen(true);
    }
    const closeServicesPopup = () => {
      setIsServicesPopupOpen(false);
  };


    const handleMobileItemClick = (item) => {
        switch (item) {
            case 'about':
                setIsAboutUsClicked(prevState => !prevState); // Toggle the state
                break;
            case 'services':
                setIsServicesClicked(prevState => !prevState); // Toggle the state
                break;
            case 'contact':
                setIsContactUsClicked(prevState => !prevState); // Toggle the state
                break;
            default:
                break;
        }
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="mx-auto px-4 py-2 max-w-7xl">
                <div className="flex justify-between items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <img src={Bull} alt="" className="h-10 w-auto" />
                        <a href="#" className="text-blue-500 text-lg font-bold ml-2">Financial hub</a>
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
                        <a href="#"className="text-blue-500 hover:text-blue-700 mx-4 relative"onClick={openAboutUsPopup}onMouseEnter={(e) => { e.target.style.borderBottom = '2px solid blue' }}onMouseLeave={(e) => { e.target.style.borderBottom = 'none' }}>About Us<span className="absolute bottom-0 left-0 w-full border-b-2 border-blue-500 opacity-0 transition-opacity duration-300"></span></a>
                            <span className="text-gray-400 mx-2">|</span>
                        <a href="#"className="text-blue-500 hover:text-blue-700 mx-4 relative"onMouseEnter={(e) => { e.target.style.borderBottom = '2px solid blue' }} onMouseLeave={(e) => { e.target.style.borderBottom = 'none' }} onClick={openServicesPop}>Services
                            <span className="absolute bottom-0 left-0 w-full border-b-2 border-blue-500 opacity-0 transition-opacity duration-300"></span></a>
                        <span className="text-gray-400 mx-2">|</span>
                        <a href="#"className="text-blue-500 hover:text-blue-700 mx-4 relative"onMouseEnter={(e) => { e.target.style.borderBottom = '2px solid blue' }}onMouseLeave={(e) => { e.target.style.borderBottom = 'none' }} onClick={openContactPopup}>Contact Us
                            <span className="absolute bottom-0 left-0 w-full border-b-2 border-blue-500 opacity-0 transition-opacity duration-300"></span>
                        </a>
                    </div>
                    <div className="hidden md:flex md:items-center">
                        <button className="text-black bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 transition duration-300">Get Started</button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="bg-gray-50 py-4">
                    <a href="#"className={`block py-2 px-4 text-sm text-blue-500 hover:bg-gray-100 ${isAboutUsClicked ? 'border-b-2 border-blue-500' : ''}`}onClick={(e) => {handleMobileItemClick('about');openAboutUsPopup();}}>About</a>
                    <a href="#" className={`block py-2 px-4 text-sm text-blue-500 hover:bg-gray-100 ${isServicesClicked ? 'border-b-2 border-blue-500' : ''}`} onClick={(e) => {handleMobileItemClick('services');openServicesPop()}} >Services</a>
                    <a href="#" className={`block py-2 px-4 text-sm text-blue-500 hover:bg-gray-100 ${isContactUsClicked ? 'border-b-2 border-blue-500' : ''}`} onClick={(e) => {handleMobileItemClick('contact');openContactPopup()}}>Contact Us</a>
                </div>
                <div className="bg-gray-100 py-4 px-4 flex justify-center">
                    <button className="text-black bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 transition duration-300">Get Started</button>
                </div>
            </div>
            <AboutUsPopup isOpen={isAboutUsPopupOpen} onRequestClose={closeAboutUsPopup} />
            <ServicesPopup isOpen={isServicesUsPopupOpen} onRequestClose={closeServicesPopup}/>
            <ContactUsPopup isOpen={isContactUsPopupOpen} onRequestClose={closeContactPopup}/>
        </nav>
    );
};

export default CustomNavbar;
