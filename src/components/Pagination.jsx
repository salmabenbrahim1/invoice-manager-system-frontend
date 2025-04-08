import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onNext, onPrev }) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <span className="text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex space-x-4">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          <FaArrowLeft className="mr-2" /> Previous
        </button>
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
