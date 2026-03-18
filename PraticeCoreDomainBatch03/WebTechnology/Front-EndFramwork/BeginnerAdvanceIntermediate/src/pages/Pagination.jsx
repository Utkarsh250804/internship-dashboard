import React, { useState } from "react";

function Pagination({ items, itemsPerPage }) {

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>

      {selectedItems.map((item, index) => (
        <div key={index} className="card p-3 mb-2">
          {item}
        </div>
      ))}

      <div className="text-center mt-3">

        <button
          className="btn btn-primary me-2"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span> Page {currentPage} of {totalPages} </span>

        <button
          className="btn btn-primary ms-2"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default Pagination;