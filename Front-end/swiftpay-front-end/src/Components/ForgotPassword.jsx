import React, { useState } from 'react';
import { auth } from '../../Firebase/Fire.config';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate=useNavigate();

  const motivationalMessages = [
    "You're one step closer to regaining access to your account!",
    "Stay positive! We're here to help you.",
    "Don't worry, we've got your back. Let's get your password reset!",
    "You've got this! Keep going!",
    "Keep calm and reset your password. We believe in you!"
  ];

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    return motivationalMessages[randomIndex];
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent. Please check your inbox.');
      setTimeout(() => {
        toast.info(getRandomMessage());
      }, 2000); 
      navigate('/signIn-signUp')

    } catch (error) {
      console.error(error);
      toast.error('An error occurred while sending the password reset email. Please try again.');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="flex justify-center items-center h-screen" >
      <div className="w-full max-w-md p-8  bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={handleEmailChange}
            value={email}
            required
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleForgotPassword}>Reset Password</button>
      </div>
    </div>
  );
};

export default ForgotPassword;
