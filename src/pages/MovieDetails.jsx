import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { tmdb, IMG } from "../api/tmdb";
import TrailerModal from "../components/TrailerModal";
import MovieCard from "../components/MovieCard";
import "../styles/details.css";

/* ================= SKELETONS ================= */
const SkeletonPoster = () => <div className="skeleton skeleton-poster"></div>;
const SkeletonText = ({ width = "100%" }) => (
  <div className="skeleton skeleton-text" style={{ width }}></div>
);
const SkeletonCast = () => <div className="skeleton skeleton-cast"></div>;

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isTV = location.pathname.startsWith("/tv");

  const [data, setData] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [providers, setProviders] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  /* ================= FETCH DETAILS ================= */
  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const type = isTV ? "tv" : "movie";

      const [
        detailsRes,
        castRes,
        videoRes,
        providerRes,
        similarRes
      ] = await Promise.all([
        tmdb.get(`/${type}/${id}`),
        tmdb.get(`/${type}/${id}/credits`),
        tmdb.get(`/${type}/${id}/videos`),
        tmdb.get(`/${type}/${id}/watch/providers`),
        tmdb.get(`/${type}/${id}/similar`)
      ]);

      setData(detailsRes.data);
      setCast(castRes.data.cast || []);
      setVideos(videoRes.data.results || []);
      setProviders(providerRes.data.results?.IN || null);
      setSimilar(similarRes.data.results || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */
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
            <SkeletonText width="90%" />
          </div>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="details-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  /* ================= DATA ================= */
  const title = data.title || data.name;
  const releaseYear =
    data.release_date?.slice(0, 4) ||
    data.first_air_date?.slice(0, 4);

  const trailer =
    videos.find(v => v.type === "Trailer") ||
    videos.find(v => v.type === "Teaser");

  /* ================= STORY SUMMARY ================= */
  const generateSummary = () => {
    const genreText = data.genres?.map(g => g.name).join(", ");
    const rating = data.vote_average?.toFixed(1);

    return `
${title} (${releaseYear}) is a ${genreText?.toLowerCase()} ${
      isTV ? "web series" : "movie"
    } that delivers an engaging and immersive viewing experience.

The story highlights emotional depth, strong character development, and impactful moments that keep viewers invested. 
With a TMDB rating of ${rating}/10, this ${
      isTV ? "series" : "film"
    } stands out for its performances, direction, and storytelling.

If you enjoy ${genreText?.toLowerCase()} content, ${title} is definitely worth watching.
`;
  };

  return (
    <div className="details-page">
      {/* ================= BACKDROP ================= */}
      <div
        className="details-backdrop"
        style={{
          backgroundImage: `url(${IMG + data.backdrop_path})`
        }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      {/* ================= MAIN INFO ================= */}
      <div className="details-content">
        <div className="poster">
          <img src={IMG + data.poster_path} alt={title} />
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

          <div className="genres">
            {data.genres?.map(g => (
              <span key={g.id}>{g.name}</span>
            ))}
          </div>

          <div className="buttons">
            <button
              className="trailer-btn"
              onClick={() =>
                trailer
                  ? setTrailerKey(trailer.key)
                  : window.open(
                      `https://www.youtube.com/results?search_query=${title} official trailer`,
                      "_blank"
                    )
              }
            >
              🎥 Watch Trailer
            </button>
          </div>

          {/* ================= PROVIDERS ================= */}
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
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= STORY SUMMARY ================= */}
      <div className="story-summary">
        <h2>📖 Story Summary</h2>
        <p>{generateSummary()}</p>
      </div>

      {/* ================= CAST ================= */}
      <div className="cast-section">
        <h2>Top Cast</h2>
        <div className="cast-list">
          {cast.slice(0, 14).map(actor => (
            <div className="cast-card" key={actor.id}>
              {actor.profile_path ? (
                <img src={IMG + actor.profile_path} alt={actor.name} />
              ) : (
                <div className="no-cast">No Image</div>
              )}
              <h4>{actor.name}</h4>
              <p>as {actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SIMILAR ================= */}
      {similar.length > 0 && (
        <div className="similar-section">
          <h2>🎬 Similar {isTV ? "Series" : "Movies"}</h2>

          <div className="movie-row">
            {similar.map(item => (
              <MovieCard
                key={item.id}
                movie={item}
                onClick={() =>
                  navigate(isTV ? `/tv/${item.id}` : `/movie/${item.id}`)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= TRAILER MODAL ================= */}
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
