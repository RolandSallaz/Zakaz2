import { ReactNode, useEffect } from 'react';
import './AboutPage.scss';
import { Link, useNavigate } from 'react-router-dom';

interface props {
  children: ReactNode;
}

export default function AboutPage({ children }: props) {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate]);
  return (
    <main className="main AboutPage">
      <Link className="link AboutOrder__back-link" to="/">
        Вернуться на главную
      </Link>
      {children}
    </main>
  );
}
