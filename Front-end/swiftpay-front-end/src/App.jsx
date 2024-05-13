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
import NewsComponent from './Components/news.jsx';
import FinancialTimes from './Components/news.jsx';
import Crypto from './Components/Crypto.jsx';
import Business from './Components/Bussiness.jsx';
import Finance from './Components/Finance.jsx';
import Stock from './Components/Stock.jsx';
import ExchangeRateCalculator from './Components/Convert.jsx';
import CoinGeckoTable from './Components/Tracker.jsx';
import BudgetApp from './Components/BudgetApp.jsx';
import Edlanding from './Components/Edlanding.jsx';
import LearningLandingPage from './Components/Edlanding.jsx';
import BlogApp from './Components/Blog.jsx';
import LandingPage from './Components/CryptoLanding.jsx';
import TOdo from './Components/Todo.jsx';
import NewsPage from './Components/NewsLanding.jsx';
import Chat from './Components/Gemini.jsx';
import FinanceBlogLandingPage from './Components/Financiallanding.jsx';
import BudgetLanding from './Components/BudgetLanding.jsx';
import SendWelcomeEmail from './Components/welcomeMessage.jsx'; 

import { useState } from 'react';
import WatchlistPage from './Components/Watchlist.jsx';
import Loading from './Components/Loading.jsx';


function App() {

  const [coins, setCoins] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

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
      <Route path='/Coin' element={<CoinGeckoTable coins={coins}setCoins={setCoins}watchlist={watchlist}setWatchlist={setWatchlist}/>}  />
      <Route path='/Learning' element={<LearningLandingPage/>}/>
      <Route path='/Blog' element={<Layout><BlogApp/></Layout>}/>
      <Route path='/To' element={<TOdo/>}/>
      <Route path='/News' element={<NewsPage/>}/>
      <Route path='/Landing' element={<LandingPage/>}/>
      <Route path='/Budget' element={<BudgetApp/>}/>
      <Route path='/FinancialLanding' element={<FinanceBlogLandingPage/>}/>
      <Route path='/Blanding' element={<BudgetLanding/>}/>
      <Route path='/welcome' element={<SendWelcomeEmail/>}/>
      <Route path='/WatchList' element={<WatchlistPage coins={coins} watchlist={watchlist} removeFromWatchlist={(coinId) =>setWatchlist((prevWatchlist) => prevWatchlist.filter((id) => id !== coinId))}/>} />
      <Route path='/gemini' element={<Chat/>}/>
    </Routes>
    </BrowserRouter>
  );
 
}

export default App;
