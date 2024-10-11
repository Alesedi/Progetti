const express = require('express');
const { createServer } = require('node:http'); //importa funzione crea server dal modulo HTTP da Node.js
const { Server } = require('socket.io');  //importa classe server da Socket.io per la comunicazione real time
const cookieParser = require('cookie-parser'); //importa middleware per il parsing del cookie
const mongoose = require('mongoose');
const cors = require('cors');  //importa middleware cors per gestire richieste incrociate
require('dotenv').config();   //carica variabili d'ambiente dal file .env

//importa tutti i router necessari per le rotte dell'applicazione
const matchRoutes = require('./routes/matches');
const userRoutes = require('./routes/user');
const loginRoutes = require('./routes/login');
const imageRoutes = require('./routes/image');
const messagesRoutes = require('./routes/message')

const Message = require('./models/messageModel');

const app = express();  //crea app express
const server =createServer(app)   // crea server HTTP passando app come parametro
const io = new Server(server,{    //inizializza socket.io con il server
  connectionStateRecovery: {},
  cors: {
    origin: 'http://localhost:3000', // Permetti solo questa origine
    methods: ['GET', 'POST'],
    credentials: true // Permetti credenziali
  }
});

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000', // Allow this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Adjust methods as needed
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
  }));

//monta le rotte API
app.use('/api/matches', matchRoutes);
app.use('/api/users',userRoutes); 
app.use('/api/login',loginRoutes); 
app.use('/api/image',imageRoutes); 
app.use('/api/messages',messagesRoutes);



const path = "mongodb+srv://utenteProva:utenteProva123@cluster0.3iblz3a.mongodb.net/matches?retryWrites=true&w=majority&appName=Cluster0"  //stringa di connessione con mongodb
const PORT= process.env.PORT || 5000;  //porta del server usando la variabile d'ambiente

io.on('connection', (socket) => {
  console.log('Un utente si è connesso tramite WebSocket');   //allora effetua callback
  
  socket.on('joinRoom', (matchId) => {
    console.log(`Un utente si è unito alla stanza del match: ${matchId}`);
    socket.join(matchId);  // L'utente entra nella room specifica per il match
  });

  // Gestione di eventi personalizzati (come "messaggio" o "disconnect") salvato nel database e broadcast a tutti gli utenti nella room specifica
  socket.on('messaggio', async (data) => {
    const { matchId, text, user } = data;
    const newMessage = new Message({ matchId : matchId, text:text, user:user });
    await newMessage.save();

    socket.broadcast.to(matchId).emit('messaggio',{ text, user } );
      
  });

  socket.on('disconnect', () => {  
    console.log('Utente disconnesso');
  });
});

mongoose.connect(path).then(()=>console.log('Connected to MongoDB'))  //connette mongoose al path di mongoDB
.then(()=>server.listen(PORT , ()=>console.log(`Server running on port ${PORT}`))) //avvisa il serve sulla porta 5000 con messaggio
 .catch((err)=>console.log(err.message));   //gestisce eventuali errori