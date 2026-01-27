import React, { useEffect, useState } from "react";
import { tmdb, IMG } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";

// Simple loading skeleton component for movie rows
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-image"></div>
    <div className="skeleton-text"></div>
  </div>
);

const Home = () => {
  const [banner, setBanner] = useState(null);
  const [trending, setTrending] = useState([]);
  const [bollywood, setBollywood] = useState([]);
  const [hollywood, setHollywood] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [trendingRes, bollywoodRes, hollywoodRes, topRatedRes, upcomingRes] = await Promise.all([
        tmdb.get("/trending/movie/week"),
        tmdb.get("/discover/movie", {
          params: { region: "IN", with_original_language: "hi", sort_by: "popularity.desc" }
        }),
        tmdb.get("/discover/movie", {
          params: { with_original_language: "en", sort_by: "popularity.desc" }
        }),
        tmdb.get("/movie/top_rated"),
        tmdb.get("/movie/upcoming")
      ]);

      setTrending(trendingRes.data.results);
      setBollywood(bollywoodRes.data.results);
      setHollywood(hollywoodRes.data.results);
      setTopRated(topRatedRes.data.results);
      setUpcoming(upcomingRes.data.results);
      setBanner(trendingRes.data.results[0]);
    } catch (err) {
      setError("Failed to load movies. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrailer = async (movieId) => {
    try {
      const res = await tmdb.get(`/movie/${movieId}/videos`);
      const trailer = res.data.results.find(v => v.type === "Trailer" && v.site === "YouTube");
      if (trailer) {
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
      } else {
        alert("No trailer available.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="home">
      {/* HERO */}
      {banner && !loading && (
        <div
          className="hero"
          style={{
            backgroundImage: `url(${IMG + banner.backdrop_path})`
          }}
        >
          <div className="hero-overlay">
            <h1>{banner.title}</h1>
            <p>{banner.overview}</p>
            <div className="hero-buttons">
              <button onClick={() => navigate(`/movie/${banner.id}`)}>
                ▶ View Details
              </button>
              <button onClick={() => handleTrailer(banner.id)}>
                🎥 Watch Trailer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTIONS */}
      {[
        { title: "🔥 Trending Now", data: trending, route: "/trending" },
        { title: "🇮🇳 Bollywood Movies", data: bollywood, route: "/bollywood" },
        { title: "🌍 Hollywood Movies", data: hollywood, route: "/hollywood" },
        { title: "⭐ Top Rated Movies", data: topRated, route: "/top-rated" },
        { title: "🎬 Upcoming Movies", data: upcoming, route: "/upcoming" }
      ].map((section, index) => (
        <section key={index} className="movie-section">
          <div className="section-header">
            <h2>{section.title}</h2>
            <button className="see-all-btn" onClick={() => navigate(section.route)}>
              See All →
            </button>
          </div>
          <div className="movie-row">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
              : section.data.map(movie => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  />
                ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;