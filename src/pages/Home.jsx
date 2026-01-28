import React, { useEffect, useState } from "react";
import { tmdb, IMG } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  useEffect(() => {
    fetchHome();
  }, []);

  const fetchHome = async () => {
    setLoading(true);

    const [
      trendingRes,
      bollywoodRes,
      hollywoodRes,
      topRatedRes,
      upcomingRes
    ] = await Promise.all([
      tmdb.get("/trending/movie/week"),
      tmdb.get("/discover/movie", {
        params: { region: "IN", with_original_language: "hi" }
      }),
      tmdb.get("/discover/movie", {
        params: { with_original_language: "en" }
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

    setLoading(false);
  };

  const sections = [
    { title: "🔥 Trending Now", data: trending, slug: "trending" },
    { title: "🇮🇳 Bollywood Movies", data: bollywood, slug: "bollywood" },
    { title: "🌍 Hollywood Movies", data: hollywood, slug: "hollywood" },
    { title: "⭐ Top Rated Movies", data: topRated, slug: "top-rated" },
    { title: "🎬 Upcoming Movies", data: upcoming, slug: "upcoming" }
  ];

  return (
    <div className="home">
      {banner && (
        <div
          className="hero"
          style={{ backgroundImage: `url(${IMG + banner.backdrop_path})` }}
        >
          <div className="hero-overlay">
            <h1>{banner.title}</h1>
            <p>{banner.overview}</p>

            <div className="hero-buttons">
              <button onClick={() => navigate(`/movie/${banner.id}`)}>
                ▶ View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {sections.map((section, i) => (
        <section key={i} className="movie-section">
          <div className="section-header">
            <h2>{section.title}</h2>
            <button
              className="see-all-btn"
              onClick={() => navigate(`/category/${section.slug}`)}
            >
              See All →
            </button>
          </div>

          <div className="movie-row">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
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
