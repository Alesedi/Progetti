import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useResult } from '../context/ResultContext';


export default function NewGamePanel() {
  const [sport, setSport] = useState('Calcio');
  const [date, setDate] = useState('');
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const { user } = useAuth();
  const { showAlert } = useResult();



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/matches', { sport, title, date });
      showAlert({
        severity: 'success',
        title: 'Successo!',
        message: 'Match creato con successo!',
        color: 'info',
      });
      navigate('/');
    } catch (error) {
      console.error(error);
      showAlert({
        severity: 'error',
        title: 'Errore!',
        message: 'Si è verificato un errore durante la creazione del match.',
    });
    }
  };

  return (
    <div id="main-content">
      <div className="form-container">
        <h2>Crea una nuova partita</h2>
        <form onSubmit={handleSubmit} className="create-match-form">
          <div className="form-group">
            <label htmlFor="date">Data</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Inserisci il titolo"
            />
          </div>
          <div className="form-group">
            <label htmlFor="matchType">Tipo di Match</label>
            <select
              id="matchType"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              required
            >
              <option value="Calcio">Calcio</option>
              <option value="Basket">Basket</option>
              <option value="Beach Volley">Beach Volley</option>
              <option value="Ping Pong">Ping Pong</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Creatore</label>
            <div value={user}>{user}</div>
          </div>
          <div className="form-submit">
            <button type="submit">Crea</button>
          </div>
        </form>
      </div>
    </div>
  );
};

