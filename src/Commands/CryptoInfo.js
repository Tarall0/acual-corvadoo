const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

async function getCryptoImg(cryptoName) {
    try {
        const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoName}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        const img = data.image.small;

        return img;
    } catch (error) {
        console.error('Failed to retrieve cryptocurrency image:', error);
        return 'Failed to retrieve cryptocurrency image';
    }
}

async function getCryptoInfo(cryptoName) {
    try {
        const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoName}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        const name = data.name;
        const symbol = data.symbol;
        const price = data.market_data.current_price.usd;
        const priceChange = data.market_data.price_change_24h;
        const priceChangePerc = data.market_data.price_change_percentage_24h;
        const lastChangeTimestamp = data.market_data.last_updated;
        // Convert timestamp to a more user-friendly format
        const lastChange = new Date(lastChangeTimestamp).toLocaleString();
        const cryptopic = await getCryptoImg(cryptoName);
        
        return {name, symbol, price, priceChange, priceChangePerc, lastChange, cryptopic};
        
    } catch (error) {
        console.error('Failed to retrieve cryptocurrency information:', error);
        return 'Failed to retrieve cryptocurrency information';
    }
}

module.exports = getCryptoInfo;
