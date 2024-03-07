const merchants = {
    "merchant1": {
        name: "Mage Merchant", 
        emojiId: "1214170388595216404", 
        description: "Un misterioso mago in cerca di tesori",
        paragraph: "*Sembra essere un potente mago alla ricerca di qualcosa in particolare*",
        searches: [
            "Leggendario",
            "Epico",
        ]
    },

    "merchant2": {
        name: "Monk Merchant", 
        emojiId: "1214176424840400937", 
        description: "Un monaco servitore del dio Hakiyah",
        paragraph: "*Un individuo calmo e pacato, il dio Hakiyah è conosciuto come il dio dell'onestà*",
        searches: [
            "Leggendario",
            "Epico",
            "Raro",
            "Comune"
        ]
    },

    "merchant3": {
        name: "Crusader Merchant", 
        emojiId: "1214348888081956917", 
        description: "Un paladino devoto al dio Pelor",
        paragraph: "*Un uomo alto e possente dotato di armatura. Il dio Pelor è la divinità della luce, del sole, della guarigione*",
        searches: [
            "Epico",
            "Raro"
        ]
    }
};

function getRandomMerchant() {
    const keys = Object.keys(merchants);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const merchant = merchants[randomKey];

    return merchant;
}

module.exports = { getRandomMerchant, merchants}