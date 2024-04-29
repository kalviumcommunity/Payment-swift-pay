import React, { useEffect } from 'react';

const TradingViewWidget = () => {
    useEffect(() => {
        // Create a script element
        const script = document.createElement('script');
        // Set the script's attributes
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
        script.async = true;
        
        // Set the configuration for the TradingView widget
        const config = {
            symbols: [
                {
                    proName: 'FOREXCOM:SPXUSD',
                    title: 'S&P 500 Index'
                },
                {
                    proName: 'FOREXCOM:NSXUSD',
                    title: 'US 100 Cash CFD'
                },
                {
                    proName: 'FX_IDC:EURUSD',
                    title: 'EUR to USD'
                },
                {
                    proName: 'BITSTAMP:BTCUSD',
                    title: 'Bitcoin'
                },
                {
                    proName: 'BITSTAMP:ETHUSD',
                    title: 'Ethereum'
                }
            ],
            showSymbolLogo: true,
            isTransparent: false,
            displayMode: 'adaptive',
            colorTheme: 'light',
            locale: 'en'
        };
        
        // Convert the config object to a JSON string and set it as the inner HTML of the script element
        script.innerHTML = JSON.stringify(config);
        
        // Append the script element to the widget container
        document.querySelector('.tradingview-widget-container__widget').appendChild(script);
        
        // Cleanup function to remove the script tag on component unmount
        return () => {
            document.querySelector('.tradingview-widget-container__widget').removeChild(script);
        };
    }, []);

    return (
        <div className="tradingview-widget-container">
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-copyright">
                <a href="https://www.tradingview.com/" rel="noopener noreferrer" target="_blank">
                  
                </a>
            </div>
        </div>
    );
};

export default TradingViewWidget;
