const objects = {
    "Spada di Metallo": { emoji: "🗡️", description: "Una spada di metallo", rarity: "Comune" },
    "Scudo Divino": { emoji: "🛡️", description: "Uno scudo dorato", rarity: "Raro" },
    "Fungo Magico": { emoji: "🍄", description: "Un fungo magico della foresta", rarity: "Epico" },
    "Palla di Cristallo": { emoji: "🔮", description: "Una palla di cristallo", rarity: "Epico" },
    "Collana Misteriosa": { emoji: "📿", description: "Una collana misteriosa", rarity: "Raro" },
    "Amuleto del Drago": { emoji: "🐉", description: "Un amuleto che concede il respiro di un drago", rarity: "Leggendario" },
    "Amuleto del Tempo": { emoji: "⏳", description: "Un amuleto che controlla il tempo stesso", rarity: "Leggendario" },
    "Piuma di falco": { emoji: "🪶", description: "Una piuma di un falco", rarity: "Comune" },
    "Pozione della Guarigione": { emoji: "🧪", description: "Una pozione che cura le ferite", rarity: "Comune" },
    "Bacchetta Magica": { emoji: "🪄", description: "Una bacchetta che canalizza la magia", rarity: "Comune" },
    "Anello Magico": { emoji: "💍", description: "Un anello magico, cosa potrà fare?", rarity: "Comune" },
    "Elisir della Forza": { emoji: "💪", description: "Un elisir che aumenta la forza fisica", rarity: "Comune" },
    "Boomerang": { emoji: "🪃", description: "Un boomerang", rarity: "Comune" },
    "Mjöllnir": { emoji: "🔨", description: "Il martello del dio Thor", rarity: "Epico" },
    "Corona di Diamanti": { emoji: "👑", description: "Una corona adornata di diamanti", rarity: "Raro" },
    "Bussola del Destino": { emoji: "🧭", description: "Una bussola che guida il suo possessore al suo destino", rarity: "Epico" },
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
    }
};