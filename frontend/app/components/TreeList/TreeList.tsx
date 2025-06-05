import React, { useEffect, useRef, useState } from 'react'
import './TreeList.scss';
import { CustomTreeNode } from '@/app/lib/utils/types';
import useHover from '@/app/lib/hooks/useHover';

interface TreeListProps {
    data: CustomTreeNode[];
    onSelect?: (path: string[]) => void;
    parentPath?: string[];
    hoverPath?: string[];
    selectedPath?: string[];
    setHoverPath?: React.Dispatch<React.SetStateAction<string[]>>;
    currentHovered?: string;
}

export default function TreeList({
    data,
    onSelect,
    parentPath = [],
    hoverPath = [],
    selectedPath = [],
    setHoverPath,
}: TreeListProps) {

    const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (leaveTimeout.current) {
            clearTimeout(leaveTimeout.current);
            leaveTimeout.current = null;
        }
    };

    const handleMouseLeave = () => {
        leaveTimeout.current = setTimeout(() => {
            setHoverPath?.([]);
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (leaveTimeout.current) {
                clearTimeout(leaveTimeout.current);
            }
        };
    }, []);
    return (
        <ul
            className={`TreeList ${parentPath.length > 0 ? 'with-shadow' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}

        >
            {data.map((node) => {
                const fullPath = [...parentPath, node.value];
                const keyPath = fullPath.join('/');

                const isHovered = hoverPath.at(-1) === keyPath;
                const isInHoverTrail = hoverPath.includes(keyPath);

                const isSelected = selectedPath.join('/') === keyPath;
                const isInSelectedTrail = selectedPath
                    .map((_, i, arr) => arr.slice(0, i + 1).join('/'))
                    .includes(keyPath);

                let className = 'TreeList__item';

                if (isHovered) {
                    className += ' text_purple';
                } else if (
                    (isInHoverTrail && !isHovered) ||
                    (isInSelectedTrail && isSelected)
                ) {
                    className += ' text_blue';
                }

                return (
                    <li
                        key={node.key}
                        className={className}
                        onMouseEnter={() =>
                            setHoverPath?.(fullPath.map((_, i, arr) => arr.slice(0, i + 1).join('/')))
                        }
                        onMouseLeave={() => {
                            setHoverPath?.((prev) => {
                                const currentKey = fullPath.join('/');
                                const index = prev.indexOf(currentKey);
                                return index !== -1 ? prev.slice(0, index + 1) : [];
                            });
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect?.(fullPath);
                        }}
                    >
                        <span >
                            {node.label} {node.nodes.length > 0 && '›'}
                        </span>

                        {node.nodes.length > 0 && hoverPath.includes(keyPath) && (
                            <TreeList
                                data={node.nodes}
                                onSelect={onSelect}
                                parentPath={fullPath}
                                hoverPath={hoverPath}
                                selectedPath={selectedPath}
                                setHoverPath={setHoverPath}
                            />
                        )}
                    </li>
                );
            })}
        </ul>
    );
}