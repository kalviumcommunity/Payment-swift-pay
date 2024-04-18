import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons';
import { db } from '../../Firebase/Fire.config'; // Import Firestore instance
import FinancialTimes from './news';
import { doc, getDoc, setDoc } from "firebase/firestore";

const Business = () => {
  const [newsData, setNewsData] = useState([]);
  const [likeCounts, setLikeCounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = "e2113c07b522785295a02b77ff53bdb5";
        const apiUrl = `https://gnews.io/api/v4/search?q=Business&lang=en&sortby=publishedAt&apikey=${apiKey}`;
        const response = await axios.get(apiUrl);
        console.log("Fetched data:", response.data);
        setNewsData(response.data.articles);
        // Fetch like counts from Firestore for each article
        const likeCountsArray = await Promise.all(response.data.articles.map(async (article, index) => {
          const articleRef = doc(db, 'likes', index.toString());
          const docSnap = await getDoc(articleRef);
          if (docSnap.exists()) {
            return docSnap.data().count || 0;
          } else {
            return 0; // Initialize to zero if document doesn't exist
          }
        }));
        setLikeCounts(likeCountsArray);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLike = async (index) => {
    try {
      const articleRef = doc(db, 'likes', index.toString());
      const docSnap = await getDoc(articleRef);
      
      if (!docSnap.exists()) {
        // If the document doesn't exist, create it with an initial count of zero
        await setDoc(articleRef, { count: 0 });
      }
  
      // Increment the like count and update the document
      await setDoc(articleRef, { count: (docSnap.data().count || 0) + 1 }, { merge: true });

      // Update the local state with the new like count
      setLikeCounts(prevState => {
        const newState = [...prevState];
        newState[index] += 1;
        return newState;
      });
    } catch (error) {
      console.error('Error updating like count:', error);
    }
  };

  const goToArticle = (url) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <FinancialTimes />
      <div className="mx-auto px-4 py-8 max-w-screen-xl hover:scale-100">
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
                      <FontAwesomeIcon icon={faThumbsUp} className="text-blue-500 cursor-pointer" onClick={() => handleLike(index)} />
                      <span>{likeCounts[index]}</span>
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

export default Business;
