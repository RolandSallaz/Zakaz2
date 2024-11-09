import React, { useCallback } from 'react'
import './Pagination.scss';

interface props {
    totalPages: number,
    currentPage: number;
    handlePageChange: (arg: number) => void;
}

export default function Pagination({ totalPages, currentPage, handlePageChange }: props) {

    const getPageNumbers = () => {
        const pageNumbers = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
    
        if (startPage > 1) {
          pageNumbers.push(1);
          if (startPage > 2) {
            pageNumbers.push("...");
          }
        }
    
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
    
        if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
            pageNumbers.push("...");
          }
          pageNumbers.push(totalPages);
        }
    
        return pageNumbers;
      };
      
    return (
        <div className={'pagination'}>
            {/* Кнопка "Предыдущая" */}
            {totalPages > 0 && (
                <button
                    className={'pagination__button'}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Назад
                </button>
            )}

            {/* Кнопки страниц */}
            {getPageNumbers().map((number, index) => (
                <button
                    key={index}
                    className={`pagination__button ${currentPage === number ? 'pagination__button_active' : ""
                        }`}
                    onClick={() =>
                        typeof number === "number" && handlePageChange(number)
                    }
                    disabled={typeof number !== "number"}
                >
                    {number}
                </button>
            ))}

            {/* Кнопка "Следующая" */}
            {totalPages > 0 && (
                <button
                    className={'pagination__button'}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Вперед
                </button>
            )}
        </div>
    )
}
