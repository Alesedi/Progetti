// MovieItem.jsx
import React from 'react';
import StarIcon from '@mui/icons-material/Star';

export default function FilmCard({ movie, isHidden, isCompact }) {
  return (
    <div className={`movie-item ${isCompact ? 'compact' : ''}`}>
      <div className="movie-left">
        <h2>{movie.title}</h2>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={`${movie.title} Poster`}
          width={isCompact ? '100' : '200'} // Dimensione dell'immagine modificata in modalità compatta
        />
        <p>
          <StarIcon style={{ color: 'yellow' }} />: {movie.rating.toFixed(2)}
        </p>
      </div>
      {!isHidden && !isCompact && ( // Mostra la descrizione solo se non in modalità compatta
        <div className="movie-right">
          {movie.overview}
        </div>
      )}
    </div>
  );
}


