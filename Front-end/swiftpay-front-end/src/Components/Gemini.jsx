import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const chatContainerRef = useRef(null);

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSendMessage = async () => {
        try {
            if (!userInput.trim()) return;
    
            // Add user's message to the messages array
            const newMessage = { role: 'user', content: userInput.trim() };
            setMessages([...messages, newMessage]);
    
            // Send the user message to the server
            const response = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: [newMessage] }),
            });
    
            if (response.ok) {
                // Process streaming response...
            } else {
                console.error('Failed to fetch AI response:', response.statusText);
            }
    
            // Clear user input
            setUserInput('');
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };
    
    return (
        <div>
            <div id="chat-container" ref={chatContainerRef} style={{ height: '500px', overflowY: 'auto', padding: '10px', border: '1px solid #ccc' }}>
                {messages.map((message, index) => (
                    <div key={index} className={message.role === 'user' ? 'user-message' : 'ai-message'} style={{ color: message.role === 'user' ? 'blue' : 'green' }}>
                        {message.content}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', marginTop: '10px' }}>
                <input type="text" value={userInput} onChange={handleInputChange} style={{ flexGrow: 1, marginRight: '10px' }} />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
