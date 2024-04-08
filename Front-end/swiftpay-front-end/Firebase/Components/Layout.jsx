// Layout component
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
  return (
    <div>
      <ToastContainer />
      {children}
    </div>
  );
};

export default Layout;
