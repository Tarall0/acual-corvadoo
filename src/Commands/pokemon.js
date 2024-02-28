const pokemonEmojis = {
    "Dratini": "1212464376221532284",
    "Psyduck": "1212464426381348934",
    "Snorlax": "1205820190718431292"
    //to add more

};

module.exports = function getRandomPokemon(client){
    const pokemonList = Object.keys(pokemonEmojis);
    const randomPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
    const emojiId = pokemonEmojis[randomPokemon];
    const emoji = client.emojis.cache.get(emojiId);
    return { pokemon: randomPokemon, emoji: emoji };
}
