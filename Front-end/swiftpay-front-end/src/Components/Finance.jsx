import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons';
import { db,auth } from '../../Firebase/Fire.config';
import { onAuthStateChanged } from 'firebase/auth';
import {toast} from "react-toastify"
import { debounce } from 'lodash';


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
  runTransaction, getFirestore
} from 'firebase/firestore';
import FinancialTimes from './news';

const Finance = () => {
  const [newsData, setNewsData] = useState([]);
  const [likeCounts, setLikeCounts] = useState([]);
  const [comments, setComments] = useState({});
  const [inputText, setInputText] = useState({}); // State for comment input text for each article
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [commentsVisible, setCommentsVisible] = useState({}); // State to control the visibility of comments for each article
  const [commentCounts, setCommentCounts] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [dislikeCounts, setDislikeCounts] = useState([]);
  
  

  // State for comment reactions (like and dislike counts for each comment)
  const [commentReactions, setCommentReactions] = useState({});



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = '55e97b2991a74a577a0ab4baa650903b';
        const apiUrl = `https://gnews.io/api/v4/search?q=Finance&lang=en&sortby=publishedAt&apikey=${apiKey}`;
        const response = await axios.get(apiUrl);
        console.log('Fetched data:', response.data);
        setNewsData(response.data.articles);

        // Fetch like counts from Firestore for each article
        const likeCountsArray = await Promise.all(
          response.data.articles.map(async (article, index) => {
            const articleRef = doc(db, 'financelikes', index.toString());
            const docSnap = await getDoc(articleRef);
            return docSnap.exists() ? docSnap.data().count || 0 : 0;
          })
        );
        setLikeCounts(likeCountsArray);

        // Subscribe to comments for each article
        response.data.articles.forEach((article, index) => {
          const articleCommentsRef = collection(db, 'financecomments', index.toString(), 'comments');
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

 // Handle like functionality with a debounce delay of 300 ms
const handleLike = debounce(async (index) => {
  try {
      // Check if user is authenticated
      if (!currentUser) {
          console.log('User not authenticated');
          return;
      }

      // Get user identifier (email or username)
      const userIdentifier = currentUser.email || currentUser.username;
      if (!userIdentifier) {
          console.log('User does not have an email or username');
          return;
      }

      // Define Firestore document references
      const userLikeRef = doc(db, 'articleLikes', `${index}-${userIdentifier}`);
      const articleRef = doc(db, 'financelikes', index.toString());
      const userLikeSnap = await getDoc(userLikeRef);
      const docSnap = await getDoc(articleRef);

      let newCount;

      // Check if user has already liked the article
      if (userLikeSnap.exists()) {
          // Remove user's like and calculate the new like count
          newCount = Math.max((docSnap.exists() ? docSnap.data().count : 0) - 1, 0);

          // Update the like count in Firestore
          await setDoc(articleRef, { count: newCount }, { merge: true });

          // Delete the user's like record
          await deleteDoc(userLikeRef);

          // Update local state for like counts
          setLikeCounts((prevCounts) => {
              const newCounts = [...prevCounts];
              newCounts[index] = newCount;
              return newCounts;
          });

          console.log('User has unliked the article');
      } else {
          // Add user's like and increment the like count
          newCount = (docSnap.exists() ? docSnap.data().count : 0) + 1;

          // Update the like count in Firestore
          await setDoc(articleRef, { count: newCount }, { merge: true });

          // Mark user as having liked the article
          await setDoc(userLikeRef, { liked: true });

          // Update local state for like counts
          setLikeCounts((prevCounts) => {
              const newCounts = [...prevCounts];
              newCounts[index] = newCount;
              return newCounts;
          });

          console.log('User has liked the article');
      }
  } catch (error) {
      console.error('Error updating like count:', error);
  }
}, 300);



const handleDislike = debounce(async (index) => {
  try {
      if (!currentUser) {
          console.log('User not authenticated');
          return;
      }

      // Define document references
      const userDislikeRef = doc(db, 'articleDislikes', `${index}-${currentUser.uid}`);
      const articleRef = doc(db, 'financedislikes', index.toString());
      const userDislikeSnap = await getDoc(userDislikeRef);
      const docSnap = await getDoc(articleRef);

      let newCount;

      if (userDislikeSnap.exists()) {
          // User has already disliked this article
          await deleteDoc(userDislikeRef);

          // Calculate new count ensuring it doesn't go below zero
          newCount = Math.max((docSnap.exists() ? docSnap.data().count : 0) - 1, 0);

          // Update dislike count in Firestore
          await setDoc(articleRef, { count: newCount }, { merge: true });

          // Update the local state for dislike counts
          setDislikeCounts((prevCounts) => {
              const newCounts = [...prevCounts];
              newCounts[index] = newCount;
              return newCounts;
          });

          console.log('User has removed dislike from the article');
      } else {
          // User has not disliked this article yet, so add their dislike
          newCount = (docSnap.exists() ? docSnap.data().count : 0) + 1;

          // Update dislike count in Firestore
          await setDoc(articleRef, { count: newCount }, { merge: true });

          // Mark user as having disliked the article
          await setDoc(userDislikeRef, { disliked: true });

          // Update the local state for dislike counts
          setDislikeCounts((prevCounts) => {
              const newCounts = [...prevCounts];
              newCounts[index] = newCount;
              return newCounts;
          });

          console.log('User has disliked the article');
      }
  } catch (error) {
      console.error('Error updating dislike count:', error);
  }
}, 300);

// Use the debounced handleDislike function


  const handleCommentSubmit = async (index) => {
    try {
        const articleCommentsRef = collection(db, 'financecomments', index.toString(), 'comments');
        const newCommentData = {
            text: inputText[index],
            timestamp: new Date(),
            likeCount: 0,
            dislikeCount: 0,
            user: currentUser?.displayName || currentUser?.email,
        };
        console.log('Current User:', currentUser);
        await addDoc(articleCommentsRef, newCommentData);

        setInputText((prevText) => ({
            ...prevText,
            [index]: '',
        }));
    } catch (error) {
        console.error('Error adding comment:', error);
    }
};

const handleCommentEdit = async (index, commentId) => {
  try {
      // Retrieve the comment document from Firestore
      const commentRef = doc(db, 'financecomments', index.toString(), 'comments', commentId);
      const commentSnap = await getDoc(commentRef);

      if (commentSnap.exists()) {
          const commentData = commentSnap.data();
          
          // Retrieve the current user's email and display name
          const currentUserEmail = currentUser?.email;
          const currentUserName = currentUser?.displayName;

          // Check if the current user's email or display name matches the comment's user information
          if (currentUserEmail === commentData.user || currentUserName === commentData.user) {
              // Allow the user to edit the comment
              setEditCommentId(commentId);
              setEditCommentText(commentData.text);
          } else {
              toast.warning('This is not posted by you');
          }
      } else {
          console.log('Comment does not exist');
      }
  } catch (error) {
      console.error('Error editing comment:', error);
  }
};


  const handleCommentUpdate = async (index, commentId) => {
    try {
        // Get the reference to the comment in Firestore
        const commentRef = doc(db, 'financecomments', index.toString(), 'comments', commentId);
        
        // Fetch the comment data
        const commentSnap = await getDoc(commentRef);
        
        if (commentSnap.exists()) {
            // Get the data of the comment
            const commentData = commentSnap.data();
            
            // Check if the current user is the owner of the comment
            const currentUserEmail = currentUser?.email;
            const currentUserName = currentUser?.displayName;
            
            if (currentUserEmail === commentData.user || currentUserName === commentData.user) {
                // User is authorized to update the comment
                await updateDoc(commentRef, { text: editCommentText });
                
                // Reset the edit state
                setEditCommentId(null);
                setEditCommentText('');
            } else {
                console.log('User is not authorized to edit this comment');
            }
        } else {
            console.log('Comment does not exist');
        }
    } catch (error) {
        console.error('Error updating comment:', error);
    }
};


  const handleCommentDelete = async (index, commentId) => {
    try {
        // Get the reference to the comment in Firestore
        const commentRef = doc(db, 'financecomments', index.toString(), 'comments', commentId);
        
        // Fetch the comment data
        const commentSnap = await getDoc(commentRef);
        
        if (commentSnap.exists()) {
            // Get the data of the comment
            const commentData = commentSnap.data();
            
            // Check if the current user is the owner of the comment
            const currentUserEmail = currentUser?.email;
            const currentUserName = currentUser?.displayName;
            
            if (currentUserEmail === commentData.user || currentUserName === commentData.user) {
                // User is authorized to delete the comment
                await deleteDoc(commentRef);
            } else {
                toast.warning('This comment is not posted by you');
            }
        } else {
            console.log('Comment does not exist');
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
};


  const goToArticle = (url) => {
    window.open(url, '_blank');
  };

  // Handle liking a comment
  const debounceDelay = 300;

  // Define the debounce functions for like and dislike
  const handleCommentLike = debounce(async (index, commentId) => {
      try {
          // Create references to the user like and comment documents
          const userLikeRef = doc(db, 'financecommentLikes', `${index}-${commentId}-${currentUser.uid}`);
          const commentRef = doc(db, 'financecomments', index.toString(), 'comments', commentId);
  
          // Run a Firestore transaction for atomic updates
          await runTransaction(db, async (transaction) => {
              // Check if the user has already liked the comment
              const userLikeSnap = await transaction.get(userLikeRef);
              const commentSnap = await transaction.get(commentRef);
  
              let newLikeCount;
              if (userLikeSnap.exists()) {
                  // User has already liked the comment, remove the like
                  transaction.delete(userLikeRef);
                  newLikeCount = (commentSnap.exists() ? commentSnap.data().likeCount : 0) - 1;
              } else {
                  // User has not liked the comment yet, add the like
                  transaction.set(userLikeRef, { liked: true });
                  newLikeCount = (commentSnap.exists() ? commentSnap.data().likeCount : 0) + 1;
              }
  
              // Update the comment like count
              transaction.update(commentRef, { likeCount: newLikeCount });
  
              // Update the state for comment reactions
              setCommentReactions((prevReactions) => {
                  const newReactions = { ...prevReactions };
                  newReactions[`${index}-${commentId}`] = {
                      likeCount: newLikeCount,
                      dislikeCount: prevReactions[`${index}-${commentId}`]?.dislikeCount || 0,
                  };
                  return newReactions;
              });
          });
  
          console.log('Comment like handled successfully');
      } catch (error) {
          console.error('Error updating comment like count:', error);
      }
  }, debounceDelay);
  
  const handleCommentDislike = debounce(async (index, commentId) => {
      try {
          // Create references to the user dislike and comment documents
          const userDislikeRef = doc(db, 'financecommentDislikes', `${index}-${commentId}-${currentUser.uid}`);
          const commentRef = doc(db, 'financecomments', index.toString(), 'comments', commentId);
  
          // Run a Firestore transaction for atomic updates
          await runTransaction(db, async (transaction) => {
              // Check if the user has already disliked the comment
              const userDislikeSnap = await transaction.get(userDislikeRef);
              const commentSnap = await transaction.get(commentRef);
  
              let newDislikeCount;
              if (userDislikeSnap.exists()) {
                  // User has already disliked the comment, remove the dislike
                  transaction.delete(userDislikeRef);
                  newDislikeCount = (commentSnap.exists() ? commentSnap.data().dislikeCount : 0) - 1;
              } else {
                  // User has not disliked the comment yet, add the dislike
                  transaction.set(userDislikeRef, { disliked: true });
                  newDislikeCount = (commentSnap.exists() ? commentSnap.data().dislikeCount : 0) + 1;
              }
  
              // Update the comment dislike count
              transaction.update(commentRef, { dislikeCount: newDislikeCount });
  
              // Update the state for comment reactions
              setCommentReactions((prevReactions) => {
                  const newReactions = { ...prevReactions };
                  newReactions[`${index}-${commentId}`] = {
                      likeCount: prevReactions[`${index}-${commentId}`]?.likeCount || 0,
                      dislikeCount: newDislikeCount,
                  };
                  return newReactions;
              });
          });
  
          console.log('Comment dislike handled successfully');
      } catch (error) {
          console.error('Error updating comment dislike count:', error);
      }
  }, debounceDelay);
  
  // Use the debounced functions when a user clicks the buttons
  // Example usage:
  // onClick={() => debouncedHandleCommentLike(index, commentId)}
  // onClick={() => debouncedHandleCommentDislike(index, commentId)}


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
                    <span className='ml-2'> {dislikeCounts[index]} </span>
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

export default Finance;
