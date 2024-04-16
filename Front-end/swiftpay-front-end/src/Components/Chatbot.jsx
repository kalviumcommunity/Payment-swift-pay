import React, { useState, useEffect } from 'react';

function Chatbot() {
  const [userMessage, setUserMessage] = useState(""); // State to store user's message
  const [chatMessages, setChatMessages] = useState([
    { role: "incoming", content: "Hi there 👋\nHow can I help you today?" }
  ]); // State to store chat messages
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // State to track whether the chatbot is open or closed

  const handleInputChange = (e) => {
    setUserMessage(e.target.value); // Update userMessage state with input value
  };

  const handleSendChat = () => {
    if (!userMessage.trim()) return; // If user message is empty or only whitespace, return

    // Add user message to chat messages
    setChatMessages(prevMessages => [
      ...prevMessages,
      { role: "outgoing", content: userMessage }
    ]);
    setUserMessage(""); // Clear userMessage state

    // Simulate "Thinking..." message and generate response after a delay
    setTimeout(() => {
      setChatMessages(prevMessages => [
        ...prevMessages,
        { role: "incoming", content: "Thinking..." }
      ]);
      generateResponse();
    }, 600);
  };

  const generateResponse = () => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}` // Use environment variable for API key
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      })
    };

    fetch(API_URL, requestOptions)
      .then(res => res.json())
      .then(data => {
        setChatMessages(prevMessages => [
          ...prevMessages,
          { role: "incoming", content: data.choices[0].message.content.trim() }
        ]);
      })
      .catch(() => {
        setChatMessages(prevMessages => [
          ...prevMessages,
          { role: "incoming", content: "Oops! Something went wrong. Please try again." }
        ]);
      });
  };

  useEffect(() => {
    // Scroll to the bottom of the chatbox whenever chatMessages change
    const chatbox = document.querySelector(".chatbox");
    chatbox.scrollTop = chatbox.scrollHeight;
  }, [chatMessages]);

  const handleCloseChatbot = () => {
    setIsChatbotOpen(false);
  };

  const handleOpenChatbot = () => {
    setIsChatbotOpen(true);
  };

  return (
    <>
      <button className="open-btn fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none" onClick={handleOpenChatbot}>
        Open Chatbot
      </button>
      <div className={`chatbot bg-gray-100 rounded-lg shadow-lg p-4 fixed right-5 bottom-20 w-80 ${isChatbotOpen ? 'block' : 'hidden'}`}>
        <header className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Chatbot</h2>
          <span className="close-btn material-symbols-outlined text-gray-600 hover:text-gray-800 cursor-pointer" onClick={handleCloseChatbot}>close</span>
        </header>
        <ul className="chatbox flex-1 overflow-auto">
          {chatMessages.map((message, index) => (
            <li key={index} className={`chat ${message.role} flex items-center mb-2`}>
              {message.role === "incoming" ? (
                <>
                  <span className="material-symbols-outlined text-gray-600 mr-2 w-8 h-8 flex items-center justify-center bg-purple-600 rounded-full">smart_toy</span>
                  <p className="bg-gray-200 rounded-lg p-2">{message.content}</p>
                </>
              ) : (
                <p className="bg-blue-500 text-white rounded-lg p-2">{message.content}</p>
              )}
            </li>
          ))}
        </ul>
        <div className="chat-input flex items-center">
          <textarea
            className="flex-1 mr-2 p-2 rounded-lg border border-gray-300 focus:outline-none"
            placeholder="Enter a message..."
            spellCheck={false}
            value={userMessage}
            onChange={handleInputChange}
          ></textarea>
          <button
            className="send-btn bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
            onClick={handleSendChat}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
