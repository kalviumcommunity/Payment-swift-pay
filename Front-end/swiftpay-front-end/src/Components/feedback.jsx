import React, { useState } from 'react';
import { addDoc, collection } from "firebase/firestore";
import { db } from '../../Firebase/Fire.config';
import heroImage from './../images/Feedback.jpg'; // Import your hero image
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function Feedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const navigate =useNavigate();

  const handleAdd = async () => {
    // Check if any of the input fields are empty
    if (!name || !email || !text) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }
  
    try {
      const docRef = await addDoc(collection(db, "feedback"), {
        name: name,
        email: email,
        message: text
      });
      console.log("Document written with ID: ", docRef.id);
      toast.success("Feedback submitted successfully!");
      setName("");
      setEmail("");
      setText("");
      navigate('/');
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("An error occurred. Please try again later.");
    }
  };
  

  return (
    <div className="relative bg-gray-900 h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img className="w-full h-full object-cover opacity-50" src={heroImage} alt="Hero Banner" />
      </div>
      <div className="relative z-10 flex flex-col justify-center items-center h-full py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Financial hub</h1>
        <p className="text-lg md:text-xl text-white mb-8">Leave your feedback below</p>
        <div className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-md p-8 rounded-lg shadow-lg">
          <label className="block mb-4">
            <span className="text-white">Name:</span>
            <input type="text" className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 px-4 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block mb-4">
            <span className="text-white">Email:</span>
            <input type="email" className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 px-5 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="block mb-4">
            <span className="text-white">Message:</span>
            <textarea className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 px-4 py-2" value={text} onChange={(e) => setText(e.target.value)} />
          </label>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg" onClick={handleAdd}>Submit Feedback</button>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
