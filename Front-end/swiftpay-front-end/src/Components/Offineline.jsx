import React, { useEffect } from 'react';
import Bull from "./../images/Bull.png"; // Import an offline illustration image
import './Offline.css'; // Import CSS file for OfflinePage styles

function Offline() {
  return (
    
    <div className="offline-container">
      <img className="w-16 h-16" src={Bull} alt="Offline Illustration" />
      <div className="offline-content">
        <h1 className="offline-heading">
          <span className="fade-word">Oops!</span>
          <span className="fade-word">You're</span>
          <span className="fade-word"> offline</span>
          <span className="fade-word">Financial hub</span> {/* Add your app name here */}
        </h1>
        <p className="offline-message">Please check your internet connection and try again.</p>
      </div>
    </div>
  );
}

export default Offline;
