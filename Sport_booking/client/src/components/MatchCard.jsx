import React, { useState, useEffect } from "react";
import { useResult } from '../context/ResultContext';   //funzione usata per visualizzazione di avvisi o messaggi di feedback
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import ChatIcon from '@mui/icons-material/Chat';
import Chatbox from './ChatBox';
import Dialog from './Dialog';
import DeleteIcon from '@mui/icons-material/Delete';



export default function MatchCard(props) {
    const [imageSrc, setImageSrc] = useState('');
    const [showChat, setShowChat] = useState(false);
    const { showAlert } = useResult();
    const [isParticipating, setIsParticipating] = useState(null);
    const { userId } = useAuth();
    const [openDialog, setOpenDialog] = useState(false);


    const formattedDate = new Date(props.date).toLocaleDateString('it-IT', {  //creo oggetto che deve rispettare formattazione italiana
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    useEffect(() => {   //stesso effetto per creare il background del layout
        const fetchImage = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/image/images/${props.sport}`, {
                    responseType: 'blob' 
                });

                const imageUrl = URL.createObjectURL(response.data);
                setImageSrc(imageUrl);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();
    }, [props.imageName, props.sport]);  //array di dipendenze che fa rieseguire l'effetto se uno dei due valori cambia, senza dover fare inutili chiamate a API o calcoli 

    useEffect(() => {   //permette di eseguire effetti collaterali come chaimate API o aggiornamenti stato
        const checkParticipation = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/matches/user`);
                const userMatches = response.data.matches;
                
                const isParticipating = userMatches.some(match => match._id === props._id);  //verifica se id partita attuale coincide con quello presente nell'array di partite dell'utente
                setIsParticipating(isParticipating);
            } catch (error) {
                console.error('Error checking participation:', error);
            }
        };

        checkParticipation();
    }, [props.onMatchUpdate, props._id]);  //effetto eseguito ogni volta che viene rieseguito

    const handleJoin = async (e) => {
        e.preventDefault();  //impedisce comportamenti predefinito del browser quando clicco su unisciti a partita
        try {
            const response = await axios.post(`http://localhost:5000/api/matches/join`, { matchId: props._id });
        
            if (response.data.joined) {
                showAlert({
                    severity: 'success',
                    title: 'Successo!',
                    message: 'Iscritto al Match!',
                    color: 'info',
                });
                props.onMatchUpdate();   //aggiorna lo stato della partita
            } else {
                showAlert({
                    severity: 'error',
                    title: 'Errore!',
                    message: 'Non ancora autenticato',
                });
            }


        } catch (error) {
            console.error('Error joining match:', error.response ? error.response.data : error.message);
        }
    }

    const handleLeft = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/api/matches/leave`, { matchId: props._id });
            
            if (response.data.left) {
                showAlert({
                    severity: 'success',
                    title: 'Successo!',
                    message: 'Iscrizione cancellata con successo!',
                    color: 'info',
                });
                props.onMatchUpdate();
            }



        } catch (error) {
            console.error('Error joining match:', error.response ? error.response.data : error.message);
        }
    }

    //GESTIONE CHAT
    const toggleChat = () => {
        setShowChat(prevState => !prevState);   //inverte valore false dello stato
    }

    const closeChat = () => {
        setShowChat(false);
    };

    //GESTIONE DIALOG
    const handleDeleteClick = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/matches/delete/${props._id}`);
            showAlert({
                severity: 'success',
                title: 'Successo!',
                message: 'Match eliminato con successo!',
                color: 'info',

            });
            props.onMatchUpdate();
        } catch (error) {
            showAlert({
                severity: 'error',
                title: 'Errore!',
                message: 'Errore durante l\'eliminazione del match.',
            });
            console.error('Error deleting match:', error.response ? error.response.data : error.message);
        } finally {
            setOpenDialog(false);
        }
    };



    return (
        <div>
            <div key={props._id} className="card">

                <div className="card-content-left">
                    {imageSrc && <img src={imageSrc} alt="Event" className="card-image" />}
                    <div className="card-buttons">
                        {userId === props.creator ? (<button className="delete-button" onClick={handleDeleteClick} ><DeleteIcon /></button>) : null}
                        {isParticipating ? (
                            <>
                                <button onClick={toggleChat} className="chat-toggle-button">
                                    <ChatIcon /> {showChat ? 'Chiudi Chat' : 'Apri Chat'}
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
                <div className="card-content-right">
                    <div className="card-body">
                        <h2>{props.title}</h2>
                        <p><GroupOutlinedIcon /> {props.partecipants.length}/{props.maxParticipants}</p>
                        <p>
                            {props.sport}</p>
                        <p>Data: {formattedDate}</p>
                    </div>

                    {isParticipating ? (
                        <>
                            <button type="submit" onClick={handleLeft} style={{ backgroundColor: 'red' }}><PersonRemoveOutlinedIcon />Abbandona</button>
                        </>
                    ) : (<button type="submit" onClick={handleJoin}><PersonAddAltOutlinedIcon /> Partecipa</button>
                    )}
                </div>
            </div>
            {showChat && <Chatbox matchId={props._id} closeChat={closeChat} />}

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmDelete}
                title="Conferma Eliminazione Match"
                description="Sei sicuro di voler eliminare questo match? L'operazione non può essere annullata."
            />
        </div>
    );
}