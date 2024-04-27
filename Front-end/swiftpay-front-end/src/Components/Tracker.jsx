import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const CoinGeckoTable = () => {
    const [coins, setCoins] = useState([]);
    const [currency, setCurrency] = useState('inr'); // Initial currency set to INR
    const [country, setCountry] = useState('India'); // Initial country set to India

    const apiKey = 'CG-Mzh8LVzuauvkW2BX8YpYr5Hp';

    const fetchTrendingData = async () => {
        try {
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&api_key=${apiKey}`
            );
            const data = response.data;
            setCoins(data);
        } catch (error) {
            console.error('Error fetching trending data:', error);
        }
    };

    useEffect(() => {
        fetchTrendingData();
    }, [currency]);

    const countryCurrencyMap = {
        India: 'inr',
        USA: 'usd',
        UK: 'gbp',
        Japan: 'jpy',
        Russia: 'rub',
        Australia: 'aud',
        Canada: 'cad',
        Brazil: 'brl',
        China: 'cny',
        Eurozone: 'eur',
        SouthKorea: 'krw',
        Mexico: 'mxn',
        Switzerland: 'chf',
        Sweden: 'sek',
        Norway: 'nok',
        Denmark: 'dkk',
        SouthAfrica: 'zar',
        Turkey: 'try',
        Indonesia: 'idr',
        Malaysia: 'myr',
        Singapore: 'sgd',
        Thailand: 'thb',
        Philippines: 'php',
        Vietnam: 'vnd',
        Pakistan: 'pkr',
        Bangladesh: 'bdt',
        Egypt: 'egp',
        Nigeria: 'ngn',
        Kenya: 'kes',
        Argentina: 'ars',
        Chile: 'clp',
        Colombia: 'cop',
        Peru: 'pen',
        Venezuela: 'ves',
        Israel: 'ils',
        SaudiArabia: 'sar',
        UAE: 'aed',
        Qatar: 'qar',
        Bahrain: 'bhd',
        Kuwait: 'kwd',
        Jordan: 'jod',
        Lebanon: 'lbp',
        NewZealand: 'nzd',
    };

    const handleCountryChange = (event) => {
        const selectedCountry = event.target.value;
        setCountry(selectedCountry);

        // Set the currency based on the selected country
        setCurrency(countryCurrencyMap[selectedCountry] || 'usd'); // Use USD as the default currency if country is not found
    };

    return (
        <div className="mx-auto mt-8 flex justify-center">
            <div className="w-3/4">
                <h2 className="text-2xl font-bold mb-4 text-center">Coin Market Data</h2>

                {/* Dropdown to select country */}
                <div className="mb-4 text-center">
                    <label htmlFor="country" className="mr-2">
                        Select Country:
                    </label>
                    <select
                        id="country"
                        value={country}
                        onChange={handleCountryChange}
                        className="py-2 px-4 border border-gray-300 rounded"
                    >
                        {Object.keys(countryCurrencyMap).map((countryName) => (
                            <option key={countryName} value={countryName}>
                                {countryName}
                            </option>
                        ))}
                    </select>
                </div>

                <table className="w-full border border-gray-300 shadow-lg text-center rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 border-b border-gray-300">
                        <tr>
                            <th className="py-2 px-4 border-r border-gray-300">Coin</th>
                            <th className="py-2 px-4 border-r border-gray-300">Symbol</th>
                            <th className="py-2 px-4 border-r border-gray-300">
                                Price ({currency.toUpperCase()})
                            </th>
                            <th className="py-2 px-4 border-r border-gray-300">
                                Market Cap ({currency.toUpperCase()})
                            </th>
                            <th className="py-2 px-4 border-r border-gray-300">24h Change (%)</th>
                            <th className="py-2 px-4">Logo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coins.map((coin, index) => (
                            <motion.tr
                                key={coin.id}
                                className="border-b border-gray-300"
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{
                                    scale: 1.05,
                                    backgroundColor:
                                        coin.price_change_percentage_24h >= 0
                                            ? 'rgba(34, 197, 94, 0.2)'
                                            : 'rgba(220, 38, 38, 0.2)',
                                }}
                            >
                                <td className="py-2 px-4 border-r border-gray-300">{coin.name}</td>
                                <td className="py-2 px-4 border-r border-gray-300">
                                    {coin.symbol.toUpperCase()}
                                </td>
                                <td className="py-2 px-4 border-r border-gray-300">
                                    {coin.current_price.toFixed(2)}
                                </td>
                                <td className="py-2 px-4 border-r border-gray-300">
                                    {coin.market_cap.toLocaleString()}
                                </td>
                                <td className="py-2 px-4 border-r border-gray-300">
                                    {coin.price_change_percentage_24h >= 0 ? (
                                        <span className="text-green-500">{`▲ ${coin.price_change_percentage_24h.toFixed(2)}%`}</span>
                                    ) : (
                                        <span className="text-red-500">{`▼ ${coin.price_change_percentage_24h.toFixed(2)}%`}</span>
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    <img
                                        src={coin.image}
                                        alt={coin.name}
                                        className="w-8 h-8 mx-auto rounded-full"
                                    />
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                <p className="text-center mt-4 text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Financial Hub. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default CoinGeckoTable;
