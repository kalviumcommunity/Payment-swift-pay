import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomNavbar from './Components/Navbar';
import AuthForm from './Components/Signin-Signup';
import Layout from './Components/Layout';
import Main from './Components/Main';
import Error404 from './Components/Error.jsx';
import Aboutus from './Components/Aboutus.jsx';
import Service from './Components/Service.jsx';
import ContactUs from './Components/Contactus.jsx';
import TermsAndConditions from './Components/Terms.jsx';
import PrivacyPolicy from './Components/Privacy.jsx';
import ForgotPassword from './Components/ForgotPassword.jsx';
import Feedback from './Components/feedback.jsx';
import Crypto from './Components/Crypto.jsx';
import Business from './Components/Bussiness.jsx';
import Finance from './Components/Finance.jsx';
import Stock from './Components/Stock.jsx';
import ExchangeRateCalculator from './Components/Convert.jsx';
import BudgetApp from './Components/BudgetApp.jsx';
import TOdo from './Components/Todo.jsx';
import NewsPage from './Components/NewsLanding.jsx';;
import FinanceBlogLandingPage from './Components/Financiallanding.jsx';
import BudgetLanding from './Components/BudgetLanding.jsx';
import FeedbackReview from './Components/FeedbackReview.jsx';
import Mainpage from './Components/Mainpage.jsx';
import ProfileCard from './Components/Developer.jsx';
import BlogLanding from './Components/BlogLanding.jsx';
import ForumLanding from './Components/ForumLanding.jsx';




function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<CustomNavbar />} />
          <Route path='/signIn-signUp' element={<Layout><AuthForm /></Layout>} />
          <Route path='/Main' element={<Main />} />
          <Route path='/About' element={<Aboutus />} />
          <Route path='/Service' element={<Service />} />
          <Route path='/contact' element={<Layout><ContactUs /></Layout>} />
          <Route path='/conditions' element={<TermsAndConditions />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
          <Route path='/Forgot' element={<Layout><ForgotPassword /></Layout>} />
          <Route path='/Feedback' element={<Layout><Feedback /></Layout>} />
          <Route path='*' element={<Error404 />} />
          <Route path='/crypto' element={<Layout><Crypto /></Layout>} />
          <Route path='/Business' element={<Layout><Business /></Layout>} />
          <Route path='/Finance' element={<Layout><Finance /></Layout>} />
          <Route path='/Stock' element={<Layout><Stock /></Layout>} />
          <Route path='/Exchange' element={<ExchangeRateCalculator />} />
          <Route path='/To' element={<TOdo />} />
          <Route path='/News' element={<NewsPage />} />
          <Route path='/Budget' element={<BudgetApp />} />
          <Route path='/FinancialLanding' element={<FinanceBlogLandingPage />} />
          <Route path='/Blanding' element={<BudgetLanding />} />
          <Route path='/customer' element={<FeedbackReview />} />
          <Route path='/mainpage' element={<Mainpage />} />
          <Route path='/developer' element={<ProfileCard />} />
          <Route path='/BlogLanding' element={<BlogLanding/>}/>
          <Route path='/ForumLanding' element={<ForumLanding/>}/>
          <Route path='/NewsLanding' element={<NewsPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
