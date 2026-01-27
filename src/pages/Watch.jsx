import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { tmdb, IMG } from "../api/tmdb";
import TrailerModal from "../components/TrailerModal";
import "../styles/watch.css";

const Watch = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [providers, setProviders] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    fetchWatchData();
  }, [id]);

  const fetchWatchData = async () => {
    try {
      const movieRes = await tmdb.get(`/movie/${id}`);
      const videoRes = await tmdb.get(`/movie/${id}/videos`);
      const providerRes = await tmdb.get(`/movie/${id}/watch/providers`);

      setMovie(movieRes.data);
      setVideos(videoRes.data.results);
      setProviders(providerRes.data.results?.IN);
    } catch (err) {
      console.log(err);
    }
  };

  if (!movie) return null;

  const trailer = videos.find(v => v.type === "Trailer");

  return (
    <div className="watch-page">

      {/* BACKDROP */}
      <div
        className="watch-backdrop"
        style={{
          backgroundImage: `url(${IMG + movie.backdrop_path})`,
        }}
      >
        <div className="watch-overlay"></div>
      </div>

      {/* CONTENT */}
      <div className="watch-content">

        <img
          className="watch-poster"
          src={IMG + movie.poster_path}
          alt={movie.title}
        />

        <div className="watch-info">
          <h1>{movie.title}</h1>

          <div className="watch-meta">
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
            <span>📅 {movie.release_date?.slice(0, 4)}</span>
            <span>⏱ {movie.runtime} min</span>
          </div>

          <p>{movie.overview}</p>

          {/* TRAILER */}
          {trailer && (
            <button
              className="watch-trailer-btn"
              onClick={() => setTrailerKey(trailer.key)}
            >
              ▶ Watch Trailer
            </button>
          )}

          {/* PROVIDERS */}
          {providers?.flatrate && (
            <div className="watch-providers">
              <h3>Available On</h3>

              <div className="provider-list">
                {providers.flatrate.map(p => (
                  <a
                    key={p.provider_id}
                    href={p.link || "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={IMG + p.logo_path}
                      alt={p.provider_name}
                      title={p.provider_name}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TRAILER MODAL */}
      {trailerKey && (
        <TrailerModal
          trailerKey={trailerKey}
          onClose={() => setTrailerKey(null)}
        />
      )}
    </div>
  );
};

export default Watch;
