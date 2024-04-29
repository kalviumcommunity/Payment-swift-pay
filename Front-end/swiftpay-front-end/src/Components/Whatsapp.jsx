import React, { useEffect } from 'react';

const SmartsuppChat = () => {
    useEffect(() => {
        // Create a script element
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://www.smartsuppchat.com/loader.js?';

        // Create the _smartsupp object and set the key
        window._smartsupp = window._smartsupp || {};
        window._smartsupp.key = 'a55df6803e02176717e01f3416c825a82ef682d7';

        // Append the script to the document head or body
        document.body.appendChild(script);

        // Optional: Clean up the script on unmount
        return () => {
            document.body.removeChild(script);
            window._smartsupp = undefined; // Clean up the _smartsupp object
        };
    }, []);

    // Render nothing since the script handles the widget UI
    return null;
};

export default SmartsuppChat;
