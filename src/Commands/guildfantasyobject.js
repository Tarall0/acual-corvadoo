const objects = {
    "Spada di Metallo": { emoji: "🗡️", description: "Una spada di metallo", rarity: "Comune", price: 1 },
    "Scudo Divino": { emoji: "🛡️", description: "Uno scudo dorato", rarity: "Raro", price: 2 },
    "Fungo Magico": { emoji: "🍄", description: "Un fungo magico della foresta", rarity: "Epico", price: 5 },
    "Palla di Cristallo": { emoji: "🔮", description: "Una palla di cristallo", rarity: "Epico", price: 6 },
    "Collana Misteriosa": { emoji: "📿", description: "Una collana misteriosa", rarity: "Raro", price: 2 },
    "Amuleto del Drago": { emoji: "🐉", description: "Un amuleto che concede il respiro di un drago", rarity: "Leggendario", price: 15 },
    "Amuleto del Tempo": { emoji: "⏳", description: "Un amuleto che controlla il tempo stesso", rarity: "Leggendario", price: 18 },
    "Piuma di falco": { emoji: "🪶", description: "Una piuma di un falco", rarity: "Comune", price: 1 },
    "Pozione della Guarigione": { emoji: "🧪", description: "Una pozione che cura le ferite", rarity: "Comune", price: 3 },
    "Bacchetta Magica": { emoji: "🪄", description: "Una bacchetta che canalizza la magia", rarity: "Comune", price: 3 },
    "Anello Magico": { emoji: "💍", description: "Un anello magico, cosa potrà fare?", rarity: "Comune", price: 4 },
    "Elisir della Forza": { emoji: "💪", description: "Un elisir che aumenta la forza fisica", rarity: "Comune", price: 3 },
    "Boomerang": { emoji: "🪃", description: "Un boomerang", rarity: "Comune", price: 1 },
    "Mjöllnir": { emoji: "🔨", description: "Il martello del dio Thor", rarity: "Epico", price: 15 },
    "Corona di Diamanti": { emoji: "👑", description: "Una corona adornata di diamanti", rarity: "Raro", price: 8 },
    "Bussola del Destino": { emoji: "🧭", description: "Una bussola che guida il suo possessore al suo destino", rarity: "Epico", price: 10 },
};



module.exports = {
    discoverTreasure: function discoverTreasure(){
        const rarityWeights = {
            "Comune": 70,
            "Raro": 36,
            "Epico": 12,
            "Leggendario": 2
        };

        let totalWeight = 0;
        for (const obj of Object.values(objects)) {
            totalWeight += rarityWeights[obj.rarity];
        }

        let randomNumber = Math.floor(Math.random() * totalWeight);
        let currentWeight = 0;

        for (const [name, obj] of Object.entries(objects)) {
            currentWeight += rarityWeights[obj.rarity];
            if (randomNumber < currentWeight) {
                return {
                    name: name,
                    emoji: obj.emoji,
                    description: obj.description,
                    rarity: obj.rarity
                };
            }
        }
    },

    getObjectInfo: function getObjectInfo(treasureEmoji) {
        // Iterate through each object
        for (const [name, obj] of Object.entries(objects)) {
            // Check if the provided emoji matches the object's emoji
            if (obj.emoji === treasureEmoji) {
                // Return the treasure information
                return {
                    name: name,
                    emoji: obj.emoji,
                    description: obj.description,
                    rarity: obj.rarity,
                    price: obj.price,
                };
            }
        }
        // If no match found, return null or handle accordingly
        return null;
    }
};