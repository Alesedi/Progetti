import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useResult } from '../context/ResultContext'
axios.defaults.withCredentials = true;    //gestisce i cookie di sessione nelle richieste

export default function NewGameButton() {
  const { showAlert } = useResult();
  const navigate = useNavigate()


  const handleNewGame = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get('http://localhost:5000/api/login');
      if (response.data.authenticated) {    //se utente è autenticato vai a new game panel
        navigate('/newGamePanel');   
      }
      else {
        showAlert({
          severity: 'error',
          title: 'Errore!',
          message: 'Non ancora autenticato',
        });
        navigate('/loginPanel');
      }

    } catch (error) {
      console.error('Errore durante il controllo dell\'autenticazione', error);
    };
  }

  return (
    <footer>
      <button className="new-game-button" onClick={handleNewGame}>
        <span className="icon">+</span>
        <span className="text">Nuova partita</span>
      </button>
    </footer>
  );
};
