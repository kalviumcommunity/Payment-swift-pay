import React, { useState, useEffect } from 'react';
import axios from "axios";

const CoinGeckoTable = ({ currency = 'inr' }) => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const options = {
        method: 'GET',
        headers: {accept: 'application/json', 'x-cg-pro-api-key': 'CG-Mzh8LVzuauvkW2BX8YpYr5Hp'}
      };
      
    const fetchTrendingData = async () => {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&api_key=x-cg-pro-api-key`)
        const data = await response.data;
        console.log(data)
        setCoins(data);
      } catch (error) {
        console.error('Error fetching trending data:', error);
      }
    };
    fetchTrendingData();
  }, []);

  return (
    <div className="mx-auto mt-8 flex justify-center">
      <div className="w-3/4"> {/* Adjust width as needed */}
        <h2 className="text-2xl font-bold mb-4 text-center">Coin Market Data</h2>
        <table className="w-full border border-gray-300 shadow-lg text-center rounded-lg overflow-hidden">
          <thead className="bg-gray-200 border-b border-gray-300">
            <tr>
              <th className="py-2 px-4 border-r border-gray-300">Coin</th>
              <th className="py-2 px-4 border-r  border-gray-300">Symbol</th>
              <th className="py-2 px-4 border-r border-gray-300 ">Price ({currency.toUpperCase()})</th>
              <th className="py-2 px-4 border-r border-gray-300">Market Cap ({currency.toUpperCase()})</th>
              <th className="py-2 px-4 border-r border-gray-300">24h Change (%)</th>
              <th className="py-2 px-4">Logo</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr key={coin.id} className="border-b border-gray-300">
                <td className="py-2 px-4 border-r border-gray-300 hover:scale-75">{coin.name}</td>
                <td className="py-2 px-4 border-r border-gray-300">{coin.symbol.toUpperCase()}</td>
                <td className="py-2 px-4 border-r border-gray-300">{coin.current_price.toFixed(2)}</td>
                <td className="py-2 px-4 border-r border-gray-300">{coin.market_cap.toLocaleString()}</td>
                <td className="py-2 px-4 border-r border-gray-300">{coin.price_change_percentage_24h.toFixed(2)}</td>
                <td className="py-2 px-4">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6 mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoinGeckoTable;
