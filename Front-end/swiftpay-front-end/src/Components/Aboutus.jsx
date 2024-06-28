import React from 'react';

function Aboutus() {
  return (
    <div>
      <div className="mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-500 ">About Us</h1>

        <div className="flex flex-col lg:flex-row items-center mb-20 mt-24 mr-24">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-blue-500">Our Mission</h2>
            <p className="text-lg mb-4">
              Our mission at Financial Hub is to empower individuals and businesses
              to achieve their financial goals through innovative solutions and
              expert guidance. We are committed to providing personalized financial
              services that enhance financial well-being and foster economic growth.
            </p>
            <p className="text-lg mb-4">
              Join us on our mission to create a financially secure future for all.
              Together, we can build a stronger, more prosperous community.
            </p>
          </div>
          <div className="lg:w-1/2 lg:pl-12 mt-8 lg:mt-0">
            <img
              src="https://www.agenciesonline.biz/assets/images/Company%20Mission.jpg"
              alt="Financial Hub"
              className="w-full md:w-1/2 lg:w-3/4 h-auto rounded-lg shadow-lg mx-auto"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row-reverse items-center mb-20 mt-40">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-blue-500">Our Vision</h2>
            <p className="text-lg mb-4">
              At Financial Hub, our vision is to be a global leader in financial
              services, recognized for our innovative solutions and customer-centric
              approach. We aim to transform the financial landscape by leveraging
              cutting-edge technology and deep industry expertise.
            </p>
          </div>
          <div className="lg:w-1/2 lg:pl-12 mt-8 lg:mt-0">
            <img
              src="https://th.bing.com/th/id/R.02d049cb46f6f2ef9dec1a79e7603460?rik=nc%2bB42f81%2fX%2fHQ&riu=http%3a%2f%2fblog.kulturekonnect.com%2fhubfs%2fblog_images%2fmission-and-vision.jpg%23keepProtocol&ehk=8LQPb3ZwiVi3NXuBJjSg7Tnwkkd7iTuNJWAX%2bucW8A0%3d&risl=&pid=ImgRaw&r=0"
              alt="Financial Hub"
              className="w-full md:w-1/2 lg:w-3/4 h-auto rounded-lg shadow-lg mx-auto"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center mb-20 mt-40">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-blue-500">Our Values</h2>
            <p className="text-lg mb-4">
              Integrity, excellence, and customer satisfaction are the core values
              that drive everything we do at Financial Hub. We are committed to
              maintaining the highest standards of professionalism and ethical
              conduct in all our interactions.
            </p>
          </div>
          <div className="lg:w-1/2 lg:pl-12 mt-8 lg:mt-0">
            <img
              src="https://www.ceo-review.com/wp-content/uploads/2021/09/Business-Values.jpg"
              alt="Financial Hub"
              className="w-full md:w-1/2 lg:w-3/4 h-auto rounded-lg shadow-lg mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Aboutus;
