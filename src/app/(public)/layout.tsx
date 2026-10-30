import type { FC } from "react";
import type { Metadata } from "next";
import { Logo } from "./(components)/logo";
import { MainNavigation } from "./(components)/main-navigation";
import { SearchDish } from "./(components)/search-dish";
import { Orders } from "./(components)/orders";
import { SignInOut } from "./(components)/sign-in-out";
import { ThemeSwitcher } from "./(components)/theme-switcher";
import styles from "./layout.module.css";
import { Providers } from "./providers";
import { MobileMenu } from "./(components)/main-navigation/mobile-menu";

export const metadata: Metadata = {
  title: "Dish Vibes",
  description: "Restaurant application",
};

type Props = Readonly<LayoutProps<"/">>;

const PublicLayout: FC<Props> = ({ children }) => {
  return (
    <Providers>
      <div className={styles.layout}>
        <header className={styles.header}>
          <nav className={styles.topNav}>
            <div className={styles.columnLeft}>
              <Logo />
              <MainNavigation />
            </div>
            <div className={styles.columnRight}>
              <SearchDish />
              <Orders />
              <SignInOut />
              <ThemeSwitcher />
              <MobileMenu />
            </div>
          </nav>
        </header>

        <main className={styles.main}>
          {children}
        </main>

        <footer id={styles.footer}>
          <p>© 2026 Food Studio. All rights reserved.</p>
        </footer>
      </div>
    </Providers>
  );
};

export default PublicLayout;
