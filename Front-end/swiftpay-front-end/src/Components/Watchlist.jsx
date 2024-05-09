import React from 'react';

const WatchlistPage = ({ watchlist, coins, removeFromWatchlist }) => {
 
    const watchlistCoins = coins.filter((coin) => watchlist.includes(coin.id));

    return (
        <div className="w-3/4 mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">My Watchlist</h2>

            <table className="w-full border border-gray-300 shadow-lg text-center rounded-lg overflow-hidden">
                <thead className="bg-gray-200 border-b border-gray-300">
                    <tr>
                        <th className="py-2 px-4 border-r border-gray-300">Coin</th>
                        <th className="py-2 px-4 border-r border-gray-300">Symbol</th>
                        <th className="py-2 px-4 border-r border-gray-300">Price</th>
                        <th className="py-2 px-4 border-r border-gray-300">Market Cap</th>
                        <th className="py-2 px-4 border-r border-gray-300">24h Change (%)</th>
                        <th className="py-2 px-4">Logo</th>
                    </tr>
                </thead>
                <tbody>
                    {watchlistCoins.map((coin, index) => (
                        <tr key={coin.id} className="border-b border-gray-300">
                            <td className="py-2 px-4 border-r border-gray-300">{coin.name}</td>
                            <td className="py-2 px-4 border-r border-gray-300">{coin.symbol.toUpperCase()}</td>
                            <td className="py-2 px-4 border-r border-gray-300">{coin.current_price.toFixed(2)}</td>
                            <td className="py-2 px-4 border-r border-gray-300">
                                {coin.market_cap.toLocaleString()}
                            </td>
                            <td className="py-2 px-4 border-r border-gray-300">
                                {coin.price_change_percentage_24h >= 0 ? (
                                    <span className="text-green-500">{`▲ ${coin.price_change_percentage_24h.toFixed(2)}%`}</span>
                                ) : (
                                    <span className="text-red-500">{`▼ ${coin.price_change_percentage_24h.toFixed(2)}%`}</span>
                                )}
                            </td>
                            <td className="py-2 px-4">
                                <img
                                    src={coin.image}
                                    alt={coin.name}
                                    className="w-8 h-8 mx-auto rounded-full"
                                />
                            </td>
                            {/* Remove from watchlist button */}
                            <td className="py-2 px-4">
                                <button
                                    className="bg-red-500 text-white py-1 px-3 rounded"
                                    onClick={() => removeFromWatchlist(coin.id)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WatchlistPage;
