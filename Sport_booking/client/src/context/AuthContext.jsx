import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useResult } from './ResultContext';

const AuthContext = createContext();  //creo contesto chiamato AuthContext

export const useAuth = () => useContext(AuthContext);  //creo oggetto useAuth che esporterò

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);  //indica se utente è autenticato 
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const { showAlert } = useResult();
  const navigate = useNavigate()


  // Funzione di login
  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password }, { withCredentials: true });
      if (res.data.success) {
        setIsAuthenticated(true);
        setUser(res.data.username);
        setUserId(res.data._id);
        showAlert({
          severity: 'success',
          title: 'Successo!',
          message: 'Login eseguto con successo!',
          color: 'info',
        });
        navigate('/')
      }
    } catch (error) {
      console.error('Errore durante il login:', error);
      showAlert({
        severity: 'error',
        title: 'Errore!',
        message: 'Problema nel Login',

      });
    }
  };

  // Funzione di logout
  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/login/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  // Verifica l'autenticazione all'avvio dell'app
  const checkAuth = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/login', { withCredentials: true });
      if (res.data.authenticated) {
        setIsAuthenticated(true);
        setUser(res.data.user.username);
        setUserId(res.data.user._id)

      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Errore durante la verifica dell\'autenticazione:', error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth(); 
  }, []);

  return (  // rende disponibili,tramite provider, a tutti i figli, le informzioni e le funzioni di autenticazione tramite il contesto
    <AuthContext.Provider value={{ isAuthenticated, user, userId, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};