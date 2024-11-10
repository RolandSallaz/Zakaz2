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
        const endPage = Math.min(totalPages, currentPage + 1);

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
                    <svg
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        height="1em"
                        width="1em"
                    >
                        <path
                            fillRule="evenodd"
                            d="M15 2a1 1 0 00-1-1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2zM0 2a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2zm11.5 5.5a.5.5 0 010 1H5.707l2.147 2.146a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 11.708.708L5.707 7.5H11.5z"
                        />
                    </svg>
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
                    className={'pagination__button pagination__button_right'}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <svg
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        height="1em"
                        width="1em"
                    >
                        <path
                            fillRule="evenodd"
                            d="M15 2a1 1 0 00-1-1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2zM0 2a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2zm11.5 5.5a.5.5 0 010 1H5.707l2.147 2.146a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 11.708.708L5.707 7.5H11.5z"
                        />
                    </svg>
                </button>
            )}
        </div>
    )
}
