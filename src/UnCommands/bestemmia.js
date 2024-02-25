const dio = [
    "Dio",
    "Madonna",
    "Maometto",
    "Jehovah",
    "iddio",
    "dio",
    "Allah",
];

const agg = [
    "ladro",
    "cane",
    "ornitorinco",
    "colorato",
    "imbalsamato",
    "nosferatu",
    "incalanatore di insulti",
    "inchiodato",
    "vandalo",
    "porco",
    "Onlyfanser che manda i santini porno a tutti i santi del paradiso."
]

module.exports = function bestemmia(){

    const randio = dio[Math.floor(Math.random() * dio.length)];
    const randagg = agg[Math.floor(Math.random() * agg.length)];

    return `${randio} ${randagg}`;
};