import React from 'react';
import './Footer.css';
import bull from "../images/Bull.png"
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer bg-blue-500 mt-16">
            <div className="footer-content">
            <div className="footer-section">
               <img src={bull} alt="" className="w-12 h-12" />
            </div>
                <div className="footer-section">
                    <h3 className='footer_titles' >Contact</h3>
                    <p>123 Main St, City, Country</p>
                    <p>Email: venkat@gmail.com</p>
                    <p>Phone: +91 9498407843</p>
                </div>

                <div className="footer-section">
                    <h3  className='footer_titles'>Quick Links</h3>
                    <ul className="footer-links">
                        <li><Link className='footer_navigation' to="/customer">Feedback</Link></li>
                        <li><Link className='footer_navigation' to="/conditions">Terms & condition</Link></li>
                        <li><Link className='footer_navigation' to="/privacy">Privacy policy</Link></li>
                    </ul>
                </div>

                <div className="footer-section mr-10" id='use'>
                    <h3 className='footer_titles'>Follow Us</h3>
                    <ul className="footer-social">
                        <li className='footer_social'><a href="#facebook" className="footer_social-link"><i className="fab fa-facebook-f"></i></a></li>
                        <li className='footer_social'><a href="#twitter" className="footer_social-link"><i className="fab fa-twitter"></i></a></li>
                        <li className='footer_social'><a href="#instagram" className="footer_social-link"><i className="fab fa-instagram"></i></a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-copyright mt-3">
                <p>&copy; {new Date().getFullYear()} Financial Hub Company. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;