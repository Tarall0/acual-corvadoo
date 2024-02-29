const objects = {
    "Metal Sword": { emoji: "🗡️", description: "Una spada di metallo", rarity: "common" },
    "Divine Shield": { emoji: "🛡️", description: "Uno scudo dorato", rarity: "rare" },
    "Magic Mushroom": { emoji: "🍄", description: "Un magico fungo dalla foresta", rarity: "legendary" },
    "Crystal Ball": { emoji: "🔮", description: "Una sfera di cristallo", rarity: "legendary" },
    "Collana Misteriosa": { emoji: "📿", description: "Uno strano gioiello", rarity: "rare" }

    
    // Add more objects with different rarities
};

module.exports = {
    discoverTreasure: function discoverTreasure(){
        const objectList = Object.keys(objects);
        const randomObjectName = objectList[Math.floor(Math.random() * objectList.length)];
        const randomObject = objects[randomObjectName];
        
        return { 
            name: randomObjectName,
            emoji: randomObject.emoji,
            description: randomObject.description,
            rarity: randomObject.rarity
        };
    }
};
