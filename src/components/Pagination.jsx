import React from "react";
import "../styles/pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">

      <button
        className="page-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ◀ Prev
      </button>

      {start > 1 && <span className="dots">...</span>}

      {pages.map((page) => (
        <button
          key={page}
          className={`page-btn ${page === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {end < totalPages && <span className="dots">...</span>}

      <button
        className="page-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next ▶
      </button>

    </div>
  );
};

export default Pagination;
