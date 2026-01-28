import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { tmdb, IMG } from "../api/tmdb";
import TrailerModal from "../components/TrailerModal";
import MovieCard from "../components/MovieCard";
import "../styles/details.css";

/* ================= SKELETON ================= */
const SkeletonPoster = () => <div className="skeleton skeleton-poster"></div>;
const SkeletonText = ({ width = "100%" }) => (
  <div className="skeleton skeleton-text" style={{ width }}></div>
);

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isTV = location.pathname.startsWith("/tv");

  const [data, setData] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [videos, setVideos] = useState([]);
  const [providers, setProviders] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const type = isTV ? "tv" : "movie";

      const [
        detailsRes,
        creditsRes,
        videosRes,
        providersRes,
        similarRes
      ] = await Promise.all([
        tmdb.get(`/${type}/${id}`),
        tmdb.get(`/${type}/${id}/credits`),
        tmdb.get(`/${type}/${id}/videos`),
        tmdb.get(`/${type}/${id}/watch/providers`),
        tmdb.get(`/${type}/${id}/similar`)
      ]);

      setData(detailsRes.data);
      setCast(creditsRes.data.cast || []);
      setCrew(creditsRes.data.crew || []);
      setVideos(videosRes.data.results || []);
      setProviders(providersRes.data.results?.IN || null);
      setSimilar(similarRes.data.results || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load movie details.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="details-page">
        <div className="details-content">
          <SkeletonPoster />
          <div className="info">
            <SkeletonText width="70%" />
            <SkeletonText width="50%" />
            <SkeletonText width="100%" />
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="error-message">{error}</div>;
  if (!data) return null;

  /* ================= DATA ================= */
  const title = data.title || data.name;
  const year =
    data.release_date?.slice(0, 4) ||
    data.first_air_date?.slice(0, 4);

  const trailer =
    videos.find(v => v.type === "Trailer" && v.site === "YouTube") ||
    videos.find(v => v.type === "Teaser");

  /* ================= CREW ================= */
  const directors = crew.filter(p => p.job === "Director");
  const producers = crew.filter(p => p.job === "Producer");
  const writers = crew.filter(p =>
    ["Writer", "Screenplay", "Story"].includes(p.job)
  );

  const openWiki = (name) => {
    window.open(
      `https://en.wikipedia.org/wiki/${name.replace(/ /g, "_")}`,
      "_blank"
    );
  };

  /* ================= ABOUT ================= */
  const generateAbout = () => {
    const genres = data.genres?.map(g => g.name).join(", ");
    const rating = data.vote_average?.toFixed(1);

    return `
${title} (${year}) is a ${genres.toLowerCase()} ${
      isTV ? "web series" : "movie"
    } that gained attention for its storytelling and performances.

With a TMDB rating of ${rating}/10, the ${
      isTV ? "series" : "film"
    } delivers strong emotional moments, engaging characters, and quality direction.

Fans of ${genres.toLowerCase()} content will find ${title} a satisfying and memorable watch.
`;
  };

  return (
    <div className="details-page">

      {/* BACKDROP */}
      <div
        className="details-backdrop"
        style={{ backgroundImage: `url(${IMG + data.backdrop_path})` }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="details-content">
        <div className="poster">
          <img src={IMG + data.poster_path} alt={title} />
        </div>

        <div className="info">
          <h1>{title}</h1>

          <div className="meta">
            <span>📅 {year}</span>
            <span>⭐ {data.vote_average?.toFixed(1)} / 10</span>
            {!isTV && <span>⏱ {data.runtime} min</span>}
            {isTV && <span>📺 {data.number_of_seasons} Seasons</span>}
          </div>

          {/* BUTTONS */}
          <div className="buttons">
            <button
              className="trailer-btn"
              onClick={() =>
                trailer
                  ? setTrailerKey(trailer.key)
                  : window.open(
                      `https://www.youtube.com/results?search_query=${title} trailer`,
                      "_blank"
                    )
              }
            >
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
                  />
                ))}
              </div>
            </div>
          )}

          <p className="overview">{data.overview}</p>
        </div>
      </div>

      {/* ================= ABOUT ================= */}
      <div className="about-section">
        <h2>📝 About the {isTV ? "Series" : "Movie"}</h2>
        <p>{generateAbout()}</p>
      </div>

      {/* ================= CAST ================= */}
      <div className="cast-section">
        <h2>🎭 Cast</h2>
        <div className="cast-list">
          {cast.slice(0, 14).map(actor => (
            <div
              key={actor.id}
              className="cast-card clickable"
              onClick={() => openWiki(actor.name)}
            >
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

      {/* ================= CREW ================= */}
      <div className="crew-section">
        {directors.length > 0 && (
          <CrewBlock title="🎬 Director" people={directors} openWiki={openWiki} />
        )}
        {producers.length > 0 && (
          <CrewBlock title="🎥 Producer" people={producers} openWiki={openWiki} />
        )}
        {writers.length > 0 && (
          <CrewBlock title="✍️ Writer" people={writers} openWiki={openWiki} />
        )}
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

/* ================= CREW BLOCK ================= */
const CrewBlock = ({ title, people, openWiki }) => (
  <div className="crew-block">
    <h3>{title}</h3>
    <div className="crew-list">
      {people.map(p => (
        <span
          key={p.id}
          className="crew-name"
          onClick={() => openWiki(p.name)}
        >
          {p.name}
        </span>
      ))}
    </div>
  </div>
);

export default MovieDetails;
