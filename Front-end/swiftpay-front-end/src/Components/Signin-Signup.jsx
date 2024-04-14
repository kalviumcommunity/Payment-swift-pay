import React, { useEffect, useState } from 'react';
import "./SignIn-SignUp.css"
import {FaYahoo, FaGoogle, FaMicrosoft } from 'react-icons/fa';
import register from "./../images/reg.svg"
import Log from "./../images/log.svg"
import { auth } from '../../Firebase/Fire.config';
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup,OAuthProvider} from "firebase/auth"
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendEmailVerification } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll';




const AuthForm = () => {
  const [emailforsignup, setEmailForSignup] = useState("");
  const [passwordforsignup, setPasswordForSignup] = useState("");


  useEffect(() => {
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    const handleSignUpMode = () => {
      container.classList.add("sign-up-mode");
    };

    const handleSignInMode = () => {
      container.classList.remove("sign-up-mode");
    };

    sign_up_btn.addEventListener("click", handleSignUpMode);
    sign_in_btn.addEventListener("click", handleSignInMode);

    return () => {
      sign_up_btn.removeEventListener("click", handleSignUpMode);
      sign_in_btn.removeEventListener("click", handleSignInMode);
    };
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailforsignup, passwordforsignup);
      const user = userCredential.user;
      console.log(user);
      toast.success("Logged in successfully!");
      navigate('/Main');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(errorMessage);
      }
      console.error(error);
    }
  };
  

  const microsoft = async (e) => {
    const provider = new OAuthProvider('microsoft.com');
    try {
        const result = await signInWithPopup(auth, provider);
        const isNewUser = result.additionalUserInfo?.isNewUser;
        const user = result.user;

        // Check if the user's email is verified
        if (!user.emailVerified) {
            // Send email verification
            await sendEmailVerification(user);
            toast.info('Verification email sent. Please verify your email address.');
        }

        if (isNewUser) {
            toast.success('Thank you for signing up!');
        } else {
            toast.success('Welcome, you are logged in!');
        }

        // Set user information in cookie
        Cookies.set('user', user.displayName, { expires: 365 }); // Cookie expires in 365 days
        Cookies.set('logedin', 'True', { expires: 365 });
         // Cookie expires in 365 days
         navigate('/Main');
    } catch (error) {
        console.error(error.message);
        if (error.code === 'auth/email-already-in-use') {
            toast.error('The email address is already in use by another account.');
        } else {
            toast.error('The email address is already in use by another account.');
        }
    }
}

const Yahoo = async () => {
  try {
    const provider = new OAuthProvider('yahoo.com');
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if the user's email is verified
    if (!user.emailVerified) {
      // Send email verification
      await sendEmailVerification(user);
      toast.info('Verification email sent. Please verify your email address.');
    }

    toast.success('Logged in successfully!');
    // Set user information in cookie
    Cookies.set('user', user.displayName, { expires: 365 }); // Cookie expires in 365 days
    Cookies.set('logedin', 'True', { expires: 365 }); // Cookie expires in 365 days
    navigate('/Main');
  } catch (error) {
    console.error(error.message);
    if (error.code === 'auth/email-already-in-use') {
      toast.error('The email address is already in use by another account.');
    } else {
      toast.error('An error occurred during Yahoo authentication. Please try again.');
    }
  }
};



  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailforsignup, passwordforsignup);
      const user = userCredential.user;
      console.log(user);
      
      // Send email verification
      await sendEmailVerification(user);
  
      // Display success message and set user information in cookie
      toast.success('Thank you for signing up! Please check your email for verification.');
      Cookies.set('user', user, { expires: 7 }); // Cookie expires in 7 days
      navigate('/Main');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/email-already-in-use') {
        toast.error('The email address is already in use by another account.');
      } else if (errorCode === 'auth/weak-password') {
        toast.error('The password is too weak. Please choose a stronger password.');
      } else {
        toast.error(errorMessage);
      }
      console.error(error);
    }
  };
  const google = async (e) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const isNewUser = result.additionalUserInfo?.isNewUser;
      if (isNewUser) {
        toast.success('Thank you for signing up! A verification email has been sent.');
        await sendEmailVerification(result.user);
      } else {
        toast.success('Welcome, your are in !.');
      }
  
      // Set user information in cookie
      const user = result.user;
      Cookies.set('user', user.displayName, { expires: 7 }); // Cookie expires in 7 days
      Cookies.set('logedin', 'True', { expires: 7 }); // Cookie expires in 7 days
      navigate('/Main');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
  
      if (errorCode === 'auth/email-already-in-use') {
        toast.error('The email address is already in use by another account.');
      } else {
        toast.error(errorMessage);
      }
      console.error(error);
    }
  };

  const forgotPasswordLink = (
    <Link to='/Forgot' className="forgot-password-link underline">
      Forgot Password <span>?</span>
    </Link>
  );
  
  // Function to send email verification
  const sendEmailVerification = async (user) => {
    try {
      await sendEmailVerification(user);
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  };
  const handleEmailChange = (e) => {
    setEmailForSignup(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPasswordForSignup(e.target.value);
  };
  const navigate=useNavigate()


  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={handleSignIn} className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
                <input type="email"  placeholder="Email"  onChange={handleEmailChange}  value={emailforsignup}   pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" // Email patternrequired // Required field 
                /></div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" onChange={handlePasswordChange} value={passwordforsignup} />
            </div>
            {forgotPasswordLink}
            <input type="submit" value="Login" className="btn solid" />
            <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
            <a href="#" onClick={Yahoo}  className="social-icon">
                <FaYahoo size={29} />
              </a>
              <a href="#" onClick={google} className="social-icon">
                <FaGoogle size={29} />
              </a>
              <a href="#" onClick={microsoft}  className="social-icon">
                <FaMicrosoft size={29} />
              </a>
            </div>
          </form>
          <form onSubmit={handleSignUp} className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input type="email" placeholder="Email" onChange={handleEmailChange} value={emailforsignup} />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" onChange={handlePasswordChange} value={passwordforsignup} />
            </div>
            <input type="submit" className="btn" value="Sign up" />
            <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
            <a href="#" onClick={Yahoo} className="social-icon">
                <FaYahoo size={29} />
              </a>
              <a href="#" onClick={google}  className="social-icon">
                <FaGoogle size={29} />
              </a>
              <a href="#" onClick={microsoft}  className="social-icon">
                <FaMicrosoft size={29} />
              </a>
            </div>
          </form>
        </div>
      </div>
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here ?</h3>
            <p>
            "Welcome to our Financial Hub! Discover opportunities, gain insights, and connect with experts. Let's thrive together!"
             
            </p>
            <button className="btn transparent" id="sign-up-btn">
              Sign up
            </button>
          </div>
          <img src={Log} className="image" alt="" />
          {/* Image placeholder or import goes here */}
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us ?</h3>
            <p>
              "Welcome back to our Financial Hub! Explore news, share insights, and engage in discussions. Let's continue our journey together!"
            </p>
            <button className="btn transparent" id="sign-in-btn">
              Sign in
            </button>
          </div>
          <img src={register}  className="image" alt="" />
          {/* Image placeholder or import goes here */}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
