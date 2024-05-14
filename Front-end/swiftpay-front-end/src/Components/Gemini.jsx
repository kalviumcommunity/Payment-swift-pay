import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/themes/prism.css"; // Import PrismJS CSS
import CodeResponse from "./CodeResponse"; 


const Gemini = () => {
  // Define state and references
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  // Function to auto-resize the textarea based on content
  const autoResizeInput = () => {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  // Fetch response from the server
  const fetchResponse = async () => {
    if (!value.trim()) {
      setError("Please enter a question.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://payment-swift-pay.onrender.com/gemini", {
        method: "POST",
        body: JSON.stringify({ history: chatHistory, message: value }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.text();

      // Format the response from the server
      const formattedResponse = data.startsWith("**")
        ? data
        : `**Bot:** ${data}`;
      
      // Format the user's message for display
      const formattedUserMessage = `**You:** ${value}`;

      // Update chat history with user's message and bot's response
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { role: "user", parts: formattedUserMessage },
        { role: "model", parts: formattedResponse }
      ]);

      // Clear input field and reset loading state
      setValue("");
      setIsLoading(false);
      autoResizeInput();
    } catch (error) {
      console.error("Error fetching response:", error);
      setError("Something went wrong. Please try again later.");
      setIsLoading(false);
    }
  };

  // Function to clear chat history and input field
  const clearHistory = () => {
    setChatHistory([]);
    setValue("");
    setError("");
    textareaRef.current.style.height = "auto";
  };

  // Effect to highlight code blocks using PrismJS when chat history updates
  useEffect(() => {
    Prism.highlightAll();
  }, [chatHistory]);

  // Render the Gemini chatbot component
  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Gemini Chatbot</h1>

      {/* Textarea and Action Buttons */}
      <div className="mb-4">
        <textarea
          ref={textareaRef}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={value}
          placeholder="Type your question here..."
          onChange={(e) => {
            setValue(e.target.value);
            autoResizeInput();
          }}
        />
        <div className="flex justify-end space-x-4 mt-2">
          <button
            className={`px-4 py-2 rounded-lg shadow ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600"
            } text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            onClick={fetchResponse}
            disabled={isLoading}
          >
            {isLoading ? "Thinking..." : "Ask"}
          </button>
          {error && (
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={clearHistory}
            >
              Clear Chat
            </button>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 text-red-600 font-semibold">
          {error}
        </div>
      )}

      {/* Chat history */}
      <div className="border-t border-gray-300 pt-4">
        {chatHistory.map((chatItem, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
            {chatItem.role === "user" ? (
              <div className="text-blue-600">
                <ReactMarkdown>{chatItem.parts}</ReactMarkdown>
              </div>
            ) : chatItem.parts.startsWith("```") ? (
              <CodeResponse code={chatItem.parts} />
            ) : (
              <div className="text-gray-800">
                <ReactMarkdown>{chatItem.parts}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gemini;
