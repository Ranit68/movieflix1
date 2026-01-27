import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <h2>🎬 MovieVerse</h2>
          <p>
            MovieVerse is a movie & web series discovery platform.
            Explore trending, upcoming, and top-rated content across
            multiple languages.
          </p>
        </div>

        {/* LINKS */}
        <div className="footer-links">

          <div>
            <h4>Explore</h4>
            <ul>
              <li>Movies</li>
              <li>Web Series</li>
              <li>Trending</li>
              <li>Upcoming</li>
            </ul>
          </div>

          <div>
            <h4>Categories</h4>
            <ul>
              <li>Bollywood</li>
              <li>Hollywood</li>
              <li>South Indian</li>
              <li>Korean</li>
              <li>Anime</li>
            </ul>
          </div>

          <div>
            <h4>Support</h4>
            <ul>
              <li>About</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>

        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} MovieVerse. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
