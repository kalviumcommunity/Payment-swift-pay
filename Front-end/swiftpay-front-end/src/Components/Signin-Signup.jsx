import React, { useEffect, useState } from 'react';
import './SignIn-SignUp.css';
import { FaYahoo, FaGoogle, FaMicrosoft } from 'react-icons/fa';
import register from './../images/reg.svg';
import Log from './../images/log.svg';
import { auth } from '../../Firebase/Fire.config';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    OAuthProvider,
    sendEmailVerification,
    onAuthStateChanged
} from 'firebase/auth';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const signInButton = document.querySelector('#sign-in-btn');
        const signUpButton = document.querySelector('#sign-up-btn');
        const container = document.querySelector('.container');

        const handleSignUpMode = () => container.classList.add('sign-up-mode');
        const handleSignInMode = () => container.classList.remove('sign-up-mode');

        signUpButton.addEventListener('click', handleSignUpMode);
        signInButton.addEventListener('click', handleSignInMode);

        return () => {
            signUpButton.removeEventListener('click', handleSignUpMode);
            signInButton.removeEventListener('click', handleSignInMode);
        };
    }, []);

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user.emailVerified) {
                toast.success('Logged in successfully!');
                navigate('/Main');
            } else {
                toast.warning('Please verify your email address before logging in.');
            }
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;

            if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                toast.error('Invalid email or password. Please try again.');
            } else {
                toast.error(errorMessage);
            }
            console.error(error);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Send email verification
            await sendUserVerificationEmail(user);

            toast.success('Thank you for signing up! Please check your email for verification.');
            Cookies.set('user', user.displayName, { expires: 7 });

            // Don't navigate to the main page yet; wait for verification
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

    const sendUserVerificationEmail = async (user) => {
        try {
            await sendEmailVerification(user);
            toast.info('Verification email sent. Please verify your email address.');
        } catch (error) {
            console.error('Error sending verification email:', error);
            toast.error('Error sending verification email. Please try again.');
        }
    };

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleGoogleAuth = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (user.emailVerified) {
                toast.success('Welcome! You are logged in.');
                Cookies.set('user', user.displayName, { expires: 7 });
                Cookies.set('logedin', 'True', { expires: 7 });
                navigate('/Main');
            } else {
                toast.warning('Please verify your email address before logging in.');
            }
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

    const handleYahooAuth = async () => {
        try {
            const provider = new OAuthProvider('yahoo.com');
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (user.emailVerified) {
                toast.success('Logged in successfully!');
                Cookies.set('user', user.displayName, { expires: 7 });
                Cookies.set('logedin', 'True', { expires: 7 });
                navigate('/Main');
            } else {
                toast.warning('Please verify your email address before logging in.');
            }
        } catch (error) {
            console.error(error.message);
            toast.error('An error occurred during Yahoo authentication. Please try again.');
        }
    };

    const handleMicrosoftAuth = async () => {
        try {
            const provider = new OAuthProvider('microsoft.com');
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (user.emailVerified) {
                toast.success('Logged in successfully!');
                Cookies.set('user', user.displayName, { expires: 7 });
                Cookies.set('logedin', 'True', { expires: 7 });
                navigate('/Main');
            } else {
                toast.warning('Please verify your email address before logging in.');
            }
        } catch (error) {
            console.error(error.message);
            toast.error('An error occurred during Microsoft authentication. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="forms-container">
                <div className="signin-signup">
                    <form onSubmit={handleSignIn} className="sign-in-form">
                        <h2 className="title">Sign in</h2>
                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input type="email" placeholder="Email" onChange={handleEmailChange} value={email} required />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input type="password" placeholder="Password" onChange={handlePasswordChange} value={password} required />
                        </div>
                        <Link to='/Forgot' className="forgot-password-link underline ml-56">
                            Forgot Password <span>?</span>
                        </Link>
                        <input type="submit" value="Login" className="btn solid" />
                        <p className="social-text">Or Sign in with social platforms</p>
                        <div className="social-media">
                            <a href="#" onClick={handleYahooAuth} className="social-icon">
                                <FaYahoo size={29} />
                            </a>
                            <a href="#" onClick={handleGoogleAuth} className="social-icon">
                                <FaGoogle size={29} />
                            </a>
                            <a href="#" onClick={handleMicrosoftAuth} className="social-icon">
                                <FaMicrosoft size={29} />
                            </a>
                        </div>
                    </form>

                    <form onSubmit={handleSignUp} className="sign-up-form">
                        <h2 className="title">Sign up</h2>
                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input type="email" placeholder="Email" onChange={handleEmailChange} value={email} required />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input type="password" placeholder="Password" onChange={handlePasswordChange} value={password} required />
                        </div>
                        <input type="submit" className="btn" value="Sign up" />
                        <p className="social-text">Or Sign up with social platforms</p>
                        <div className="social-media">
                            <a href="#" onClick={handleYahooAuth} className="social-icon">
                                <FaYahoo size={29} />
                            </a>
                            <a href="#" onClick={handleGoogleAuth} className="social-icon">
                                <FaGoogle size={29} />
                            </a>
                            <a href="#" onClick={handleMicrosoftAuth} className="social-icon">
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
                        <p>Sign up and discover great amount of new opportunities!</p>
                        <button className="btn transparent" id="sign-up-btn">
                            Sign up
                        </button>
                    </div>
                    <img src={register} className="image" alt="Register" />
                </div>
                <div className="panel right-panel">
                    <div className="content">
                        <h3>One of us?</h3>
                        <p>Sign in and be a part of our community!</p>
                        <button className="btn transparent" id="sign-in-btn">
                            Sign in
                        </button>
                    </div>
                    <img src={Log} className="image" alt="Login" />
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
