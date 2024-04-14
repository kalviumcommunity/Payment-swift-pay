import React, { useState } from 'react';
import { auth } from '../../Firebase/Fire.config';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      // Display a toast message when the password reset email is sent
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while sending the password reset email. Please try again.');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="flex justify-center bg-blue-500 items-center h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
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
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"onClick={handleForgotPassword}>Reset Password</button>
        <button className="w-full mt-5 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</button>
      </div>
    </div>
  );
};

export default ForgotPassword;
