import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-scroll';


const Error404 = () => {
  const copyContainerRef = useRef(null);

  const animateCopy = () => {
    const $copyContainer = copyContainerRef.current;
    const text = $copyContainer.querySelector('p');
    const characters = text.textContent.split('');

    text.innerHTML = ''; // Clear the original text content

    characters.forEach((char, index) => {
      const charSpan = document.createElement('span');
      charSpan.textContent = char;
      charSpan.style.opacity = 0;
      text.appendChild(charSpan);

      gsap.to(charSpan, {
        duration: 0.6,
        opacity: 1,
        ease: 'power2.out',
        delay: index * 0.05,
      });
    });
  };

  useEffect(() => {
    animateCopy(); // Initial typing animation
    const interval = setInterval(animateCopy, 3000); // Repeat every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white font-mono">
      <div className="text-center" ref={copyContainerRef}>
        <div className="copy-container inline-block relative">
          <p className="text-4xl">404, page not found.</p>
        </div>
      </div>
     
    </div>
  );
};

export default Error404;
