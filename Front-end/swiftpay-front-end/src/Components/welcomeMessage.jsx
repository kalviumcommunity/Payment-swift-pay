// Import Firebase and SendGrid
import { auth } from './../../Firebase/Fire.config';
import sgMail from '@sendgrid/mail';

// Set your SendGrid API key
sgMail.setApiKey('SG.ybNh3cftRFS4Ib8QTu3-Uw.KWp_yQDddWiviOs807hR4fAd7d3Tt1a-wwMIn_vUEiQk');

// Function to send a welcome email
const SendWelcomeEmail = async (user) => {
    // Check if the user object is defined and has an email property
    if (user && user.email) {
        const emailData = {
            from: 'your-email@example.com', // Your email address
            to: user.email,
            subject: 'Welcome to Our App!',
            text: `Hello ${user.displayName || 'there'},\n\nThank you for signing up! We're excited to have you on board.\n\nBest,\nYour App Team`,
            html: `<p>Hello ${user.displayName || 'there'},</p>
                   <p>Thank you for signing up! We're excited to have you on board.</p>
                   <p>Best,</p>
                   <p>Your App Team</p>`,
        };

        try {
            await transporter.sendMail(emailData);
            console.log('Welcome email sent successfully.');
        } catch (error) {
            console.error('Error sending welcome email:', error);
        }
    } else {
        console.error('User object is undefined or missing email property');
    }
};


// Listen for user authentication state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        // If the user is signing in for the first time
        if (user.metadata.creationTime === user.metadata.lastSignInTime) {
            SendWelcomeEmail(user);
        }
    }
});

export default SendWelcomeEmail

