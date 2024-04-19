import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons';
import { db } from '../../Firebase/Fire.config';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import FinancialTimes from './news';


const Crypto = () => {
  const [newsData, setNewsData] = useState([]);
  const [likeCounts, setLikeCounts] = useState([]);
  const [comments, setComments] = useState({});
  const [inputText, setInputText] = useState({}); // State for comment input text for each article
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [commentsVisible, setCommentsVisible] = useState({}); // State to control the visibility of comments for each article
  const [commentReactions, setCommentReactions] = useState({}); // State for comment reactions

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = 'b2046fe9ee87859fe88282fc4c26b521'; // Update with your API key
        const apiUrl = `https://gnews.io/api/v4/search?q=crypto&lang=en&sortby=&apikey=${apiKey}`;
        const response = await axios.get(apiUrl);
        setNewsData(response.data.articles);

        // Fetch like counts from Firestore for each article
        const likeCountsArray = await Promise.all(
          response.data.articles.map(async (article, index) => {
            const articleRef = doc(db, 'cryptoLikes', index.toString());
            const docSnap = await getDoc(articleRef);
            return docSnap.exists() ? docSnap.data().count || 0 : 0;
          })
        );
        setLikeCounts(likeCountsArray);

        // Subscribe to comments for each article
        response.data.articles.forEach((article, index) => {
          const articleCommentsRef = collection(db, 'cryptoComments', index.toString(), 'comments');
          const q = query(articleCommentsRef);
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = {};
            snapshot.forEach((doc) => {
              commentsData[doc.id] = doc.data();
            });
            setComments((prevComments) => ({
              ...prevComments,
              [index]: commentsData,
            }));

            // Fetch like and dislike counts for each comment
            snapshot.forEach((doc) => {
              const commentData = doc.data();
              setCommentReactions((prevReactions) => {
                const newReactions = { ...prevReactions };
                newReactions[`${index}-${doc.id}`] = {
                  likeCount: commentData.likeCount || 0,
                  dislikeCount: commentData.dislikeCount || 0,
                };
                return newReactions;
              });
            });
          });
          return unsubscribe;
        });
      } catch (error) {
        console.error('Error fetching crypto news data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle liking an article
  const handleLike = async (index) => {
    try {
      const articleRef = doc(db, 'cryptoLikes', index.toString());
      const docSnap = await getDoc(articleRef);
      const newCount = (docSnap.exists() ? docSnap.data().count || 0 : 0) + 1;
      await setDoc(articleRef, { count: newCount }, { merge: true });

      setLikeCounts((prevCounts) => {
        const newCounts = [...prevCounts];
        newCounts[index] = newCount;
        return newCounts;
      });
    } catch (error) {
      console.error('Error updating like count:', error);
    }
  };

  // Handle disliking an article
  const handleDislike = async (index) => {
    try {
      // Implement handling dislikes as needed
    } catch (error) {
      console.error('Error updating dislike count:', error);
    }
  };

  // Handle posting a comment
  const handleCommentSubmit = async (index) => {
    try {
      const articleCommentsRef = collection(db, 'cryptoComments', index.toString(), 'comments');

      // Create the comment data object with the current date and time
      const commentData = {
        text: inputText[index],
        timestamp: new Date().toISOString(), // Include the current date and time as an ISO string
        likeCount: 0,
        dislikeCount: 0,
      };

      // Add the comment data to Firestore
      await addDoc(articleCommentsRef, commentData);

      // Reset the new comment input for this article
      setInputText((prevInputText) => ({
        ...prevInputText,
        [index]: '',
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Handle editing a comment
  const handleCommentEdit = (index, commentId, text) => {
    setEditCommentId(commentId);
    setEditCommentText(text);
  };

  // Handle updating a comment
  const handleCommentUpdate = async (index, commentId) => {
    try {
      const commentRef = doc(db, 'cryptoComments', index.toString(), 'comments', commentId);
      await updateDoc(commentRef, { text: editCommentText });
      // Reset the edit state
      setEditCommentId(null);
      setEditCommentText('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  // Handle deleting a comment
  const handleCommentDelete = async (index, commentId) => {
    try {
      const commentRef = doc(db, 'cryptoComments', index.toString(), 'comments', commentId);
      await deleteDoc(commentRef);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Handle liking a comment
  const handleCommentLike = async (index, commentId) => {
    try {
      const commentRef = doc(db, 'cryptoComments', index.toString(), 'comments', commentId);
      const commentSnap = await getDoc(commentRef);
      const newLikeCount = (commentSnap.exists() ? commentSnap.data().likeCount || 0 : 0) + 1;

      await updateDoc(commentRef, { likeCount: newLikeCount });

      setCommentReactions((prevReactions) => {
        const newReactions = { ...prevReactions };
        newReactions[`${index}-${commentId}`] = {
          likeCount: newLikeCount,
          dislikeCount: prevReactions[`${index}-${commentId}`]?.dislikeCount || 0,
        };
        return newReactions;
      });
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  // Handle disliking a comment
  const handleCommentDislike = async (index, commentId) => {
    try {
      const commentRef = doc(db, 'cryptoComments', index.toString(), 'comments', commentId);
      const commentSnap = await getDoc(commentRef);
      const newDislikeCount = (commentSnap.exists() ? commentSnap.data().dislikeCount || 0 : 0) + 1;

      await updateDoc(commentRef, { dislikeCount: newDislikeCount });

      setCommentReactions((prevReactions) => {
        const newReactions = { ...prevReactions };
        newReactions[`${index}-${commentId}`] = {
          likeCount: prevReactions[`${index}-${commentId}`]?.likeCount || 0,
          dislikeCount: newDislikeCount,
        };
        return newReactions;
      });
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
  };

  // Handle changes in comment input text
  const handleInputTextChange = (index, value) => {
    setInputText((prevText) => ({
      ...prevText,
      [index]: value,
    }));
  };

  // Toggle the visibility of comments for an article
  const toggleCommentsVisibility = (index) => {
    setCommentsVisible((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <FinancialTimes/> {/* Import your crypto news component */}
      <div className="mx-auto px-4 py-8 max-w-screen-xl">
        <div>
          {newsData.map((article, index) => (
            <div key={index} className="w-full p-4 mb-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row items-center">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full md:w-1/2 h-auto md:h-full object-cover cursor-pointer"
                  onClick={() => window.open(article.url, '_blank')}
                />
                <div className="p-6 flex-1">
                  <h2
                    className="text-xl font-semibold text-gray-800 hover:underline cursor-pointer"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(index)}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                      >
                        <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                        {likeCounts[index] || 0}
                      </button>
                      <button
                        onClick={() => handleDislike(index)}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                      >
                        <FontAwesomeIcon icon={faThumbsDown} className="mr-1" />
                      </button>
                      <button
                        onClick={() => toggleCommentsVisibility(index)}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                      >
                        <FontAwesomeIcon icon={faComment} className="mr-1" />
                        {comments[index] ? Object.keys(comments[index]).length : 0}
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm">{article.publishedAt}</p>
                  </div>
                  {commentsVisible[index] && (
                    <div className="mt-4">
                      {comments[index] &&
                        Object.entries(comments[index]).map(([commentId, commentData]) => (
                          <div key={commentId} className="border-b border-gray-300 py-2">
                            {editCommentId === commentId ? (
                              <div className="flex space-x-2">
                                <textarea
                                  value={editCommentText}
                                  onChange={(e) => setEditCommentText(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                                <button
                                  onClick={() => handleCommentUpdate(index, commentId)}
                                  className="ml-2"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditCommentId(null)}
                                  className="ml-2"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center">
                                <div>
                                  <p>{commentData.text}</p>
                                  <p className="text-xs text-gray-400">
                                    {new Date(commentData.timestamp).toLocaleString()} {/* Display comment timestamp */}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleCommentLike(index, commentId)}
                                    className="flex items-center text-gray-600 hover:text-gray-800"
                                  >
                                    <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                                    {commentReactions[`${index}-${commentId}`]?.likeCount || 0}
                                  </button>
                                  <button
                                    onClick={() => handleCommentDislike(index, commentId)}
                                    className="flex items-center text-gray-600 hover:text-gray-800"
                                  >
                                    <FontAwesomeIcon icon={faThumbsDown} className="mr-1" />
                                    {commentReactions[`${index}-${commentId}`]?.dislikeCount || 0}
                                  </button>
                                  <button
                                    onClick={() => handleCommentEdit(index, commentId, commentData.text)}
                                    className="text-gray-600 hover:text-gray-800"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleCommentDelete(index, commentId)}
                                    className="text-gray-600 hover:text-gray-800"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      <textarea
                        value={inputText[index] || ''}
                        onChange={(e) => handleInputTextChange(index, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Add a comment..."
                      />
                      <button
                        onClick={() => handleCommentSubmit(index)}
                        className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
                      >
                        Post
                      </button>
                    </div>
                  )}
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
