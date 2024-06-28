import React, { useState } from 'react';
import './Feedback.css'; // Import your modified CSS file
import { db } from '../../Firebase/Fire.config';
import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';
import emailIcon from "./../images/Email.png";
import phoneIcon from "./../images/telephone-call-symbol-smartphone-ringing-phone-removebg-preview.png";
import locationIcon from './../images/location.png';
import { useNavigate } from "react-router-dom";
import Dots from "./../images/Dots2.jpg";

const Feedback = () => {
  const [focus, setFocus] = useState({
    userName: false,
    userEmail: false,
    userPhone: false,
    userMessage: false
  });

  const handleFocus = (field) => {
    setFocus({ ...focus, [field]: true });
  };

  const handleBlur = (field, value) => {
    if (value === '') {
      setFocus({ ...focus, [field]: false });
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const userName = formData.get('userName');
    const userEmail = formData.get('userEmail');
    const userPhone = formData.get('userPhone');
    const userMessage = formData.get('userMessage');

    if (!userName || !userEmail || !userPhone || !userMessage) {
      toast.error('Please fill in all fields');
      return;
    }

    const data = { userName, userEmail, userPhone, userMessage };
    try {
      const docRef = await addDoc(collection(db, 'feedback'), data);
      console.log('Document written with ID: ', docRef.id);
      form.reset();
      toast.success('Thank you for the feedback');
      navigate('/');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="feedback-container">
      <span className="feedback-big-circle"></span>
      <img src={Dots} className="feedback-square" alt="background decoration" />
      <div className="feedback-form-container">
        <div className="feedback-contact-info">
          <h3 className="feedback-title">Give us your feedback</h3>
          <p className="feedback-text">
            Thank you for sharing your thoughts with us.
            Your feedback is invaluable to us as we continue to grow and improve.<br />
          </p>
          <div className="feedback-info">
            <div className="feedback-information">
              <img src={locationIcon} className="feedback-icon" alt="location" />
              <p>92 Cherry Drive Uniondale, NY 11553</p>
            </div>
            <div className="feedback-information">
              <img src={emailIcon} className="feedback-icon" alt="email" />
              <p>Financial@hub.com</p>
            </div>
            <div className="feedback-information">
              <img src={phoneIcon} className="feedback-icon" alt="phone" />
              <p>123-456-7898</p>
            </div>
          </div>
        </div>
        <div className="feedback-contact-form">
          <span className="feedback-circle feedback-circle-one"></span>
          <span className="feedback-circle feedback-circle-two"></span>
          <form onSubmit={handleSubmit} autoComplete="off">
            <h3 className="feedback-title">Feedback Form</h3>
            <div className={`feedback-input-container ${focus.userName ? 'feedback-focus' : ''}`}>
              <input
                type="text"
                name="userName"
                className="feedback-input"
                onFocus={() => handleFocus('userName')}
                onBlur={(e) => handleBlur('userName', e.target.value)}
              />
              <label className="feedback-label">Name</label>
              <span className="feedback-placeholder">Username</span>
            </div>
            <div className={`feedback-input-container ${focus.userEmail ? 'feedback-focus' : ''}`}>
              <input
                type="email"
                name="userEmail"
                className="feedback-input"
                onFocus={() => handleFocus('userEmail')}
                onBlur={(e) => handleBlur('userEmail', e.target.value)}
              />
              <label className="feedback-label">Email</label>
              <span className="feedback-placeholder">Email</span>
            </div>
            <div className={`feedback-input-container ${focus.userPhone ? 'feedback-focus' : ''}`}>
              <input
                type="tel"
                name="userPhone"
                className="feedback-input"
                onFocus={() => handleFocus('userPhone')}
                onBlur={(e) => handleBlur('userPhone', e.target.value)}
              />
              <label className="feedback-label">Phone</label>
              <span className="feedback-placeholder">Phone</span>
            </div>
            <div className={`feedback-input-container feedback-textarea ${focus.userMessage ? 'feedback-focus' : ''}`}>
              <textarea
                name="userMessage"
                className="feedback-input"
                onFocus={() => handleFocus('userMessage')}
                onBlur={(e) => handleBlur('userMessage', e.target.value)}
              ></textarea>
              <label className="feedback-label">Message</label>
              <span className="feedback-placeholder">Message</span>
            </div>
            <input type="submit" value="Send" className="feedback-btn" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
