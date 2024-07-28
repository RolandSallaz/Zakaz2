import Link from "next/link";
import styles from "./page.module.scss";
export default function NotFound() {
  return (
    <main className={`main ${styles.main}`}>
      <div className={styles.not_found}>
        <h2 className="error-heading">404 - Страница не найдена</h2>
        <Link href={"/"} className="link">
          Вернуться на главную
        </Link>
      </div>
    </main>
  );
}
