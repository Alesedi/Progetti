import React, { useState, useEffect } from 'react';
import MatchCard from '../components/MatchCard'
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Home() {


  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sportFilter, setSportFilter] = useState('');
  const { user } = useAuth();


  const matchRefresh = async () => {
    let url = 'http://localhost:5000/api/matches';
    if (sportFilter) url += `${sportFilter}`; 

    try {
      const response = await axios.get(url);
      setMatches(response.data.matches);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    matchRefresh();
  }, [sportFilter]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Errore nel caricamento dei dati: {error.message}</div>;
  }

  const handleFilterClick = (sport) => {
    setSportFilter(sport); 
  };

  const matchCards = matches.map(match => (
    <MatchCard
      key={match._id}
      _id={match._id}
      title={match.title}
      sport={match.sport}
      date={match.date}
      creator={match.creator}
      partecipants={match.partecipants}
      maxParticipants={match.maxParticipants}
      image={match.image}
      onMatchUpdate={matchRefresh}
    />
  ));


  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className='welcome'>Benvenuto alla Home Page {user || ''}!</h1>
      </header>
      <main className="home-main">
        <div className="filter-buttons">
          <button onClick={() => handleFilterClick('/sport/Calcio')}>Calcio</button>
          <button onClick={() => handleFilterClick('/sport/Basket')}>Basket</button>
          <button onClick={() => handleFilterClick('/sport/Ping Pong')}>Ping Pong</button>
          <button onClick={() => handleFilterClick('/sport/Beach Volley')}>Beach Volley</button>
          <button onClick={() => handleFilterClick('')}>Tutti gli Sport</button> {/* Reset filtro */}
        </div>
        <div className='match-cards'>
          {matchCards}
        </div>

      </main>
    </div>
  );
};