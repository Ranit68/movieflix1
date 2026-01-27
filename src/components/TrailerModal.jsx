import React, { useEffect, useState } from "react";
import "../styles/trailerModal.css";

const TrailerModal = ({ trailerKey, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Close on ESC key and manage body scroll
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!trailerKey) return null;

  return (
    <div
      className="trailer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-title"
    >
      <div
        className="trailer-modal"
        onClick={(e) => e.stopPropagation()}
        tabIndex="-1" // For focus management
      >
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close trailer modal"
        >
          ✕
        </button>

        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading trailer...</p>
          </div>
        )}

        <iframe
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
          title="Movie Trailer"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          onLoad={handleIframeLoad}
          style={{ display: isLoading ? "none" : "block" }}
        ></iframe>
      </div>
    </div>
  );
};

export default TrailerModal;