const gifs = [
    "https://tenor.com/view/thor-avenger-chris-hemsworth-mjolnir-gif-13624915", 
    "https://media1.tenor.com/m/S3X935VRH3YAAAAd/thor-avengers.gif",
    "https://media1.tenor.com/m/b7CsixwqbWwAAAAC/hulk-punch.gif",
    "https://media1.tenor.com/m/ZIowZJymZaIAAAAC/harry-potter-dumbledore.gif"
]


module.exports = function strike(){

    const randomgif = Math.floor(Math.random() * gifs.length);
    const gifUrl = gifs[randomgif];

    return(gifUrl);
};