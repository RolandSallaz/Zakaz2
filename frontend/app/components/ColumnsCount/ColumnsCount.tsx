import React from 'react'
import './ColumnsCount.scss';

interface props {
    isMobile: boolean;
    columnsCount: number;
    setColumnsCount: (arg: number) => void;
}

export default function ColumnsCount({ isMobile, columnsCount, setColumnsCount }: props) {
    return (
        <>
            <button
                className={`tags__button ${columnsCount === (isMobile ? 1 : 2)
                    ? 'tags__button_active'
                    : ""
                    }`}
                onClick={() => setColumnsCount(isMobile ? 1 : 2)}
            >
                {isMobile ? "l" : "ll"}
            </button>
            <button
                className={`tags__button ${columnsCount === (isMobile ? 2 : 4)
                    ? 'tags__button_active'
                    : ""
                    }`}
                onClick={() => setColumnsCount(isMobile ? 2 : 4)}
            >
                {isMobile ? "ll" : "llll"}
            </button></>
    )
}
