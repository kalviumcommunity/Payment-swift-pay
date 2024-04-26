// import React, { useEffect, useState } from 'react';
// import { db, auth } from '../../Firebase/Fire.config';
// import {
//     collection,
//     addDoc,
//     onSnapshot,
//     orderBy,
//     query,
//     serverTimestamp,
//     doc,
//     updateDoc,
// } from 'firebase/firestore';
// import { format } from 'date-fns';
// import {
//     ConversationHeader,
//     MessageContaineres,
// } from '@minchat/react-chat-ui';

// const ChatComponent = () => {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');
//     const [editMessage, setEditMessage] = useState(null);

//     const messagesRef = collection(db, 'appQuestions');

//     // Fetch messages on mount
//     useEffect(() => {
//         const q = query(messagesRef, orderBy('createdAt'));
//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             const msgs = [];
//             querySnapshot.forEach((doc) => {
//                 const data = doc.data();
//                 const msg = {
//                     id: data.uid === auth.currentUser.uid ? 0 : 1,
//                     message: data.text,
//                     senderName: data.displayName,
//                     createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date(),
//                     photoURL: data.photoURL,
//                 };
//                 msgs.push(msg);
//             });
//             setMessages(msgs);
//         });
//         return () => unsubscribe();
//     }, []);

//     // Send a message
//     const sendMessage = async (e) => {
//         e.preventDefault();

//         if (!auth.currentUser) {
//             console.error('User is not authenticated');
//             return;
//         }

//         if (input.trim() === '') return;

//         const { uid, photoURL, displayName } = auth.currentUser;

//         if (editMessage) {
//             // If editing, update the existing message
//             const messageDoc = doc(db, 'appQuestions', editMessage.id);
//             await updateDoc(messageDoc, {
//                 text: input,
//                 updatedAt: serverTimestamp(),
//             });
//             setEditMessage(null);
//         } else {
//             // Add the new message to Firestore
//             await addDoc(messagesRef, {
//                 text: input,
//                 createdAt: serverTimestamp(),
//                 uid,
//                 photoURL,
//                 displayName,
//             });
//         }

//         setInput('');
//     };

//     return (
//         <Chat>
//             <MessageContaineres>
//                 {messages.map((msg, idx) => (
//                     <ChatMessage
//                         key={idx}
//                         message={msg.message}
//                         createdAt={format(msg.createdAt, 'dd/MM/yyyy HH:mm')}
//                         senderName={msg.senderName}
//                         direction={msg.id === 0 ? 'outgoing' : 'incoming'}
//                     >
//                         {msg.id !== 0 && (
//                             <ChatUser
//                                 src={msg.photoURL}
//                                 name={msg.senderName}
//                             />
//                         )}
//                     </ChatMessage>
//                 ))}
//             </MessageContaineres>
//             <ChatInput
//                 placeholder="Type a message..."
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onSend={() => {
//                     sendMessage();
//                     setInput('');
//                 }}
//             />
//         </Chat>
//     );
// };

// export default ChatComponent;
