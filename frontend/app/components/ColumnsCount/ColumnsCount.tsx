import React, { useEffect, useState } from 'react'
import './ColumnsCount.scss';

interface props {
    isMobile: boolean;
    columnsCount: number;
    setColumnsCount: (arg: number) => void;
    style?: React.CSSProperties;
}

export default function ColumnsCount({ isMobile, columnsCount, setColumnsCount, style }: props) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) return null;
    
    return (
        <>
            <button
                className={`tags__button ${columnsCount === (isMobile ? 1 : 2)
                    ? 'tags__button_active'
                    : ""
                    }`}
                onClick={() => setColumnsCount(isMobile ? 1 : 2)}
                style={style}
            >
                {isMobile ? "l" : "ll"}
            </button>
            <button
                className={`tags__button ${columnsCount === (isMobile ? 2 : 4)
                    ? 'tags__button_active'
                    : ""
                    }`}
                onClick={() => setColumnsCount(isMobile ? 2 : 4)}
                style={style}
            >
                {isMobile ? "ll" : "llll"}
            </button>
        </>
    )
}
