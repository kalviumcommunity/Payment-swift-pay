import React from 'react';


const MyComponent = () => {
  return (
    <div className="main-content">
      <div className="concept concept-one">
        {/* Loop from 1 to 9 */}
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className={`hover hover-${i + 1}`} />
        ))}
        <h1>Desert</h1>
      </div>

      <div className="concept concept-two">
        {/* Loop through each letter in 'FOREST' */}
        {['F', 'O', 'R', 'E', 'S', 'T'].map((val, index) => (
          <div key={index} className="hover">
            <h1>{val}</h1>
          </div>
        ))}
      </div>

      <div className="concept concept-three">
        {/* Loop through each letter in 'CANYON' */}
        <div className="word">
          {['C', 'A', 'N', 'Y', 'O', 'N'].map((val, index) => (
            <div key={index} className="hover">
              <div></div>
              <div></div>
              <h1>{val}</h1>
            </div>
          ))}
        </div>
      </div>

      <div className="concept concept-four">
        <h1>Glacier</h1>
      </div>

      <div className="concept concept-five">
        <h1 className="word">
          {/* Loop through each letter in 'MOUNTAINS' */}
          {['B', 'I', 'T', 'C', 'O', 'I', 'N'].map((val, index) => (
            <span key={index} className="char">{val}</span>
          ))}
        </h1>
      </div>

      <div className="concept concept-six">
        <h1 className="word">
          {/* Loop through each letter in 'OCEAN' */}
          {['O', 'C', 'E', 'A', 'N'].map((val, index) => (
            <span key={index} className="char">{val}</span>
          ))}
        </h1>
      </div>

      <div className="concept concept-seven">
        <h1>Fries</h1>
      </div>

      <div className="concept concept-eight">
        <h1 className="word">
          {/* Loop through each letter in 'FALLS' */}
          {['F', 'A', 'L', 'L', 'S'].map((val, index) => (
            <div key={index} className="char" data-content={val}>
              {val}
            </div>
          ))}
        </h1>
      </div>

      <footer-main>
        {/* Links with icons */}
        <a href="https://twitter.com/meowlivia_" target="_blank" rel="noopener noreferrer">
          <i className="icon-social-twitter icons" />
        </a>
        <a href="https://github.com/oliviale" target="_blank" rel="noopener noreferrer">
          <i className="icon-social-github icons" />
        </a>
        <a href="https://dribbble.com/oliviale" target="_blank" rel="noopener noreferrer">
          <i className="icon-social-dribbble icons" />
        </a>
      </footer-main>
    </div>
  );
};

export default MyComponent;
