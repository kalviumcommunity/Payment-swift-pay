import React from 'react';
import CustomNavbar from './Components/Navbar';
import AuthForm from './Components/Signin-Signup';
import Layout from './Components/Layout';
import { BrowserRouter,Routes,Route, Router} from 'react-router-dom';
import Main from './Components/Main';
import '@fortawesome/fontawesome-free/css/all.css';
import Error404 from './Components/Error.jsx';
import Aboutus from './Components/Aboutus.jsx';
import Service from './Components/Service.jsx';
import ContactUs from './Components/Contactus.jsx';
import TermsAndConditions from './Components/Terms.jsx';
import PrivacyPolicy from './Components/Privacy.jsx';
import ForgotPassword from './Components/ForgotPassword.jsx';
import Feedback from './Components/feedback.jsx';
import Chatbot from './Components/Chatbot.jsx';
import NewsComponent from './Components/news.jsx';
import FinancialTimes from './Components/news.jsx';
import Crypto from './Components/Crypto.jsx';
import Business from './Components/Bussiness.jsx';
import Finance from './Components/Finance.jsx';
import Stock from './Components/Stock.jsx';
import Blog from './Components/Blog.jsx';
import ExchangeRateCalculator from './Components/Convert.jsx';
import CoinGeckoTable from './Components/Tracker.jsx';
import CryptoAnalysis from './Components/BudgetApp.jsx';
import CoinDetails from './Components/BudgetApp.jsx';
import Compare from './Components/BudgetApp.jsx';
import BudgetApp from './Components/BudgetApp.jsx';
import SmartsuppChat from './Components/Whatsapp.jsx';
import TradingViewWidget from './Components/Stockmarket.jsx';
import TradingViewMiniSymbolOverview from './Components/Stockmarket.jsx';
import Edlanding from './Components/Edlanding.jsx';
import LearningLandingPage from './Components/Edlanding.jsx';
import BlogApp from './Components/Blog.jsx';






function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<CustomNavbar></CustomNavbar>}/>
      <Route path='/signIn-signUp' element={<Layout> <AuthForm/></Layout>}/>
      <Route path='/Main' element={<Main/>}/>
      <Route path='/About' element={<Aboutus/>}></Route>
      <Route path='/Service' element={<Service/>}/>
      <Route path='/contact' element={<ContactUs/>}/>
      <Route path='/conditions' element={<TermsAndConditions/>}/>
      <Route path='/privacy' element={<PrivacyPolicy/>}></Route>
      <Route path='/Forgot' element={<Layout><ForgotPassword/></Layout>}></Route>
      <Route path='/Feedback' element={<Layout><Feedback/></Layout>}/>
      <Route path='*' element={<Error404/>} />
      <Route path='/crypto' element={<Layout><Crypto></Crypto></Layout>} />
      <Route path='/Business' element={<Layout><Business/></Layout>}/>
      <Route path='/Finance' element={<Layout><Finance/></Layout>}/>
      <Route path='/Stock' element={<Layout><Stock/></Layout>}/>
      <Route path='/Exchange' element={<ExchangeRateCalculator/>}/>
      <Route path='/Coin' element={<CoinGeckoTable/>}/>
      <Route path='/Learning' element={<LearningLandingPage/>}/>
      <Route path='/Blog' element={<BlogApp/>}/>
  
    
    </Routes>
    </BrowserRouter>
   

   
    
  );
 
}

export default App;
