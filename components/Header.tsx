import Link from 'next/link';
import type { NavLink } from '../lib/types';
import styles from './Header.module.css';

interface HeaderProps {
  siteName: string;
  nav: NavLink[];
}

function isInternal(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

export function Header({ siteName, nav }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        {siteName}
      </Link>
      <nav className={styles.nav}>
        {nav.map((link) =>
          isInternal(link.href) ? (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ) : (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          )
        )}
      </nav>
    </header>
  );
}
