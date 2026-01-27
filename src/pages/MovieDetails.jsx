import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { tmdb, IMG } from "../api/tmdb";
import TrailerModal from "../components/TrailerModal";
import "../styles/details.css";

// Simple skeleton components for loading
const SkeletonPoster = () => <div className="skeleton skeleton-poster"></div>;
const SkeletonText = ({ width = "100%" }) => <div className="skeleton skeleton-text" style={{ width }}></div>;
const SkeletonCast = () => <div className="skeleton skeleton-cast"></div>;

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();

  // Detect type
  const isTV = location.pathname.startsWith("/tv");

  const [data, setData] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [providers, setProviders] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const type = isTV ? "tv" : "movie";

      const [detailsRes, castRes, videoRes, providerRes] = await Promise.all([
        tmdb.get(`/${type}/${id}`),
        tmdb.get(`/${type}/${id}/credits`),
        tmdb.get(`/${type}/${id}/videos`),
        tmdb.get(`/${type}/${id}/watch/providers`)
      ]);

      setData(detailsRes.data);
      setCast(castRes.data.cast);
      setVideos(videoRes.data.results);
      setProviders(providerRes.data.results?.IN);
    } catch (err) {
      setError("Failed to load details. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-backdrop skeleton-backdrop"></div>
        <div className="details-content">
          <SkeletonPoster />
          <div className="info">
            <SkeletonText width="80%" />
            <SkeletonText width="60%" />
            <SkeletonText width="100%" />
            <div className="genres">
              <SkeletonText width="20%" />
              <SkeletonText width="25%" />
            </div>
          </div>
        </div>
        <div className="cast-section">
          <SkeletonText width="30%" />
          <div className="cast-list">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCast key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  const title = data.title || data.name;
  const releaseYear = data.release_date?.slice(0, 4) || data.first_air_date?.slice(0, 4);

  const trailer = videos.find(v => v.type === "Trailer") || videos.find(v => v.type === "Teaser");

  const handleTrailerClick = () => {
    if (trailer) {
      setTrailerKey(trailer.key);
    } else {
      window.open(`https://www.youtube.com/results?search_query=${title} official trailer`, "_blank");
    }
  };

  return (
    <div className="details-page">
      {/* BACKDROP */}
      <div
        className="details-backdrop"
        style={{
          backgroundImage: `url(${IMG + data.backdrop_path})`,
        }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      {/* MAIN INFO */}
      <div className="details-content">
        <div className="poster">
          <img src={IMG + data.poster_path} alt={`${title} poster`} loading="lazy" />
        </div>

        <div className="info">
          <h1>{title}</h1>

          <div className="meta">
            <span>📅 {releaseYear}</span>
            <span>⭐ {data.vote_average?.toFixed(1)} / 10</span>
            {!isTV && <span>⏱ {data.runtime} min</span>}
            {isTV && <span>📺 {data.number_of_seasons} Seasons</span>}
          </div>

          <p className="overview">{data.overview}</p>

          {/* GENRES */}
          <div className="genres">
            {data.genres?.map(g => (
              <span key={g.id}>{g.name}</span>
            ))}
          </div>

          {/* TRAILER */}
          <div className="buttons">
            <button className="trailer-btn" onClick={handleTrailerClick} aria-label="Watch trailer">
              🎥 Watch Trailer
            </button>
          </div>

          {/* PROVIDERS */}
          {providers?.flatrate && (
            <div className="providers">
              <h3>Available On</h3>
              <div className="provider-logos">
                {providers.flatrate.map(p => (
                  <img
                    key={p.provider_id}
                    src={IMG + p.logo_path}
                    alt={p.provider_name}
                    title={p.provider_name}
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CAST */}
      <div className="cast-section">
        <h2>Top Cast</h2>
        <div className="cast-list">
          {cast.slice(0, 14).map(actor => (
            <div className="cast-card" key={actor.id}>
              {actor.profile_path ? (
                <img src={IMG + actor.profile_path} alt={actor.name} loading="lazy" />
              ) : (
                <div className="no-cast">No Image</div>
              )}
              <h4>{actor.name}</h4>
              <p>as {actor.character}</p>
            </div>
          ))}
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

export default MovieDetails;