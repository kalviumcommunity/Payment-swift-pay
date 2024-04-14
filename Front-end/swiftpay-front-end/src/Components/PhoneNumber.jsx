import React, { useState } from 'react';
import { auth } from '../../Firebase/Fire.config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const VerifyPhoneNumber = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleSendCode = () => {
    const appVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'invisible'
    }, auth);

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        setVerificationId(confirmationResult.verificationId);
      })
      .catch((error) => {
        console.error('Error sending code:', error);
      });
  };

  const handleVerifyCode = () => {
    confirmationResult.confirm(verificationCode)
      .then((result) => {
        // User successfully signed in
        console.log('User signed in:', result.user);
      })
      .catch((error) => {
        console.error('Error verifying code:', error);
      });
  };

  return (
    <div>
      <h1>Phone Number Verification</h1>
      <div id="recaptcha-container"></div>
      <PhoneInput
        country={'us'} // Set default country here
        value={phoneNumber}
        onChange={setPhoneNumber}
      />
      <button onClick={handleSendCode}>Send Verification Code</button>
      <input
        type="text"
        placeholder="Enter verification code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <button onClick={handleVerifyCode}>Verify Code</button>
    </div>
  );
};

export default VerifyPhoneNumber;
