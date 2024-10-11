import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useResult } from '../context/ResultContext';

export default function RegistrationPanel() {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [favouriteSport, setFavouriteSport] = useState('Calcio');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { showAlert } = useResult();
    const navigate = useNavigate()

    const handleRegistration = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showAlert({
                severity: 'error',
                title: 'Errore!',
                message: 'Le password non corrispondono.',
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/users', {
                username,
                password,
                email,
                name,
                surname,
                birthDate,
                favouriteSport,
            });
            if(response.data.success) {
                showAlert({
                    severity: 'success',
                    title: 'Successo!',
                    message: 'Utente creato con successo!',
                    color: 'info',
                  });
                navigate('/loginPanel');    
            }

            
            
        } catch (error) {
            console.error(error);
            showAlert({
                severity: 'error',
                title: 'Errore!',
                message: 'Si è verificato un errore durante la registrazione.',
            });
        }
    };


    return (
        <div className="form-container">
            <h2>Registrazione</h2>
            <form onSubmit={handleRegistration}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Inserisci il tuo username"
                    />
                </div>
                <div className="form-group">
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Inserisci il tuo nome"
                    />
                </div>
                <div className="form-group">
                    <label>Cognome:</label>
                    <input
                        type="text"
                        value={surname}
                        onChange={(event) => setSurname(event.target.value)}
                        placeholder="Inserisci il tuo cognome"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">Data di nascita</label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="matchType">Sport Preferito</label>
                    <select
                        id="matchType"
                        value={favouriteSport}
                        onChange={(e) => setFavouriteSport(e.target.value)}
                        required
                    >
                        <option value="Calcio">Calcio</option>
                        <option value="Basket">Basket</option>
                        <option value="Beach Volley">Beach Volley</option>
                        <option value="Ping Pong">Ping Pong</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Inserisci la tua email"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Inserisci la tua password"
                    />
                </div>
                <div className="form-group">
                    <label>Conferma Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Conferma la tua password"
                    />
                </div>
                <button type="submit">Registrati</button>
            </form>
        </div>
    );
}
