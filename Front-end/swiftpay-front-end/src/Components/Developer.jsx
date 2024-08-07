import React from 'react';
import { FaYahoo, FaGoogle, FaMicrosoft, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfileCard = () => {
  const history = useNavigate();

  const handleClose = () => {
    history('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <FaTimes size="1.5em" />
        </button>
        <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden shadow-md h-full">
          <div className="md:w-1/3">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFMvwlVTDLpEavp_RY959zJjT77ZLa8r7A_Q&s" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="md:w-2/3 flex flex-col">
            <div className="bg-gray-800 text-white p-5 flex justify-between items-center">
              <h3 className="text-2xl font-bold">Venkat Raman</h3>
              <div className="flex space-x-3">
                <FaYahoo className="text-yellow-500" size="1.5em" />
                <FaGoogle className="text-red-500" size="1.5em" />
                <FaMicrosoft className="text-blue-600" size="1.5em" />
              </div>
            </div>
            <div className="bg-gray-900 text-white p-3">
              <h6 className="text-lg">Web Designer &amp; Developer</h6>
            </div>
            <div className="flex flex-grow h-full">
              <div className="flex-1 text-center p-4 bg-blue-500 text-white flex flex-col justify-center h-full">
                <h4 className="text-2xl font-bold">90%</h4>
                <h6 className="text-lg">React</h6>
              </div>
              <div className="flex-1 text-center p-4 bg-green-500 text-white flex flex-col justify-center h-full">
                <h4 className="text-2xl font-bold">70%</h4>
                <h6 className="text-lg">JavaScript</h6>
              </div>
              <div className="flex-1 text-center p-4 bg-yellow-500 text-white flex flex-col justify-center h-full">
                <h4 className="text-2xl font-bold">80%</h4>
                <h6 className="text-lg">Tailwind</h6>
              </div>
              <div className="flex-1 text-center p-4 bg-red-500 text-white flex flex-col justify-center h-full">
                <h4 className="text-2xl font-bold">75%</h4>
                <h6 className="text-lg">MongoDB</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
