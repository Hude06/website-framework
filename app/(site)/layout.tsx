import { loadSiteConfig } from '@/lib/content';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import styles from './layout.module.css';

const config = loadSiteConfig();

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={styles.shell}>
      <Header siteName={config.siteName} nav={config.nav} />
      <main className={styles.main}>{children}</main>
      <Footer siteName={config.siteName} />
    </div>
  );
}
