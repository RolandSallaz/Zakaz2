import { ReactNode } from 'react';
import './FooterColumn.scss';

interface props {
  heading?: string;
  children?: ReactNode;
}

export default function FooterColumn({ children, heading }: props) {
  return (
    <nav className="footerColumn">
      {heading && <h2 className="footerColumn__heading">{heading}</h2>}
      {children}
    </nav>
  );
}
