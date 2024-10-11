import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
axios.defaults.withCredentials = true;

export default function LoginPanel() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  }

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Inserisci la tua password"
          />
        </div>
        <div className="form-group">
          <Link to="/signUpPanel" className="link">Non sei registrato? Registrati Qui!</Link>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}