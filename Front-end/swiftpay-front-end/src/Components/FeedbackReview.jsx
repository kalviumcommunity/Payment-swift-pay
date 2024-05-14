import React from 'react';
import './FeedbackRe.css'; 
import pic1 from "./../images/pic-1.jpg";
import pic2 from "./../images/pic-2.jpeg";
import pic3 from "./../images/pic-3.jpg";
import {Link} from "react-router-dom"

function CustomerSection() {
  return (
    <header className="customer-section">
      <div className="customer-section__wrapper">
        <div className="customer-section__content customer-section__content--left">
          <h1>Discover what our users say about Financial Hub</h1>
          <p>
            Financial Hub has been trusted by individuals and businesses alike to manage their finances effectively.
          </p>
          <p>
            Our platform provides comprehensive financial solutions, helping users achieve their financial goals.
          </p>
          <Link to='/Feedback'><button>Give your valuable feedback</button></Link>
        </div>
        <div className="customer-section__content customer-section__content--right">
          <div className="customer-card">
            <img src={pic1} alt="user" />
            <div className="customer-card__content">
              <span><i className="ri-double-quotes-l"></i></span>
              <div className="customer-card__details">
                <p>
                  Financial Hub has revolutionized the way I manage my personal finances. Highly recommended!
                </p>
                <h4>- Alice Johnson</h4>
              </div>
            </div>
          </div>
          <div className="customer-card">
            <img src={pic2} alt="user" />
            <div className="customer-card__content">
              <span><i className="ri-double-quotes-l"></i></span>
              <div className="customer-card__details">
                <p>
                  As a small business owner, Financial Hub has been instrumental in streamlining my financial processes.
                </p>
                <h4>- Mark Thompson</h4>
              </div>
            </div>
          </div>
          <div className="customer-card">
            <img src={pic3} alt="user" />
            <div className="customer-card__content">
              <span><i className="ri-double-quotes-l"></i></span>
              <div className="customer-card__details">
                <p>
                  Financial Hub's expert advice and tools have helped me achieve financial stability.
                </p>
                <h4>- Sarah Parker</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default CustomerSection;
