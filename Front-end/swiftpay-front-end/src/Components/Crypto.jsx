import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons';
import FinancialTimes from './news';

const Crypto = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = "e2113c07b522785295a02b77ff53bdb5";
        const apiUrl = `https://gnews.io/api/v4/search?q=Crypto&lang=en&sortby=publishedAt&apikey=${apiKey}`;
        const response = await axios.get(apiUrl);
        console.log("Fetched data:", response.data);
        setNewsData(response.data.articles);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    fetchData();
  }, []);

  const goToArticle = (url) => {
    window.open(url, '_blank');
  };

  return (
    <>
    <FinancialTimes/>
    <div className="mx-auto px-4 py-8 max-w-screen-xl">
      <div>
        {newsData.map((article, index) => (
          <div key={index} className="w-full p-4 mb-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row items-center">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full md:w-1/2 h-auto md:h-full object-cover cursor-pointer"
                onClick={() => goToArticle(article.url)}
              />
              <div className="p-4 w-full md:w-1/2">
                <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                <p className="text-gray-700 mb-2">{article.description}</p>
                <p className="text-gray-600">Published at: {article.publishedAt}</p>
                <p className="text-gray-600">Source: {article.source.name}</p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-4">
                    <FontAwesomeIcon icon={faThumbsUp} className="text-blue-500 cursor-pointer" />
                    <FontAwesomeIcon icon={faThumbsDown} className="text-red-500 cursor-pointer" />
                    <FontAwesomeIcon icon={faComment} className="text-gray-500 cursor-pointer" />
                  </div>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Read more</a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};


export default Crypto;