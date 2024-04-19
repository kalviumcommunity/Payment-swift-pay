import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons';
import WealthNews from './news';
import { db } from '../../Firebase/Fire.config';
import { doc, getDoc, setDoc, collection, addDoc, query, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment';

const Wealth = () => {
    const [newsData, setNewsData] = useState([]);
    const [likeCounts, setLikeCounts] = useState([]);
    const [comments, setComments] = useState({});
    const [inputText, setInputText] = useState({});
    const [commentsVisible, setCommentsVisible] = useState({});
    const [commentReactions, setCommentReactions] = useState({});
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiKey = 'b2046fe9ee87859fe88282fc4c26b521';
                const apiUrl = `https://gnews.io/api/v4/search?q=Wealth&lang=en&sortby=publishedAt&apikey=${apiKey}`;
                const response = await axios.get(apiUrl);
                setNewsData(response.data.articles);

                // Fetch like counts from Firestore for each article
                const likeCountsArray = await Promise.all(
                    response.data.articles.map(async (article, index) => {
                        const articleRef = doc(db, 'wealthLikes', index.toString());
                        const docSnap = await getDoc(articleRef);
                        return docSnap.exists() ? docSnap.data().count || 0 : 0;
                    })
                );
                setLikeCounts(likeCountsArray);

                // Subscribe to comments for each article
                response.data.articles.forEach((article, index) => {
                    const articleCommentsRef = collection(db, 'wealthComments', index.toString(), 'comments');
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
                console.error('Error fetching wealth news data:', error);
            }
        };

        fetchData();
    }, []);

    const handleLike = async (index) => {
        try {
            const articleRef = doc(db, 'wealthLikes', index.toString());
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

    const handleDislike = async (index) => {
        console.log('Dislike functionality not implemented yet.');
    };

    const handleCommentSubmit = async (index) => {
        try {
            const articleCommentsRef = collection(db, 'wealthComments', index.toString(), 'comments');
            const commentData = {
                text: inputText[index],
                timestamp: new Date().toISOString(),
                formattedTimestamp: moment(new Date()).format('MMMM Do, YYYY h:mm a'),
                likeCount: 0,
                dislikeCount: 0,
            };

            await addDoc(articleCommentsRef, commentData);
            setInputText((prevInputText) => ({
                ...prevInputText,
                [index]: '',
            }));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleCommentLike = async (index, commentId) => {
        try {
            const commentRef = doc(db, 'wealthComments', index.toString(), 'comments', commentId);
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

    const handleCommentDislike = async (index, commentId) => {
        try {
            const commentRef = doc(db, 'wealthComments', index.toString(), 'comments', commentId);
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

    const handleCommentDelete = async (index, commentId) => {
        try {
            const commentRef = doc(db, 'wealthComments', index.toString(), 'comments', commentId);
            await deleteDoc(commentRef);

            setComments((prevComments) => {
                const newComments = { ...prevComments };
                delete newComments[index][commentId];
                return newComments;
            });
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleCommentEdit = async (index, commentId) => {
        try {
            const commentRef = doc(db, 'wealthComments', index.toString(), 'comments', commentId);
            await updateDoc(commentRef, { text: editCommentText });
            setEditCommentId(null);
            setEditCommentText('');
        } catch (error) {
            console.error('Error updating comment:', error);
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

    const handleEditClick = (index, commentId, currentText) => {
        setEditCommentId({ index, commentId });
        setEditCommentText(currentText);
    };

    const handleEditInputChange = (e) => {
        setEditCommentText(e.target.value);
    };

    const handleEditSubmit = async () => {
        const { index, commentId } = editCommentId;
        await handleCommentEdit(index, commentId);
    };

    const goToArticle = (url) => {
        window.open(url, '_blank');
    };

    return (
        <>
            <WealthNews />
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
                                    <p className="text-gray-600 mb-4">{article.description}</p>
                                    <p className="text-sm text-gray-500">{article.source.name} - {new Date(article.publishedAt).toLocaleString()}</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <div>
                                            <button
                                                className="text-blue-500 hover:text-blue-700 mr-2"
                                                onClick={() => handleLike(index)}
                                            >
                                                <FontAwesomeIcon icon={faThumbsUp} />
                                                <span className="ml-1">{likeCounts[index]}</span>
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDislike(index)}
                                            >
                                                <FontAwesomeIcon icon={faThumbsDown} />
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                className="text-gray-500 hover:text-gray-700"
                                                onClick={() => toggleCommentsVisibility(index)}
                                            >
                                                <FontAwesomeIcon icon={faComment} />
                                            </button>
                                        </div>
                                    </div>
                                    {commentsVisible[index] && (
                                        <div className="mt-4">
                                            <div>
                                                <textarea
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    placeholder="Add a comment..."
                                                    value={inputText[index] || ''}
                                                    onChange={(e) => handleInputTextChange(index, e.target.value)}
                                                />
                                                <button
                                                    className="mt-2 py-1 px-4 bg-blue-500 text-white rounded"
                                                    onClick={() => handleCommentSubmit(index)}
                                                >
                                                    Post Comment
                                                </button>
                                            </div>
                                            {comments[index] &&
                                                Object.entries(comments[index]).map(([commentId, commentData]) => (
                                                    <div key={commentId} className="mt-4">
                                                        {editCommentId?.index === index && editCommentId?.commentId === commentId ? (
                                                            <div>
                                                                <textarea
                                                                    className="w-full p-2 border border-gray-300 rounded"
                                                                    value={editCommentText}
                                                                    onChange={handleEditInputChange}
                                                                />
                                                                <button
                                                                    className="mt-2 py-1 px-4 bg-blue-500 text-white rounded"
                                                                    onClick={handleEditSubmit}
                                                                >
                                                                    Update Comment
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <p>{commentData.text}</p>
                                                                <p className="text-sm text-gray-500">{commentData.formattedTimestamp}</p>
                                                                <div className="flex items-center justify-between mt-2">
                                                                    <div>
                                                                        <button
                                                                            className="text-blue-500 hover:text-blue-700 mr-2"
                                                                            onClick={() => handleCommentLike(index, commentId)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faThumbsUp} />
                                                                            <span className="ml-1">{commentReactions[`${index}-${commentId}`]?.likeCount || 0}</span>
                                                                        </button>
                                                                        <button
                                                                            className="text-red-500 hover:text-red-700"
                                                                            onClick={() => handleCommentDislike(index, commentId)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faThumbsDown} />
                                                                            <span className="ml-1">{commentReactions[`${index}-${commentId}`]?.dislikeCount || 0}</span>
                                                                        </button>
                                                                    </div>
                                                                    <div>
                                                                        <button
                                                                            className="text-gray-500 hover:text-gray-700 mr-2"
                                                                            onClick={() => handleEditClick(index, commentId, commentData.text)}
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            className="text-gray-500 hover:text-gray-700"
                                                                            onClick={() => handleCommentDelete(index, commentId)}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
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

export default Wealth;
