import React, { useEffect, useState } from 'react';
import { db, auth } from '../../Firebase/Fire.config';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [editMessage, setEditMessage] = useState(null); // State for editing messages

    const messagesRef = collection(db, 'appQuestions');

    // Fetch messages on mount
    useEffect(() => {
        const q = query(messagesRef, orderBy('createdAt'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = [];
            querySnapshot.forEach((doc) => {
                msgs.push({ ...doc.data(), id: doc.id });
            });
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, []);

    // Send a message
    const sendMessage = async (e) => {
        e.preventDefault();

        if (!auth.currentUser) {
            console.error('User is not authenticated');
            return;
        }

        if (input.trim() === '') return;

        const { uid, photoURL, displayName } = auth.currentUser;

        if (editMessage) {
            // If editing, update the existing message
            const messageDoc = doc(db, 'appQuestions', editMessage.id);
            await updateDoc(messageDoc, {
                text: input,
                updatedAt: serverTimestamp(),
            });
            setEditMessage(null);
        } else {
            // Add the new message to Firestore
            await addDoc(messagesRef, {
                text: input,
                createdAt: serverTimestamp(),
                uid,
                photoURL,
                displayName,
            });
        }

        setInput('');
    };

    // Delete a message
    const deleteMessage = async (id) => {
        if (!auth.currentUser) {
            console.error('User is not authenticated');
            return;
        }

        const messageDoc = doc(db, 'appQuestions', id);
        await deleteDoc(messageDoc);
    };

    // Handle edit
    const handleEdit = (msg) => {
        setInput(msg.text);
        setEditMessage(msg);
    };

    return (
        <div className="flex flex-col items-center h-screen bg-white text-gray-800">
            <div className="w-4/5 h-3/4 overflow-y-auto border border-gray-300 p-4 mb-5 rounded-lg shadow-md bg-gray-100">
                {/* Display messages */}
                {messages.map((msg) => (
                    <div key={msg.id} className="mb-4 p-3 bg-gray-50 rounded-lg shadow-sm">
                        <div className="flex items-center mb-2">
                            <img
                                src={msg.photoURL}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                                <strong className="block text-sm font-semibold">{msg.displayName}</strong>
                                <span className="text-gray-500 text-xs">
                                    {msg.createdAt ? format(new Date(msg.createdAt.seconds * 1000), 'dd/MM/yyyy HH:mm') : 'Unknown date'}
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-2">{msg.text}</p>

                        {/* Buttons for edit and delete */}
                        {auth.currentUser?.uid === msg.uid && (
                            <div className="flex space-x-2">
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded-lg"
                                    onClick={() => handleEdit(msg)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded-lg"
                                    onClick={() => deleteMessage(msg.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Form to send a message */}
            <form onSubmit={sendMessage} className="w-4/5 flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 mr-3 bg-gray-50 text-gray-700"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600"
                >
                    {editMessage ? 'Update' : 'Send'}
                </button>
            </form>
        </div>
    );
};

export default Chat;
