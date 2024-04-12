import React, { useEffect, useState } from 'react';
import head from './../images/head.png';
import Tilt from 'react-parallax-tilt';
import { Link } from 'react-scroll';
import './Landing.css'; // Import the CSS file with the animation styles
import SpringAnimation from './Spring';
import forum from './../images/Fourm.png';
import people from "./../images/People.png"
import Building from "./../images/Building.png"
import File from "./../images/File.png" 
import Women1 from "./../images/Women2.png"
import women2 from "./../images/Women.png"
import men from "./../images/man.png"
import ResponsiveFooter from './Footer';
import CustomFooter from './Footer';

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
      <div className="sm:mt-20 md:flex flex-col justify-center items-center h-screen" style={{ marginTop: '-150px' }}>
        <div className={`text-center mb-12 ${showContent ? 'fade-in-up' : ''}`}>
          <h1 className="text-2xl  font-bold md:text-3xl font-bold">Get your <span className="text-blue-500">unmatched</span> experience</h1>
        </div>
        <div className={`text-center mb-8 ${showContent ? 'fade-in-up' : ''}`} style={{ marginBottom: '8px' }}>
          <p className="text-sm md:text-lg text-wrap" style={{ marginBottom: '8px' }}>Welcome, finance user! How can I assist you today with your finance-related inquiries or tasks?<br/>
          Whether you need help with financial analysis, investment advice, budgeting, or anything<br/>
           else finance-related, feel free to ask, and I'll do my best to provide you with the information or guidance you need</p>
        </div>
        <div style={{ height: '80px' }}></div> {/* Space between content and image */}
        <Link to="forumSection" spy={true} smooth={true} duration={500} className={`${showImage ? 'fade-in-up' : ''}`} style={{ marginTop: '-20px' }}>
          {/* Scroll animation */}
          <img src={forum} alt="Forum" className="max-w-xs mx-auto mt-1" />
        </Link>
        <h1 className='text-lg font-bold text-center mb-5 mt-5 mr-5 ml-10'>
          Why <span className='text-blue-500'> People </span> Should choose us
        </h1>
      </div>

      {/* Image section */}
     <div className="md:mx-auto flex flex-col items-center md:flex-row md:justify-center md:flex-wrap md:gap-8 ml-4 md:ml-10">
  <div className="text-center max-w-xs mb-8 md:mb-0 mr-0 md:mr-3 mt-4 md:mt-0">
  <img className="mx-auto max-w-full mt-28 md:mt-0" src={people} alt="People" /> {/* Added mt-4 for mobile view */}
    <h1 className="font-bold mt-5 text-xl md:text-xl">One Stop <span className="text-blue-500 font-bold">For</span> Finance</h1>
    <p className="mt-2 text-sm md:text-base">Discover the ultimate finance hub.<br />
      Your one-stop solution for Finance<br />
      Unlock financial freedom today</p>
  </div>
  <div className="text-center max-w-xs mb-8 md:mb-0 mr-0 md:mr-3 mt-4 md:mt-0">
    <img className="mx-auto max-w-full" src={File} alt="File" />
    <h1 className="font-bold mt-5 text-xl md:text-xl">All Managed <span className="text-blue-500 font-bold">in</span> one place</h1>
    <p className="mt-1 text-sm md:text-base">Access all financial tools in one hub.<br />
      Streamline your finances effortlessly.<br />
      Experience convenience like never before</p>
  </div>
  <div className="text-center max-w-xs mt-4 md:mt-0">
    <img className="mx-auto max-w-full" src={Building} alt="Building" />
    <h1 className="font-bold mt-5 text-xl md:text-xl">Business <span className="text-blue-500 font-bold">Grow</span> Faster</h1>
    <p className="mt-1 text-sm md:text-base">Empower your business with our suite.<br />
      Navigate growth with confidence.<br />
      Unlock the potential of your business today</p>
  </div>
</div>




<div  className='mt-5'>
<div className="text-center mb-4 mr-15">
  <a className="text-blue-500 underline" href="https://parallexvenkat.netlify.app/" target="_blank" rel="noopener noreferrer">Major features</a>
</div>


</div>
{/* Laptop/Desktop View */}
<div className="flex flex-col items-center mt-8 md:flex-row md:justify-around">
  <div className="max-w-md text-center md:text-left md:mr-8">
    <h2 className="text-xl font-bold mb-2">Every one <span className='text-blue-500'>Can</span> Use Hub</h2>
    <p className="text-sm md:text-lg text-wrap mb-4 md:ml-0">
    A financial hub offers easy access to diverse financial services for all, fostering financial inclusivity and knowledge-sharing
    </p>
    <a href="https://6617e7409e681013ad8c9782--wonderful-vacherin-a19ecf.netlify.app/" target='_blank' className="text-blue-500 underline block mb-4">Learn more</a>
  </div>
  <div className="mt-4 md:mt-0 max-w-md md:max-w-none">
    <img className="women" src={Women1} alt="Women" style={{ width: '100%', maxWidth: '400px', height: 'auto' }} />
  </div>
</div>
<div className="flex flex-col items-center mt-8 md:flex-row md:justify-around">
  <div className="mt-4 md:mt-0 max-w-md md:max-w-none">
    <img className="women" src={women2} alt="Women" style={{ width: '100%', maxWidth: '400px', height: 'auto' }} />
  </div>
  <div className="max-w-md text-center md:text-left md:ml-8">
    <h2 className="text-xl font-bold mb-2">Financial Solutions <span className='text-blue-500'>for</span> Everyone</h2>
    <p className="text-sm md:text-lg text-wrap mb-4 md:ml-0">
    Our financial hub provides secure and reliable solutions for all users. We prioritize the security of your financial information, ensuring that your data is protected at all times. With advanced encryption and robust security measures in place, you can trust our platform to safeguard your financial assets.
    </p>
    <a href="https://benevolent-kitsune-14ae9f.netlify.app/" className="text-blue-500 underline block mb-4" onClick={(e) => { e.preventDefault(); window.open('https://benevolent-kitsune-14ae9f.netlify.app/', '_blank'); }}>Learn more</a>
  </div>
 

</div>
<div className="flex flex-col items-center mt-8 md:flex-row md:justify-around">
  <div className="max-w-md text-center md:text-left md:mr-8">
    <h2 className="text-xl font-bold mb-2">Expert  <span className='text-blue-500'>Financial </span>Advice</h2>
    <p className="text-sm md:text-lg text-wrap mb-4 md:ml-0">
    Seeking financial advice is crucial for securing your future. Forums like Financial Help offer valuable insights and support from experts and peers. Our team provides personalized guidance for retirement, investments, and debt management, helping you achieve your goals.
    </p>
    <a href="https://6617de5ba1646806ba014b64--marvelous-bunny-46e6f6.netlify.app/" target='_blank' className="text-blue-500 underline block mb-4">Learn more</a>
  </div>
  <div className="mt-4 md:mt-0 max-w-md md:max-w-none">
    <img className="women" src={men} alt="Women" style={{ width: '100%', maxWidth: '400px', height: 'auto' }} />
  </div>
</div>
<CustomFooter/>
    </>
  );
}

export default LandingPage;

