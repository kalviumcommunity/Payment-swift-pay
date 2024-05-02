import React from 'react';
import header1 from './../images/header-1.jpg';
import header2 from './../images/header-2.jpg';
import Bull from "./../images/Bull.png"

const LearningLandingPage = () => {
  return (
    <div>
      <nav className="mx-auto px-4 h-24 flex items-center justify-between max-w-screen-lg">
      <div className="text-xl font-semibold text-blue-500 flex items-center">
         <a href="#" className="flex items-center"><img className="w-10 h-10 mr-2" src={Bull} alt="Finance Academy logo" />
         <span>Finance Academy</span>
  </a>
</div>
        <ul className="list-none flex items-center gap-4">
          <li className="nav-link"><a href="#" className="px-4 py-2 text-base font-medium text-gray-900 hover:text-primary">Home</a></li>
          <li className="nav-link"><a href="#" className="px-4 py-2 text-base font-medium text-gray-900 hover:text-primary">Courses</a></li>
          <li className="nav-link"><a href="#" className="px-6 py-2 text-base font-medium text-white bg-primary rounded-lg bg-blue-500 hover:bg-primary-dark">Register as Mentor</a></li>
        </ul>
      </nav>

      <section className="max-w-screen-lg mx-auto py-4 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-normal leading-tight text-primary-dark mb-4">
            Best Learning<br />
            <span className="font-bold text-blue-500">Financial Platform</span><br />
            <span className="font-bold text-primary text-blue-500">in The World</span>
          </h1>
          <p className="text-lg text-gray-900 mb-8">
          Unlock your full learning potential with our advanced financial education platform. Seamlessly blending cutting-edge technology and finance education, we offer an immersive learning experience that combines interactive lessons, virtual trading simulations, and personalized financial insights.
          </p>
          <form className="flex items-center space-x-4">
            <input type="text" placeholder="What do you want to learn?" className="w-full max-w-xs p-3 text-sm border-none shadow-md" />
            <button type="submit" className="py-3 px-6 bg-primary text-white rounded-lg mt-4 bg-blue-500 hover:bg-primary-dark">
              Search Course
            </button>
          </form>
        </div>

        <div className="relative grid grid-cols-2 gap-8">
          <img src={header1} alt="header" className="w-full max-w-xs mx-auto rounded-lg transform translate-y-14" />
          <img src={header2} alt="header" className="w-full max-w-xs mx-auto rounded-lg transform translate-y--14" />
        </div>
      </section>
    </div>
  );
};

export default LearningLandingPage;
