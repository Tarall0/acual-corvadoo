const pokemonEmojis = {
    "Dratini": { emojiId: "1212771357474033734", description: "Un serpente con la pelle blu e il ventre bianco, sguardo dolce come una notte stellata" },
    "Psyduck": { emojiId: "1212464426381348934", description: "Una papera o a un ornitorinco con uno sguardo vagante e un po' confuso" },
    "Snorlax": { emojiId: "1212771313341694002", description: "Un pokemon grande e sonnacchioso che ama mangiare, dormire e abbracciare" },
    "Charmander": { emojiId: "1212771085393596466", description: "Una lucertola con una fiamma sulla punta della coda" },
    "Pikachu": { emojiId: "1212771122555260938", description: "Una pelliccia gialla e lunghe orecchie, scintillante come una notte di fuochi d'artificio" },
    "Bulbasaur": { emojiId: "1212771054397825056", description: "Una tartaruga con un fiore sul dorso, che emana un senso di serenità e armonia" },
    "Abra": { emojiId: "1212771203090096148", description: "Un piccolo psichico con un'enorme potenziale e una propensione a teletrasportarsi" },
    "Squirtle": { emojiId: "1212771164594638919", description: "Una piccola tartaruga blu con una coda a forma di ventaglio, amante dell'acqua e dei giochi d'acqua" },
    "Gastly": { emojiId: "1212771254386425857", description: "Uno spettro avvolto in nebbia viola, capace di trasformare la paura in forza" },
    "Bellsprout": { emojiId: "1212771227219922955", description: "Una pianta con un corpo sottile e una testa a forma di campana" },

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
