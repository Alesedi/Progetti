import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useResult } from '../context/ResultContext';
import Dialog from '../components/Dialog'
import { useAuth } from '../context/AuthContext';
axios.defaults.withCredentials = true;

export default function DeleteAccount() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const { showAlert } = useResult();
  const { logout } = useAuth();

  const navigate = useNavigate()



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/delete', {
        currentPassword,
      });

      if (response.data.success) {
        showAlert({
          severity: 'success',
          title: 'Successo!',
          message: 'Account eliminato con successo!',
          color: 'info',
        });
        await logout();
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

  const handleDeleteClick = (e) => {
    e.preventDefault();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  return (
    <div className="form-container">
      <h2>Conferma Eliminazione</h2>
      <form onSubmit={handleDeleteClick}>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Inserisci la tua password"
          />
        </div>


        <button type="submit">Elimina</button>
      </form>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleSubmit}
        title="Conferma Eliminazione Account"
        description="Sei sicuro di voler eliminare questo account? L'operazione non può essere annullata."
      />
    </div>
  );
}