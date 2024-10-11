import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';  //gestisce avvisi
import Alert from '@mui/material/Alert';

const ResultContext = createContext();


export const ResultProvider = ({ children }) => {  //componente che gestisce lo stato dell'avviso e fornisce funzioni per mostrarlo o nasconderlo
  const [alert, setAlert] = useState({
    severity: '',
    title: '',
    message: '',
    show: false,
    position: { vertical: 'top', horizontal: 'center' },
    color: '',  
  });

  const showAlert = ({ severity, title, message, position = { vertical: 'top', horizontal: 'right' }, color = 'error' }) => {  //funzione che aggiorna lo stato dell'avviso
    setAlert({
      severity,
      title,
      message,
      show: true,
      position,
      color,
    });
  };

  const hideAlert = () => {    //funzione che chiude l'avviso aggiornando llo stato
    setAlert((prevAlert) => ({
      ...prevAlert,
      show: false,
    }));
  };

  return (
    <ResultContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}

      <Snackbar   
        open={alert.show}   //determiba se il SNackbar è visibile o meno
        autoHideDuration={4000} 
        onClose={hideAlert}   //Snackbar chiuso o dopo il 4 secondi o alla chiusura dell'utente
        anchorOrigin={alert.position}  
      >  
        <Alert variant="filled" onClose={hideAlert} color={alert.color} severity={alert.severity}>
          <strong>{alert.title}</strong> — {alert.message}   
        </Alert>  
      </Snackbar>
    </ResultContext.Provider>
  );
};

//alert può aver colore diverso se è success, error, info o warning 

export const useResult = () => {
  return useContext(ResultContext);
};