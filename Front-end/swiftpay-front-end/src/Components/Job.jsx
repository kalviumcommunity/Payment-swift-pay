import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons';
import { db } from '../../Firebase/Fire.config';
import { doc, getDoc, setDoc, collection, addDoc, query, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import FinancialTimes from './news';

const Job = () => {
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
                const apiKey = '9bb61b9359ede6f072b17ca5316d282a';
                const apiUrl = `https://gnews.io/api/v4/search?q=Jobs&lang=en&sortby=publishedAt&apikey=${apiKey}`;
                const response = await axios.get(apiUrl);
                setNewsData(response.data.articles);

                // Load like counts for each article
                const likeCountsArray = await Promise.all(
                    response.data.articles.map(async (article, index) => {
                        const articleRef = doc(db, 'jobLikes', index.toString());
                        const docSnap = await getDoc(articleRef);
                        return docSnap.exists() ? docSnap.data().count || 0 : 0;
                    })
                );
                setLikeCounts(likeCountsArray);

                // Subscribe to comments for each article
                response.data.articles.forEach((article, index) => {
                    const articleCommentsRef = collection(db, 'jobComments', index.toString(), 'comments');
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
                console.error('Error fetching news data:', error);
            }
        };

        fetchData();
    }, []);

    const handleLike = async (index) => {
        try {
            const articleRef = doc(db, 'jobLikes', index.toString());
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
            const articleCommentsRef = collection(db, 'jobComments', index.toString(), 'comments');
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
            const commentRef = doc(db, 'jobComments', index.toString(), 'comments', commentId);
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
            const commentRef = doc(db, 'jobComments', index.toString(), 'comments', commentId);
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
            const commentRef = doc(db, 'jobComments', index.toString(), 'comments', commentId);
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
            const commentRef = doc(db, 'jobComments', index.toString(), 'comments', commentId);
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
            <FinancialTimes />
            <div className="mx-auto px-4 py-8 max-w-screen-xl">
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
                                <div className="flex justify-end">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none mr-2"
                                        onClick={() => handleLike(index)}
                                    >
                                        <FontAwesomeIcon icon={faThumbsUp} />
                                        <span className="ml-2">{likeCounts[index]}</span>
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
                                        onClick={() => handleDislike(index)}
                                    >
                                        <FontAwesomeIcon icon={faThumbsDown} />
                                    </button>
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none ml-2"
                                        onClick={() => toggleCommentsVisibility(index)}
                                    >
                                        <FontAwesomeIcon icon={faComment} />
                                    </button>
                                </div>

                                {/* Comment section */}
                                {commentsVisible[index] && (
                                    <div className="mt-4">
                                        <textarea
                                            value={inputText[index] || ''}
                                            onChange={(e) => handleInputTextChange(index, e.target.value)}
                                            className="w-full p-2 border rounded-md focus:outline-none"
                                        ></textarea>
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none mt-2"
                                            onClick={() => handleCommentSubmit(index)}
                                        >
                                            Submit Comment
                                        </button>

                                        {/* Render comments */}
                                        {Object.entries(comments[index])
                                            // Sort the comments based on timestamp in descending order
                                            .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp))
                                            .map(([commentId, commentData]) => (
                                                <div key={commentId} className="mt-2 border-t border-gray-300 pt-2">
                                                    {editCommentId?.index === index && editCommentId?.commentId === commentId ? (
                                                        <div>
                                                            <textarea
                                                                value={editCommentText}
                                                                onChange={handleEditInputChange}
                                                                className="w-full p-2 border rounded-md focus:outline-none"
                                                            ></textarea>
                                                            <div className="flex justify-end mt-2">
                                                                <button
                                                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
                                                                    onClick={handleEditSubmit}
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <p className="text-gray-800">{commentData.text}</p>
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    {commentData.formattedTimestamp}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center ml-4">
                                                                <button
                                                                    className="text-green-500 mr-2"
                                                                    onClick={() => handleCommentLike(index, commentId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faThumbsUp} />
                                                                    {commentReactions[`${index}-${commentId}`]?.likeCount || 0}
                                                                </button>
                                                                <button
                                                                    className="text-red-500"
                                                                    onClick={() => handleCommentDislike(index, commentId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faThumbsDown} />
                                                                    {commentReactions[`${index}-${commentId}`]?.dislikeCount || 0}
                                                                </button>
                                                                <button
                                                                    className="text-blue-500 ml-2"
                                                                    onClick={() => handleEditClick(index, commentId, commentData.text)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className="text-red-500 ml-2"
                                                                    onClick={() => handleCommentDelete(index, commentId)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
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
        </>
    );
};

export default Job;
