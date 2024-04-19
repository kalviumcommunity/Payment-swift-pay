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

const Business = () => {
  const [newsData, setNewsData] = useState([]);
  const [likeCounts, setLikeCounts] = useState([]);
  const [comments, setComments] = useState({});
  const [inputText, setInputText] = useState({}); // State for comment input text for each article
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [commentsVisible, setCommentsVisible] = useState({}); // State to control the visibility of comments for each article
  const [commentCounts, setCommentCounts] = useState({});

  // State for comment reactions (like and dislike counts for each comment)
  const [commentReactions, setCommentReactions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = 'b2046fe9ee87859fe88282fc4c26b521';
        const apiUrl = `https://gnews.io/api/v4/search?q=Business&lang=en&sortby=publishedAt&apikey=${apiKey}`;
        const response = await axios.get(apiUrl);
        console.log('Fetched data:', response.data);
        setNewsData(response.data.articles);

        // Fetch like counts from Firestore for each article
        const likeCountsArray = await Promise.all(
          response.data.articles.map(async (article, index) => {
            const articleRef = doc(db, 'likes', index.toString());
            const docSnap = await getDoc(articleRef);
            return docSnap.exists() ? docSnap.data().count || 0 : 0;
          })
        );
        setLikeCounts(likeCountsArray);

        // Subscribe to comments for each article
        response.data.articles.forEach((article, index) => {
          const articleCommentsRef = collection(db, 'comments', index.toString(), 'comments');
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
           

            // Fetching like and dislike counts for each comment
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
        console.error('Error fetching news data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLike = async (index) => {
    try {
      const articleRef = doc(db, 'likes', index.toString());
      const docSnap = await getDoc(articleRef);
      const newCount = (docSnap.exists() ? docSnap.data().count : 0) + 1;
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

  const handleDislike = async (index) => {
    // Implement handling dislikes as needed.
  };

  const handleCommentSubmit = async (index) => {
    try {
      const articleCommentsRef = collection(db, 'comments', index.toString(), 'comments');
      await addDoc(articleCommentsRef, {
        text: inputText[index],
        timestamp: new Date(),
        likeCount: 0,
        dislikeCount: 0
      });

      // Reset the new comment input for this article
      setInputText((prevInputText) => ({
        ...prevInputText,
        [index]: '',
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCommentEdit = (index, commentId, text) => {
    setEditCommentId(commentId);
    setEditCommentText(text);
  };

  const handleCommentUpdate = async (index, commentId) => {
    try {
      const commentRef = doc(db, 'comments', index.toString(), 'comments', commentId);
      await updateDoc(commentRef, { text: editCommentText });
      // Reset the edit state
      setEditCommentId(null);
      setEditCommentText('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleCommentDelete = async (index, commentId) => {
    try {
      const commentRef = doc(db, 'comments', index.toString(), 'comments', commentId);
      await deleteDoc(commentRef);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const goToArticle = (url) => {
    window.open(url, '_blank');
  };

  // Handle liking a comment
  const handleCommentLike = async (index, commentId) => {
    try {
      const commentRef = doc(db, 'comments', index.toString(), 'comments', commentId);
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
      const commentRef = doc(db, 'comments', index.toString(), 'comments', commentId);
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

  const handleInputTextChange = (index, value) => {
    setInputText((prevText) => ({
      ...prevText,
      [index]: value,
    }));
  };

  const toggleCommentsVisibility = (index) => {
    setCommentsVisible((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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
                <div className="p-6 flex-1">
                  <h2
                    className="text-xl font-bold mb-2 cursor-pointer"
                    onClick={() => goToArticle(article.url)}
                  >
                    {article.title}
                  </h2>
                  <p className="text-gray-700">{article.description}</p>
                  <div className="flex items-center mt-4">
                    <button
                      onClick={() => handleLike(index)}
                      className="flex items-center p-2 rounded-full bg-gray-200 hover:bg-gray-300 mr-2"
                    >
                      <FontAwesomeIcon icon={faThumbsUp} />
                    </button>
                    <span>{likeCounts[index]}</span>
                    <button
                      onClick={() => handleDislike(index)}
                      className="flex items-center p-2 rounded-full bg-gray-200 hover:bg-gray-300 ml-2"
                    >
                      <FontAwesomeIcon icon={faThumbsDown} />
                    </button>
                    <button
                      onClick={() => toggleCommentsVisibility(index)}
                      className="ml-auto flex items-center p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <FontAwesomeIcon icon={faComment} />
                    </button>
                  </div>
                  {commentsVisible[index] && (
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          value={inputText[index] || ''}
                          onChange={(e) => handleInputTextChange(index, e.target.value)}
                          className="flex-1 border rounded p-2 mr-2"
                          placeholder="Write a comment..."
                        />
                        <button
                          onClick={() => handleCommentSubmit(index)}
                          className="p-2 bg-blue-500 text-white rounded"
                        >
                          Post
                        </button>
                      </div>
                      {comments[index] &&
                        Object.entries(comments[index]).map(([commentId, comment]) => (
                          <div key={commentId} className="p-4 border-b">
                            <div className="flex items-center">
                              {editCommentId === commentId ? (
                                // Edit comment input
                                <input
                                  type="text"
                                  value={editCommentText}
                                  onChange={(e) => setEditCommentText(e.target.value)}
                                  className="flex-1 border rounded p-2 mr-2"
                                />
                              ) : (
                                // Display comment text
                                <div className="flex-1">
                                  <p className="text-gray-700">{comment.text}</p>
                                  <p className="text-gray-500 text-sm">
                                    Posted on: {new Date(comment.timestamp.seconds * 1000).toLocaleString()}
                                  </p>
                                </div>
                              )}
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleCommentLike(index, commentId)}
                                  className="flex items-center p-2 rounded-full bg-gray-200 hover:bg-gray-300 mr-2"
                                >
                                  <FontAwesomeIcon icon={faThumbsUp} />
                                </button>
                                <span>{commentReactions[`${index}-${commentId}`]?.likeCount || 0}</span>
                                <button
                                  onClick={() => handleCommentDislike(index, commentId)}
                                  className="flex items-center p-2 rounded-full bg-gray-200 hover:bg-gray-300 ml-2 mr-4"
                                >
                                  <FontAwesomeIcon icon={faThumbsDown} />
                                </button>
                                <span>{commentReactions[`${index}-${commentId}`]?.dislikeCount || 0}</span>
                                {editCommentId === commentId ? (
                                  // Save edited comment
                                  <button
                                    onClick={() => handleCommentUpdate(index, commentId)}
                                    className="ml-2"
                                  >
                                    Save
                                  </button>
                                ) : (
                                  // Edit and delete buttons
                                  <>
                                    <button
                                      onClick={() => handleCommentEdit(index, commentId, comment.text)}
                                      className="ml-2"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleCommentDelete(index, commentId)}
                                      className="ml-2 text-red-500"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
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

export default Business;
