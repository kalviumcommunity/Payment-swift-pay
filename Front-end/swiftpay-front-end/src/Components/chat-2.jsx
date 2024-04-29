import React, { useEffect } from 'react';

const CrispChat = () => {
    useEffect(() => {
        // Create the script element
        const script = document.createElement('script');
        script.src = 'https://client.crisp.chat/l.js';
        script.async = true;

        // Set the website ID
        window.$crisp = [];
        window.CRISP_WEBSITE_ID = 'efc42967-833b-45b7-a4ba-8054beb47dfd';

        // Append the script element to the head
        document.head.appendChild(script);

        // Cleanup function to remove the script element
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    // No need to render anything for the chat
    return null;
};

export default CrispChat;
