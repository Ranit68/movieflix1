import React from "react";
import { IMG } from "../api/tmdb";
import "../styles/movieCard.css";

const MovieCard = ({ movie, onClick }) => {
  const title = movie.title || movie.name;
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);

  return (
    <div className="movie-card" onClick={onClick}>
      
      <div className="movie-poster">
        {movie.poster_path ? (
          <img
            src={IMG + movie.poster_path}
            alt={title}
            loading="lazy"
          />
        ) : (
          <div className="no-poster">No Image</div>
        )}
      </div>

      <div className="movie-info">
        <h4 className="movie-title">{title}</h4>

        <div className="movie-meta">
          <span className="movie-year">{year}</span>
          <span className="movie-rating">
            ⭐ {movie.vote_average?.toFixed(1)}
          </span>
        </div>
      </div>

    </div>
  );
};

export default MovieCard;
