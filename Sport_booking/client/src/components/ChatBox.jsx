//componente React che gestisce una chat in real time per una specifica partita

import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';   //importa un contesto personalizzato per la gestione dell'autenticazione dell'utente
import axios from 'axios';  //per richieste HTTP
import SendIcon from '@mui/icons-material/Send';  //importa icona per pulsante invia
import CloseIcon from '@mui/icons-material/Close';

export default function ChatBox({ matchId, closeChat }) {   //passiamo alla funzione matchID  e closeChat
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); //lista
  const [socket, setSocket] = useState(null);  //memorizza istanza sochet
  const { user } = useAuth(); //otteniamo oggetto utente dal contesto di autenticazione
  const messageContainerRef = useRef(null);  //creiamo un riferimento per il contenitore dei messaggi

  useEffect(() => {   //genera effetto per il recupero dei messaggi
    const fetchMessages = async () => { //creo funzione asincrona che effettua richiesta GET al server
      try {
        const response = await axios.get(`http://localhost:5000/api/messages/${matchId}`);  //recupera i messaggi esistenti dalla API al caricamento della componente o quando il matchId cambia
        setMessages(response.data);  //i messaggi recuperati sono messi nel vettore messages
      } catch (error) {
        console.error('Errore durante il recupero dei messaggi:', error);
      }
    };

    fetchMessages();   //invoca la funzione che ho definito, per inizialissare la chat con i messaggi gia esistenti quando il componente viene montato
  }, [closeChat, matchId]);

  
  useEffect(() => {
    const socketInstance = io('http://localhost:5000', {    //connette con funzione io il client al server 
      withCredentials: true,  
    });

    setSocket(socketInstance);

    if (matchId) {    //se ID partita è presente, l'utente si unisce alla stanza specifica
      socketInstance.emit('joinRoom', matchId);  
    }

    socketInstance.on('connect_error', (err) => {   //imposta un listener per questo evento, se si verifica un errore la funzione di callback sarà eseguita
      console.error('Errore di connessione:', err.message);
    });

    socketInstance.on('messaggio', (data) => {  //imposta un listener che si attiva quando un messaggio nella chat è inviato da un altro utente
      console.log('Risposta dal server:', data); // stampa i dati ricevuti nella console
      setMessages((prevMessages) => [...prevMessages, data]);  //aggiorna stato dei messaggi, prevMessages rappresenta stato attuale dei messaggi
    });

    return () => {
      socketInstance.disconnect();  //funzione di pulizia che viene eseguita quando il componente è smontato o cambia matchId
    };
  }, [matchId]);


  const sendMessage = () => {   //funzione che crea un oggetto newMessage e invia al serve tramite socket
    if (socket) {
      const newMessage = { text: message, user: user, matchId }
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit('messaggio', newMessage); //invio messaggio al socket
      console.log('Messaggio inviato:', newMessage);  
      setMessage('');  //svuota campo locale
    }
  };

  useEffect(() => {   //effetto che fa scorrere contenitore messaggi ogni volta che il numero dei messaggi cambia
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;    //current è una proprietà che contiene l'elemento DOM a cui il riferimento è attaccato
    }
  }, [messages]);   //cio si attiva quando array messages cambia, in questo modo la user experience migliora, perchè scrolla in automatico

  return (
    <div className='chatbox'>
      <div className='chatbox-header'>
        <h1>Chat</h1>
        <button onClick={closeChat} className="close-chat-button"> 
          <CloseIcon />
        </button>
      </div>
      <div className='message-container' ref={messageContainerRef}>
        <ul className='messages' >
          {messages.map((msg, index) => (
            <li key={index} className={msg.user === user ? 'sentMessage' : 'receivedMessage'}>
              <strong>{msg.user}:</strong> {msg.text}
            </li>
          ))}
        </ul>
      </div>
      <div className='chatbox-footer'>
        <textarea
          
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Scrivi un messaggio..."
        />
        <button onClick={sendMessage} disabled={message.trim().length === 0}><SendIcon /></button>
      </div>
    </div>
  );
};

