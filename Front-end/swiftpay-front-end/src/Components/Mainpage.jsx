import React, { useState, useEffect } from 'react';
import { auth } from '../../Firebase/Fire.config';
import { useSpring, animated } from 'react-spring';
import { FaComments, FaBlog, FaCalculator, FaChartLine, FaNewspaper, FaRobot, FaTwitter, FaFacebookF, FaInstagram, FaTasks, FaMoneyBillWave, FaBitcoin } from 'react-icons/fa';
import Main from './Main';
import { Link } from 'react-router-dom';

const translations = [
  { welcome: "स्वागत", financialHub: "वित्तीय केंद्र" }, // Hindi
  { welcome: "வரவேற்க", financialHub: "நிதி மையம்" }, // Tamil
  { welcome: "স্বাগতম", financialHub: "আর্থিক কেন্দ্র" }, // Bengali
  { welcome: "Bienvenido", financialHub: "Centro financiero" }, // Spanish
  { welcome: "Bienvenue", financialHub: "Centre financier" }, // French
  { welcome: "Willkommen", financialHub: "Finanzzentrum" }, // German
  { welcome: "欢迎", financialHub: "金融中心" }, // Chinese (Mandarin)
  { welcome: "Benvenuto", financialHub: "Centro finanziario" }, // Italian
  { welcome: "ようこそ", financialHub: "金融センター" }, // Japanese
  { welcome: "환영합니다", financialHub: "금융 허브" }, // Korean
  { welcome: "Bem-vindo", financialHub: "Centro financeiro" }, // Portuguese
  { welcome: "مرحبا", financialHub: "مركز مالي" }, // Arabic
  { welcome: "добро пожаловать", financialHub: "финансовый центр" }, // Russian
  { welcome: "Καλώς ορίσατε", financialHub: "Οικονομικό κέντρο" }, // Greek
  { welcome: "Welkom", financialHub: "Financieel centrum" }, // Dutch
  { welcome: "Välkommen", financialHub: "Finanscentrum" }, // Swedish
  { welcome: "Velkommen", financialHub: "Finansielt sentrum" }, // Norwegian
  { welcome: "Tervetuloa", financialHub: "Rahoituskeskus" }, // Finnish
  { welcome: "Bienvenido", financialHub: "Centro financiero" }, // Latin American Spanish
  { welcome: "Добродошли", financialHub: "Финансијски центар" }, // Serbian
  { welcome: "Добре дошли", financialHub: "Финансов център" }, // Bulgarian
  { welcome: "Karibu", financialHub: "Kituo cha fedha" }, // Swahili
  { welcome: "ברוך הבא", financialHub: "מרכז פיננסי" }, // Hebrew
  { welcome: "வாங்க", financialHub: "நிதி மையம்" }, // Sinhala
  { welcome: "स्वागतम", financialHub: "आर्थिक केन्द्र" }, // Nepali
  { welcome: "ברוך הבא", financialHub: "מרכז פיננסי" }, // Hebrew
  { welcome: "환영합니다", financialHub: "금융 허브" }, // Korean
  { welcome: "स्वागतम्", financialHub: "वित्त केन्द्र" }, // Sanskrit
  { welcome: "Bienvenidos", financialHub: "Centro financiero" }, // Catalan
  { welcome: "Welkom", financialHub: "Finansiele sentrum" }, // Afrikaans
  { welcome: "Wilujeng sumping", financialHub: "Puseur keuangan" }, // Sundanese
  { welcome: "សូមស្វាគមន៍", financialHub: "មជ្ឈមណ្ឌលហិរញ្ញវត្ថុ" }, // Khmer
  { welcome: "歡迎", financialHub: "金融中心" }, // Cantonese
  { welcome: "स्वागतम्", financialHub: "वित्तीय केंद्र" }, // Marathi
  { welcome: "欢迎", financialHub: "金融中心" }, // Simplified Chinese
  { welcome: "Velkommen", financialHub: "Finansielt sentrum" }, // Danish
  { welcome: "Kia Ora", financialHub: "Pokapū pūtea" }, // Maori
  { welcome: "Failte", financialHub: "Ionad airgeadais" }, // Irish Gaelic
  { welcome: "Croeso", financialHub: "Canolfan ariannol" }, // Welsh
  { welcome: "ยินดีต้อนรับ", financialHub: "ศูนย์กลางการเงิน" }, // Thai
  { welcome: "Mabuhay", financialHub: "Sentro ng pananalapi" }, // Filipino
  { welcome: "Üdvözöljük", financialHub: "Pénzügyi központ" }, // Hungarian
  { welcome: "Sveiki", financialHub: "Finanšu centrs" }, // Latvian
  { welcome: "Sveiki atvykę", financialHub: "Finansų centras" }, // Lithuanian
  { welcome: "Добро пожаловать", financialHub: "Финансовый центр" }, // Belarusian
  { welcome: "환영합니다", financialHub: "금융 허브" }, // Korean
  { welcome: "Добро пожаловать", financialHub: "Финансовый центр" }, // Chinese (Mandarin)
];

const MultilingualWelcome = ({ userName }) => {
  const [index, setIndex] = useState(0);
  const [welcomeText, setWelcomeText] = useState(translations[0].welcome);
  const [financialHubText, setFinancialHubText] = useState(translations[0].financialHub);

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    reset: true,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % translations.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setWelcomeText(translations[index].welcome);
    setFinancialHubText(translations[index].financialHub);
  }, [index]);

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold mb-3 md:mb-5 leading-tight text-blue-500 text-center">
        <animated.span style={props}>{welcomeText}</animated.span>
      </h1>
      <p className="text-sm md:text-lg text-center mb-5">
        {userName ? (
          <>
            Aboard, <strong>{userName}</strong>! Step into a world of financial possibilities with 
            <span> </span>
            <animated.span className="text-blue-500" style={props}>
              {financialHubText}
            </animated.span>!
          </>
        ) : (
          <>Step into a world of financial possibilities with <animated.span style={props}>{financialHubText}</animated.span>! Welcome aboard!</>
        )}
      </p>
    </>
  );
};

const Mainpage = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserName(user.displayName || ''); // Default to an empty string if displayName is null
      } else {
        console.log('No user is currently signed in.');
      }
    };

    fetchUserName();
  }, []);

  return (
    <>
      <Main />
      <div className="grid grid-cols-1 gap-y-10 py-10 bg-gray-100">
        {/* Welcome Section */}
        <div className="flex flex-col items-center px-6">
          <MultilingualWelcome userName={userName} />
          <div className="flex mt-6">
          </div>
        </div>

        {/* Features Section */}
        <section className="bg-white py-16 w-full">
          <div className="mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-blue-500 mb-8">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <Link to='/BlogLanding'><div className="flex flex-col items-center">
                <FaBlog className="text-blue-500 text-6xl mb-4" />
                <h3 className="text-xl font-semibold mb-2">Financial Blog</h3>
              </div></Link> 
             <Link to='Blanding'><div className="flex flex-col items-center">
                <FaCalculator className="text-blue-500 text-6xl mb-4" />
                <h3 className="text-xl font-semibold mb-2">Expense Calculator</h3>
              </div></Link> 
              <Link to='ForumLanding'><div className="flex flex-col items-center">
                <FaComments className="text-blue-500 text-6xl mb-4" />
                <h3 className="text-xl font-semibold mb-2">Financial Forum</h3>
              </div></Link>
             <Link to='/Exchange'><div className="flex flex-col items-center">
                <FaMoneyBillWave className="text-blue-500 text-6xl mb-4" />
                <h3 className="text-xl font-semibold mb-2">Currency Converter</h3>
              </div></Link> 
              <Link to=''><div className="flex flex-col items-center">
                <FaTasks className="text-blue-500 text-6xl mb-4" />
                <h3 className="text-xl font-semibold mb-2">To-Do List</h3>
              </div></Link>
             <Link to='/NewsLanding'> <div className="flex flex-col items-center">
                <FaNewspaper className="text-blue-500 text-6xl mb-4" />
                <h3 className="text-xl font-semibold mb-2">News</h3>
              </div></Link>
              <a href='https://668963cdabe78a804ab44cef--chic-hotteok-93e044.netlify.app/' target='_blank'><div className="flex flex-col items-center">
                <FaRobot className="text-blue-500 text-6xl mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI Services</h3>
              </div></a>
              <a href='https://crypto-beryl-ten.vercel.app/' traget='_blank'><div className="flex flex-col items-center">
                <FaBitcoin className="text-blue-500 text-6xl mb-4" />
                <h3 className="text-xl font-semibold mb-2">Crypto Tracker</h3>
              </div></a>
            </div>
          </div>
        </section>

        {/* Follow Us Section */}
        <section className="bg-blue-500 py-8 w-full">
          <div className="mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Follow Us</h2>
            <div className="flex justify-center space-x-6">
              <a href="https://twitter.com" className="text-white text-4xl">
                <FaTwitter />
              </a>
              <a href="https://facebook.com" className="text-white text-4xl">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" className="text-white text-4xl">
                <FaInstagram />
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Mainpage;
