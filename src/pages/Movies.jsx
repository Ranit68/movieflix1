import React, { useEffect, useState } from "react";
import { tmdb } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import "../styles/movies.css";
import { useNavigate, useParams } from "react-router-dom";

const GENRES = {
  action: 28,
  comedy: 35,
  horror: 27,
  romance: 10749,
  thriller: 53,
  drama: 18,
  crime: 80,
  scifi: 878,
  animation: 16
};

const LANGUAGES = {
  all: "All Languages",
  hi: "Hindi (Bollywood)",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  kn: "Kannada",
  mr: "Marathi",
  pa: "Punjabi",
  gu: "Gujarati",
  ur: "Urdu",
  en: "English (Hollywood)",
  ko: "Korean",
  ja: "Japanese",
  zh: "Chinese",
  fr: "French",
  es: "Spanish"
};

const SkeletonCard = () => <div className="skeleton-card" />;

const Movies = () => {
  const navigate = useNavigate();
  const { category } = useParams();

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [language, setLanguage] = useState("all");
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState("popularity.desc");
  const [totalPages, setTotalPages] = useState(500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* RESET PAGE WHEN CATEGORY CHANGES */
  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    fetchMovies();
  }, [page, language, genre, sort, category]);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = "/discover/movie";
      let params = {
        page,
        sort_by: sort
      };

      /* CATEGORY LOGIC */
      switch (category) {
        case "trending":
          endpoint = "/trending/movie/week";
          break;

        case "bollywood":
          params.with_original_language = "hi";
          params.region = "IN";
          break;

        case "hollywood":
          params.with_original_language = "en";
          break;

        case "top-rated":
          endpoint = "/movie/top_rated";
          break;

        case "upcoming":
          endpoint = "/movie/upcoming";
          break;

        default:
          break;
      }

      /* FILTERS */
      if (language !== "all") {
        params.with_original_language = language;
        params.region = "IN";
      }

      if (genre !== "all") {
        params.with_genres = GENRES[genre];
      }

      const res = await tmdb.get(endpoint, { params });

      setMovies(res.data.results);
      setTotalPages(res.data.total_pages || 500);
    } catch (err) {
      console.error(err);
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="movies-page">
      <h1 className="movies-title">
        🎬 {category ? category.replace("-", " ").toUpperCase() : "MOVIES"}
      </h1>

      {/* FILTER BAR */}
      <div className="filter-bar">

        {/* LANGUAGE */}
        <div className="filter-group">
          <label>🌐 Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            {Object.entries(LANGUAGES).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* GENRE */}
        <div className="filter-group">
          <label>🎭 Genre</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="all">All Genres</option>
            {Object.keys(GENRES).map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* SORT */}
        <div className="filter-group">
          <label>📊 Sort By</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Top Rated</option>
            <option value="release_date.desc">Latest</option>
            <option value="release_date.asc">Oldest</option>
          </select>
        </div>

      </div>

      {/* MOVIE GRID */}
      {loading ? (
        <div className="movies-grid">
          {Array.from({ length: 20 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="error-message">
          {error}
          <button className="retry-btn" onClick={fetchMovies}>
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className="movie-card-wrapper"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <MovieCard
                  movie={movie}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                />
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default Movies;
