import React, { useState, useEffect } from 'react';
import TradingViewWidget from './TradingView';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ExchangeRateCalculator = () => {
  const [currencyOne, setCurrencyOne] = useState('USD');
  const [amountOne, setAmountOne] = useState(1);
  const [currencyTwo, setCurrencyTwo] = useState('EUR');
  const [amountTwo, setAmountTwo] = useState(0);
  const [rate, setRate] = useState('');
  const navigate = useNavigate();

  const calculate = () => {
    fetch('https://open.exchangerate-api.com/v6/latest')
      .then((res) => res.json())
      .then((data) => {
        const rateValue = data.rates[currencyTwo] / data.rates[currencyOne];
        setRate(`1 ${currencyOne} = ${rateValue.toFixed(2)} ${currencyTwo}`);
        setAmountTwo((amountOne * rateValue).toFixed(2));
      })
      .catch((error) => {
        console.error('Error fetching exchange rate:', error);
      });
  };

  useEffect(() => {
    calculate();
  }, [currencyOne, amountOne, currencyTwo]);

  const handleSwap = () => {
    const temp = currencyOne;
    setCurrencyOne(currencyTwo);
    setCurrencyTwo(temp);
    calculate();
  };

  return (
    <>
      <TradingViewWidget />
      <div className="flex flex-col items-center justify-center h-screen p-5 md:10 relative">
        {/* Back Icon */}
        <div 
          className="absolute top-4 left-4"
          onClick={() => navigate('/mainpage')}
        >
          <FaArrowLeft 
            className="text-2xl cursor-pointer text-blue-500"
          />
        </div>

        <h1 className="text-xl text-blue-500 mb-5 md:text-3xl">Exchange Rate Calculator</h1>
        <p className="text-center mb-5">Choose the currency and the amounts to get the exchange rate</p>

        <div className="w-full max-w-sm bg-white p-6 md:10 rounded-lg shadow-md border-blue-500">
          <div className="currency mb-4">
            <select
              id="currency-one"
              value={currencyOne}
              onChange={(e) => setCurrencyOne(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              {/* Currency options */}
              <option value="AED">AED</option>
              <option value="ARS">ARS</option>
              <option value="AUD">AUD</option>
              <option value="BGN">BGN</option>
              <option value="BRL">BRL</option>
              <option value="BSD">BSD</option>
              <option value="CAD">CAD</option>
              <option value="CHF">CHF</option>
              <option value="CLP">CLP</option>
              <option value="CNY">CNY</option>
              <option value="COP">COP</option>
              <option value="CZK">CZK</option>
              <option value="DKK">DKK</option>
              <option value="DOP">DOP</option>
              <option value="EGP">EGP</option>
              <option value="EUR">EUR</option>
              <option value="FJD">FJD</option>
              <option value="GBP">GBP</option>
              <option value="GTQ">GTQ</option>
              <option value="HKD">HKD</option>
              <option value="HRK">HRK</option>
              <option value="HUF">HUF</option>
              <option value="IDR">IDR</option>
              <option value="ILS">ILS</option>
              <option value="INR">INR</option>
              <option value="ISK">ISK</option>
              <option value="JPY">JPY</option>
              <option value="KRW">KRW</option>
              <option value="KZT">KZT</option>
              <option value="MXN">MXN</option>
              <option value="MYR">MYR</option>
              <option value="NOK">NOK</option>
              <option value="NZD">NZD</option>
              <option value="PAB">PAB</option>
              <option value="PEN">PEN</option>
              <option value="PHP">PHP</option>
              <option value="PKR">PKR</option>
              <option value="PLN">PLN</option>
              <option value="PYG">PYG</option>
              <option value="RON">RON</option>
              <option value="RUB">RUB</option>
              <option value="SAR">SAR</option>
              <option value="SEK">SEK</option>
              <option value="SGD">SGD</option>
              <option value="THB">THB</option>
              <option value="TRY">TRY</option>
              <option value="TWD">TWD</option>
              <option value="UAH">UAH</option>
              <option value="USD">USD</option>
              <option value="UYU">UYU</option>
              <option value="VND">VND</option>
              <option value="ZAR">ZAR</option>
            </select>
            <input
              type="number"
              id="amount-one"
              placeholder="0"
              value={amountOne}
              onChange={(e) => setAmountOne(e.target.value)}
              className="mt-2 w-full px-3 py-2 border rounded-md text-right"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              className="btn text-white bg-blue-500 rounded-md text-sm px-4 py-2"
              onClick={handleSwap}
            >
              Swap
            </button>
            <div className="text-blue-500 ml-10 md:ml-6">{rate}</div>
          </div>

          <div className="currency">
            <select
              id="currency-two"
              value={currencyTwo}
              onChange={(e) => setCurrencyTwo(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              {/* Currency options */}
              <option value="AED">AED</option>
              <option value="ARS">ARS</option>
              <option value="AUD">AUD</option>
              <option value="BGN">BGN</option>
              <option value="BRL">BRL</option>
              <option value="BSD">BSD</option>
              <option value="CAD">CAD</option>
              <option value="CHF">CHF</option>
              <option value="CLP">CLP</option>
              <option value="CNY">CNY</option>
              <option value="COP">COP</option>
              <option value="CZK">CZK</option>
              <option value="DKK">DKK</option>
              <option value="DOP">DOP</option>
              <option value="EGP">EGP</option>
              <option value="EUR">EUR</option>
              <option value="FJD">FJD</option>
              <option value="GBP">GBP</option>
              <option value="GTQ">GTQ</option>
              <option value="HKD">HKD</option>
              <option value="HRK">HRK</option>
              <option value="HUF">HUF</option>
              <option value="IDR">IDR</option>
              <option value="ILS">ILS</option>
              <option value="INR">INR</option>
              <option value="ISK">ISK</option>
              <option value="JPY">JPY</option>
              <option value="KRW">KRW</option>
              <option value="KZT">KZT</option>
              <option value="MXN">MXN</option>
              <option value="MYR">MYR</option>
              <option value="NOK">NOK</option>
              <option value="NZD">NZD</option>
              <option value="PAB">PAB</option>
              <option value="PEN">PEN</option>
              <option value="PHP">PHP</option>
              <option value="PKR">PKR</option>
              <option value="PLN">PLN</option>
              <option value="PYG">PYG</option>
              <option value="RON">RON</option>
              <option value="RUB">RUB</option>
              <option value="SAR">SAR</option>
              <option value="SEK">SEK</option>
              <option value="SGD">SGD</option>
              <option value="THB">THB</option>
              <option value="TRY">TRY</option>
              <option value="TWD">TWD</option>
              <option value="UAH">UAH</option>
              <option value="USD">USD</option>
              <option value="UYU">UYU</option>
              <option value="VND">VND</option>
              <option value="ZAR">ZAR</option>
            </select>
            <input
              type="number"
              id="amount-two"
              placeholder="0"
              value={amountTwo}
              onChange={(e) => setAmountTwo(e.target.value)}
              className="mt-2 w-full px-3 py-2 border rounded-md text-right"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExchangeRateCalculator;
