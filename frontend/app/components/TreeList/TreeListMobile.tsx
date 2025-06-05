'use client';
import { closePopup, goBack, goToLevel, setCategory } from '@/app/lib/redux/slices/searchCategoryPopupSlice';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/store';
import { categoryTree } from '@/app/lib/utils/utils';
import { useRouter } from 'next/navigation';
import './TreeList.scss';

export default function TreeListMobile() {
    const dispatch = useAppDispatch();
    const { isPopupOpened, currentPath } = useAppSelector((state) => state.searchCategorySlice);
    const router = useRouter();
    if (!isPopupOpened) return null;

    const getCurrentLevel = () => {
        let current = categoryTree;
        for (const slug of currentPath) {
            const next = current.find((c) => c.value === slug);
            if (!next || !next.children) return [];
            current = next.children;
        }
        return current;
    };

    const currentLevel = getCurrentLevel();

    function handleSelect() {
        dispatch(setCategory())
        dispatch(closePopup());
    }

    return (
        <div className="TreeListMobile">
            <div className="TreeListMobile__overlay" onClick={() => dispatch(closePopup())} />
            <div className="TreeListMobile__container">
                {currentPath.length > 0 && (
                    <div className="TreeListMobile__header">
                        {currentPath.length > 0 && (
                            <button onClick={() => dispatch(goBack())} className="TreeListMobile__back">
                                Назад
                            </button>
                        )}
                    </div>
                )}
                <ul className="TreeListMobile__list">
                    {currentLevel.map((item) => (
                        <li
                            key={item.value}
                            className="TreeListMobile__item"
                            onClick={() => {
                                const newPath = [...currentPath, item.value];

                                if (item.children) {
                                    dispatch(goToLevel(newPath));
                                } else {
                                    dispatch(goToLevel(newPath));
                                    handleSelect();
                                }
                            }}
                        >
                            {item.label}
                        </li>
                    ))}
                    <li
                        className="TreeListMobile__item TreeListMobile__item_all"
                        onClick={handleSelect}
                    >
                        Все товары
                    </li>
                </ul>
            </div>
        </div>
    );
}
