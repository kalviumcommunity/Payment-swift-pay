import React from 'react';
import './Loading.css'; 
import bull from './../images/Bull.png'

function Loading() {
  return (
    <div className="loading-container">
      {/* Loading with text animation */}
      <div className="loading">
        <div className="loading-image">
          <img className='w-16 h-16' src={bull} alt="" />
        </div>
        <div className="loading-text">
          <span className="loading-text-words">F</span>
          <span className="loading-text-words">I</span>
          <span className="loading-text-words">N</span>
          <span className="loading-text-words">A</span>
          <span className="loading-text-words">N</span>
          <span className="loading-text-words">C</span>
          <span className="loading-text-words">E</span>
        </div>
      </div>
    </div>
  );
}

export default Loading;

