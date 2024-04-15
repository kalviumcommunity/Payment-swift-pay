import React from 'react';
import Bull from "./../images/Bull.png";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-500 text-white py-8 mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <img src={Bull} alt="" className="h-10 w-10 mr-2" />
              <h1 className="text-xl font-bold">Financial Hub</h1>
            </div>
            <p className="text-sm mt-2 text-center md:text-left">One stop solution for Finance</p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="flex flex-col md:flex-row justify-center md:justify-end">
              <div className="w-full md:w-2/3 mb-6 md:mb-0">
                <h2 className="text-md font-bold mb-4 md:mb-0 text-center md:text-left">Quick Links</h2>
                <ul className="text-sm mt-2 text-center md:text-left">
                  <li className="mb-2"><Link to="/Feedback" className="hover:text-gray-400 transition duration-300">Feedback</Link></li>
                  <li className="mb-2"><Link to="/conditions" className="hover:text-gray-400 transition duration-300">Terms & conditions</Link></li>
                  <li className="mb-1"><Link to="/privacy" className="hover:text-gray-400 transition duration-300">Privacy Policy</Link></li>
                </ul>
              </div>  
              <div className="w-full md:w-1/3">
                <h2 className="text-md font-bold mb-4 md:mb-0 text-center">Follow Us</h2>
                <div className="flex justify-center">
                  <a href="#" className="mr-2">
                    <i className="fab fa-facebook text-2xl hover:text-gray-400 transition duration-300"></i>
                  </a>
                  <a href="#" className="mr-2">
                    <i className="fab fa-twitter text-2xl hover:text-gray-400 transition duration-300"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-instagram text-2xl hover:text-gray-400 transition duration-300"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-6">
        <p className="text-sm text-white">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
