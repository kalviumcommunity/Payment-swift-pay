import React, { useEffect, useState } from 'react';
import head from './../images/head.png';
import Tilt from 'react-parallax-tilt';
import { Link } from 'react-scroll';
import './Landing.css'; // Import the CSS file with the animation styles
import SpringAnimation from './Spring';
import forum from './../images/Fourm.png';

function LandingPage() {
  const [showContent, setShowContent] = useState(false);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
      setTimeout(() => {
        setShowImage(true);
      }, 500); // Adjust the delay based on your preference
    }, 2000);

    const handleScroll = () => {
      const element = document.getElementById('forumSection');
      if (element && window.scrollY > element.offsetTop - window.innerHeight) {
        setShowImage(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
     <div className="sm:mb-10 md:flex flex-col md:flex-row justify-between items-start h-screen mt-10">
  {/* Left section */}
  <div className={`md:w-1/2 px-8 md:pr-0 mt-10 md:mt-0 ${showContent ? 'slide-in-left' : 'hidden'} ${!showContent ? 'laptop-view' : ''}`}>
    <div className="flex flex-col justify-center items-center h-full">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 mt-5 md:mt-10 leading-tight text-center">
        Get your <span className="text-blue-500">Money</span> right
        <span className="block text-2xl md:text-5xl font-bold mt-2">
          With <span className="text-blue-500">Financial</span> hub
        </span>
      </h1>
      <p className="text-sm md:text-lg ml-2 text-center mb-6"> {/* Added margin-bottom */}
        At Finance, we provide tailored financial solutions. Our experts specialize in finance, investment, and other services.
      </p>
      <SpringAnimation />
    </div>
  </div>

  {/* Right section */}
  <div className={`md:w-1/2 hidden md:block flex justify-center items-center mt-10 md:mt-0 overflow-hidden ${showContent ? '' : 'opacity-0'}`}>
    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.05} gyroscope={true}>
      <img src={head} alt="Head" className="mx-auto max-w-2/3 md:max-w-full max-h-64 md:max-h-full mt-10" />
    </Tilt>
  </div>
</div>


      {/* Content section with SpringAnimation */}
      <div className="flex flex-col justify-center items-center h-screen" style={{ marginTop: '-90px' }}>
        <div className={`text-center mb-12 ${showContent ? 'fade-in-up' : ''}`}>
          <h1 className="text-2xl  font-bold md:text-3xl font-bold">Get your <span className="text-blue-500">unmatched</span> experience</h1>
        </div>
        <div className={`text-center mb-12 ${showContent ? 'fade-in-up' : ''}`} style={{ marginBottom: '8px' }}>
          <p className="text-base md:text-lg" style={{ marginBottom: '8px' }}>Welcome, finance user! How can I assist you today with your finance-related inquiries or tasks? Whether you need help with financial analysis, investment advice, budgeting, or anything else finance-related, feel free to ask, and I'll do my best to provide you with the information or guidance you need</p>
        </div>
        <div style={{ height: '80px' }}></div> {/* Space between content and image */}
        <Link to="forumSection" spy={true} smooth={true} duration={500} className={`${showImage ? 'fade-in-up' : ''}`} style={{ marginTop: '-20px' }}>
          {/* Scroll animation */}
          <img src={forum} alt="Forum" className="max-w-xs mx-auto mt-4" />
        </Link>
        <h1 className='text-lg font-bold text-center mb-10'>
          Our <span className='text-blue-500'>Major</span> Services
        </h1>
      </div>
      {/* <div className="flex justify-center" id='Flip'>
      <FlipCard frontImage={news} Title=" Financial news" backwritting="Our financial news feature delivers concise and insightful updates on market trends, economic developments, and corporate announcements. Stay informed and ahead of the curve with our curated selection of timely news articles, tailored to meet your financial needs and interests."/>
      <FlipCard frontImage={blog} Title=" " backwritting="" />
      <FlipCard frontImage="front3.jpg" Title=" " backwritting="" />
      </div> */}
    </>
  );
}

export default LandingPage;
