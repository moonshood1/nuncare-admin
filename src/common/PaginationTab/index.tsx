import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
};

const PaginationTab: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setPage,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center join">
      {pages.map((page) => (
        <button
          key={page}
          className={`join-item btn ${
            page === currentPage ? "btn-active" : ""
          }`}
          onClick={() => setPage(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default PaginationTab;
