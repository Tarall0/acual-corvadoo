
const axios = require('axios');

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
        const lastChange = data.market_data.last_updated;
        const cryptopic = getCryptoImg(cryptoName);

        const embed = new MessageEmbed()
            .setTitle(`${name} (${symbol})`)
            .addField('Price (USD)', price, true)
            .addField('Last 24h Change', `${priceChange} (${priceChangePerc}%)`, true)
            .addField('Updated', lastChange, true)
            .setColor('#0099ff');
        
        return embed;
        
    } catch (error) {
        console.error('Failed to retrieve cryptocurrency information:', error);
        return 'Failed to retrieve cryptocurrency information';
    }
}

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


exports.modules = {getCryptoImg, getCryptoInfo};