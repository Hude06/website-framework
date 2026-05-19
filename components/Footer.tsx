import styles from './Footer.module.css';

interface FooterProps {
  siteName: string;
}

export function Footer({ siteName }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} {siteName}</p>
    </footer>
  );
}
