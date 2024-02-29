const pokemonEmojis = {
    "Dratini": { emojiId: "1212464376221532284", description: "Un serpente con la pelle blu e il ventre bianco, sguardo dolce come una notte stellata" },
    "Psyduck": { emojiId: "1212464426381348934", description: "Una papera o a un ornitorinco con uno sguardo vagante e un po' confuso" },
    "Snorlax": { emojiId: "1205820190718431292", description: "Un pokemon grande e sonnacchioso che ama mangiare, dormire e abbracciare" },
    "Charmander": { emojiId: "1212529158811295764", description: "Una lucertola con una fiamma sulla punta della coda" },
    "Pikachu": { emojiId: "1212529423715139668", description: "Una pelliccia gialla e lunghe orecchie, scintillante come una notte di fuochi d'artificio" }
    // Add more Pokémon with their respective emoji IDs and descriptions
};

module.exports = {
    
    getRandomPokemon: function getRandomPokemon(client){
    const pokemonList = Object.keys(pokemonEmojis);
    const randomPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
    const { emojiId, description } = pokemonEmojis[randomPokemon];
    const emoji = client.emojis.cache.get(emojiId);
    return { pokemon: randomPokemon, emoji: emoji, description: description };
    },

    getPokemonDescription: function getPokemonDescription(pokemonName) {
        const pokemon = pokemonEmojis[pokemonName];
        if (pokemon) {
            return pokemon.description;
        } else {
            return "Non hai ancora catturato un pokemon, digita !pokemon";
        }
    }
}
