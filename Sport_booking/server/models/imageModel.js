const mongoose = require('mongoose'); //mongoose facilita modellazione di oggetti MongoDB in javascript

const imageSchema = new mongoose.Schema({     //specifica la struttura con cui verranno memorizzati i dati nel DB
    name: { type: String, required: true },   //nome dell'immagine
    data: { type: Buffer, required: true },   //dati binari
    contentType: { type: String, required: true },   //tipo di contenuto(jpg,png)
});


module.exports = mongoose.model('Image', imageSchema);   //esporta il modello Image basato sullo schema imageSchema, tale modello sarà usato per svolgere operazioni CRUD