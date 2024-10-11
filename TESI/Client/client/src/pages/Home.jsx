import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieItem from '../components/FilmCard';
import { useAuth } from '../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress'; 

export default function FilmRatings() {
  const [recommendations, setRecommendations] = useState([]); // Stato per memorizzare le raccomandazioni
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { logout, test, isAuthenticated, userId, loading } = useAuth();
  const [viewMode, setViewMode] = useState(test?.visualization || 'scroll'); // Aggiungi la nuova modalità qui

  useEffect(() => {
    if (test) {
      setViewMode(test.visualization);
    }
  }, [test]);

  // Funzione per chiamare l'API Flask per le raccomandazioni
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userId || !test) {
        console.log('Aspettando userId e test...');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/recommendations', {
          params: { user_id: userId, test_id: test.id },
        });
        setRecommendations(response.data);
      } catch (err) {
        setError('Errore durante il recupero dei dati delle raccomandazioni');
        console.error(err);
      }
    };

    fetchRecommendations();
  }, [userId, test]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  const nextMovie = () => {
    if (currentIndex < recommendations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevMovie = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentBackdropPath =
    recommendations[currentIndex]?.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${recommendations[currentIndex].backdrop_path}`
      : '';

  const containerStyle = {
    backgroundImage: viewMode === 'scroll' && currentBackdropPath ? `url(${currentBackdropPath})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '20px',
    transition: 'background-image 0.5s ease-in-out',
  };

  return (
    <div>
      <h1>Raccomandazioni di Film</h1>

      {error && <p>{error}</p>}

      {loading ? (
        <p>Caricamento delle raccomandazioni...</p>
      ) : recommendations.length === 0 && !error ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress color='primary' />  {/* Spinner di caricamento */}
        </div>
      ) : (
        <>
          <div className="toggle-button-container">
            <button onClick={handleLogout}>Logout</button>
          </div>

          {viewMode === 'scroll' ? (
            <div className="movie-container" style={containerStyle}>
              <MovieItem movie={recommendations[currentIndex]} />

              <div className="navigation-buttons">
                <button onClick={prevMovie} disabled={currentIndex === 0}>
                  Precedente
                </button>
                <button onClick={nextMovie} disabled={currentIndex === recommendations.length - 1}>
                  Successivo
                </button>
              </div>
            </div>
          ) : viewMode === 'list' ? (
            <div className="movie-list">
              {recommendations.map((movie, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <MovieItem key={index} movie={movie} isHidden={hoveredIndex !== index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="genres-container">
              {Object.entries(recommendations).map(([genre, movies]) => (
                <div key={genre} className="genre-section">
                  <h2>{genre}</h2>
                  <div className="movie-row">
                    {movies.map((movie, index) => (
                      <MovieItem key={index} movie={movie} isCompact={viewMode === 'lines'} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
