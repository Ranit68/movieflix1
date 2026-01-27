import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile hamburger menu
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search/${search}`);
    setSearch("");
    setIsMenuOpen(false); // Close menu on search
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLinkClick = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu on navigation
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="nav-logo" onClick={() => handleLinkClick("/")}>
        🎬 MovieVerse
      </div>

      {/* SEARCH */}
      <form className="nav-search" onSubmit={handleSearch}>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search movies, series..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search movies or series"
          />
          <button type="submit" aria-label="Submit search">
            🔍
          </button>
        </div>
      </form>

      {/* HAMBURGER MENU (Mobile) */}
      <div className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* NAV LINKS */}
      <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <span onClick={() => handleLinkClick("/movies")}>🎥 Movies</span>
        <span onClick={() => handleLinkClick("/series")}>📺 Web Series</span>

        {/* CATEGORY DROPDOWN */}
        <div className="dropdown">
          <span>📂 Categories ▾</span>
          <div className="dropdown-menu">
            <p onClick={() => handleLinkClick("/category/action")}>💥 Action</p>
            <p onClick={() => handleLinkClick("/category/comedy")}>😂 Comedy</p>
            <p onClick={() => handleLinkClick("/category/horror")}>👻 Horror</p>
            <p onClick={() => handleLinkClick("/category/romance")}>💖 Romance</p>
            <p onClick={() => handleLinkClick("/category/thriller")}>🔪 Thriller</p>
            <p onClick={() => handleLinkClick("/category/scifi")}>🚀 Sci-Fi</p>
            <p onClick={() => handleLinkClick("/category/fantasy")}>🧙 Fantasy</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;