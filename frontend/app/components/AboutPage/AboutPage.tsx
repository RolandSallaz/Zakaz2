import Link from "next/link";
import { ReactNode } from "react";
import "./AboutPage.scss";

interface props {
  children: ReactNode;
}

export default function AboutPage({ children }: props) {
  return (
    <main className="main AboutPage">
      <Link className="link AboutOrder__back-link" href="/">
        Вернуться на главную
      </Link>
      {children}
    </main>
  );
}
