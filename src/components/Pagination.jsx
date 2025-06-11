import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const Pagination = ({ currentPage, totalPages, onNext, onPrev }) => {
    const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mt-4">
      <span className="text-gray-700">
         <p>{t('page_info', { currentPage, totalPages })}</p>
      </span>
      <div className="flex space-x-4">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          <FaArrowLeft className="mr-2" /> {t('previous')}
        </button>
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          {t('next')} <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
