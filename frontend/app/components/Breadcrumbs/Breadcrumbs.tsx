import React, { useMemo } from 'react'
import './Breadcrumbs.scss';
import { getLabelsFromPath, categoryTree } from '@/app/lib/utils/utils';

interface Props {
    selectedCategory: string[];
    onChangeCategory: (category: string[]) => void;
}

export default function Breadcrumbs({ onChangeCategory, selectedCategory }: Props) {

    const labels = useMemo(
        () => getLabelsFromPath(selectedCategory, categoryTree),
        [selectedCategory]
    );
    if (!selectedCategory.length) {
        return;
    }
    return (
        <div className="breadcrumbs">
            <span className="breadcrumbs__span">
                <button
                    className="breadcrumbs__button"
                    onClick={() => onChangeCategory([])}
                >
                    Все категории
                </button>
                {labels.length > 0 && <span>/</span>}
            </span>

            {labels.map((label, index) => (
                <span key={selectedCategory[index]} className="breadcrumbs__span">
                    <button
                        className="breadcrumbs__button"
                        onClick={() => {
                            const newPath = selectedCategory.slice(0, index + 1);
                            onChangeCategory(newPath);
                        }}
                    >
                        {label}
                    </button>
                    {index < labels.length - 1 && <span>/</span>}
                </span>
            ))}
        </div>
    )
}
