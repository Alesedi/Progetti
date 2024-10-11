import React, { useState, useEffect } from 'react';
import MatchCard from '../components/MatchCard'
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function SubscribedMatches() {


  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();


  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/matches/user`);
        setMatches(response.data.matches);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Errore nel caricamento dei dati: {error.message}</div>;
  }



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
    />
  ));


  return (
    <div className="home-container">
      <header className="home-header">
        <h1>ECCO I MATCH A CUI SEI ISCRITTO {user.toUpperCase()}!</h1>
      </header>
      <main className="home-main">
        <div className='match-cards'>
          {matchCards}
        </div>

      </main>
    </div>
  );
};
