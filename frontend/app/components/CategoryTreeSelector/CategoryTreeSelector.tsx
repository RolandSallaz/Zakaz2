import { useOnClickOutside } from '@/app/lib/hooks/useOnClickOutside';
import { useRef, useState } from 'react';
import 'react-simple-tree-menu/dist/main.css';
import TreeList from '../TreeList/TreeList';
import TreeListMobile from '../TreeList/TreeListMobile';
import './CategoryTreeSelector.scss';
import { transformedTree } from '@/app/lib/utils/utils';
import { useAppDispatch } from '@/app/lib/redux/store';
import { openPopup } from '@/app/lib/redux/slices/searchCategoryPopupSlice';

interface Props {
    getValue: (arg: string[]) => void;
    isMobile?: boolean;
}

export function CategoryTreeSelector({ getValue, isMobile = false }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [hoverPath, setHoverPath] = useState<string[]>([]);
    const [selectedPath, setSelectedPath] = useState<string[]>([]);

    const dispatch = useAppDispatch();

    useOnClickOutside(containerRef, () => {
        setIsOpen(false);
        setHoverPath([]);
    });

    const handleSelect = (path: string[]) => {
        getValue(path);
        setSelectedPath(path);
        setIsOpen(false);
        setHoverPath([]);
    };

    function handleClick() {
        setIsOpen((prev) => !prev);
        if (isMobile) {
            dispatch(openPopup());
        }
    }
    return (

        <div
            className="CategoryTreeSelector"
            ref={containerRef}
            onClick={handleClick}
            onMouseEnter={() => setIsOpen(true)}
        >
            <svg
                className={`CategoryTreeSelector__image ${isOpen ? 'CategoryTreeSelector__image_active' : ''}`}
                viewBox="0 0 1024 1024"
                fill="currentColor"
                height="1em"
                width="1em"
            >
                <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z" />
            </svg>

            {isOpen && !isMobile && (
                <div className="CategoryTreeSelector__container">
                    <TreeList
                        data={transformedTree}
                        onSelect={handleSelect}
                        hoverPath={hoverPath}
                        selectedPath={selectedPath}
                        setHoverPath={setHoverPath}
                    />
                </div>
            )}
        </div>
    );
}
