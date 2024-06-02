import { useState, MouseEvent } from 'react';

enum hoverType {
  MouseLeave = 'mouseleave',
  MouseEnter = 'mouseenter',
}

export default function useHover() {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  function handleHovered(e: MouseEvent<HTMLDivElement>) {
    e.type === hoverType.MouseEnter ? setIsHovered(true) : setIsHovered(false);
  }

  return { isHovered, handleHovered };
}
