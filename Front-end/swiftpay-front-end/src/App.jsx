import React from 'react';
import CustomNavbar from './Components/Navbar';
import AuthForm from './Components/Signin-Signup';
import Layout from './Components/Layout';
import { BrowserRouter,Routes,Route} from 'react-router-dom';
import Main from './Components/Main';
import '@fortawesome/fontawesome-free/css/all.css';
import Error404 from './Components/Error.jsx';
import Aboutus from './Components/Aboutus.jsx';
import Service from './Components/Service.jsx';
import ContactUs from './Components/Contactus.jsx';



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
      <Route path='*' element={<Error404/>} />
    </Routes>
    </BrowserRouter>
 
    

  
    
  );
}

export default App;
