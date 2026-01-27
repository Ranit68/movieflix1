import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tmdb } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import "../styles/search.css";

// Skeleton component for loading
const SkeletonCard = () => <div className="skeleton-card"></div>;

const SearchResults = () => {
  const { query } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tmdb.get("/search/multi", {
        params: {
          query,
          include_adult: false
        }
      });

      // Filter only movie & TV
      const filtered = res.data.results.filter(
        item => item.media_type === "movie" || item.media_type === "tv"
      );

      setResults(filtered);
    } catch (err) {
      setError("Failed to load search results. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchResults();
  };

  return (
    <div className="search-page">
      <h1 className="search-title">🔍 Search results for "{query}"</h1>

      {loading ? (
        <div className="search-grid">
          {Array.from({ length: 20 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="error-message">
          {error}
          <button className="retry-btn" onClick={handleRetry}>
            Retry
          </button>
        </div>
      ) : results.length === 0 ? (
        <div className="no-results">
          <p>No results found for "{query}".</p>
          <p>Try searching for a different movie or TV show title.</p>
        </div>
      ) : (
        <div className="search-grid">
          {results.map((item, index) => (
            <div
              key={item.id}
              className="search-card-wrapper"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <MovieCard
                movie={item}
                onClick={() =>
                  navigate(
                    item.media_type === "tv"
                      ? `/tv/${item.id}`
                      : `/movie/${item.id}`
                  )
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;