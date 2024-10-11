import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useResult } from '../context/ResultContext';
axios.defaults.withCredentials = true;

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { showAlert } = useResult();
  const navigate = useNavigate()



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      showAlert({
        severity: 'error',
        title: 'Errore!',
        message: 'Le password non corrispondono!',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login/changePassword', {
        currentPassword,
        newPassword
      });

      if (response.data.success) {
        showAlert({
          severity: 'success',
          title: 'Successo!',
          message: 'Password cambiata con successo!',
          color: 'info',
        });
        navigate("/"); 
      }
    } catch (error) {

      showAlert({
        severity: 'error',
        title: 'Errore!',
        message: 'Errore durante il cambio della password',
      });
    }
  }

  return (
    <div className="form-container">
      <h2>Cambio Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Password Attuale:</label>
          <input
            type="text"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Inserisci il tuo username"
          />
        </div>
        <div className="form-group">
          <label>Nuova Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="Inserisci la tua password"
          />
        </div>
        <div className="form-group">
          <label>Conferma Nuova Password:</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(event) => setConfirmNewPassword(event.target.value)}
            placeholder="Inserisci la tua password"
          />
        </div>

        <button type="submit">Cambia</button>
      </form>
    </div>
  );
}