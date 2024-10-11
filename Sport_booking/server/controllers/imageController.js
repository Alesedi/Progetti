const Image = require('../models/imageModel');    //dichiarazione che importa il modello Image

// RECUPERA IMMAGINE DAL SERVER
const getImageByName = async (req, res) => {      //definisce funzione asincrona che recupera dal serber una immagine in base al nome passato dalla richiesta
    try {
        const imageName = req.params.name;      //imageName = indica che sto associando a imageName il nome dell'immagine che il server deve recuperare
        const image = await Image.findOne({ name: imageName }); //awai indica che la ricerca avviene in modo asincrono, cerca nel database un documento la cui proprietà name corrisponde al valore imageName

        if (!image) {    //se immagine non è estratta restituisce risposta hhtp 404 e mess di errore
            return res.status(404).send('Image not found');
        }

        res.setHeader('Content-Type', image.contentType);  //restituisce intestazione della risposta HTTP in base al tipo di contenuto dell'immagine , se è jpg, png
        res.status(200).send(image.data); //invia risposta 200 e contenuto binario dell'immagine
    } catch (error) {
        res.status(500).send('Server error');
    }
};

module.exports = { getImageByName };
