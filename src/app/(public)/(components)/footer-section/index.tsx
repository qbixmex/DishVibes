import Link from 'next/link';
import { Logo } from '../logo';
import styles from './styles.module.css';
import { AtSign, Phone } from 'lucide-react';
import { FaFacebook as Facebook } from "react-icons/fa";
import { FaXTwitter as X } from "react-icons/fa6";
import { FaInstagram as Instagram } from "react-icons/fa";
import { FaTiktok as TikTok } from "react-icons/fa";

export const FooterSection = () => {
  return (
    <section className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.columnA}>
          <Logo />
          <p className={styles.slogan}>Delicious taste for you mouth.</p>
          <div className={styles.contactData}>
            <Phone aria-hidden="true" />
            <span>+1 232-555-1232</span>
          </div>
          <div className={styles.contactData}>
            <AtSign aria-hidden="true" />
            <span>contact@dishvibes.com</span>
          </div>
        </div>
        <div className={styles.columnB}>
          <div className={styles.heading}>Order</div>
          <div className={styles.links}>
            <Link href="/menu" title="Go to menu">Menu</Link>
            <Link href="/offers" title="Go to offers">Offers</Link>
            <Link href="/location" title="Go to location">Location</Link>
            <Link href="/track-order" title="Go to track order">Track Order</Link>
          </div>
        </div>
        <div className={styles.columnC}>
          <div className={styles.heading}>About Us</div>
          <div className={styles.links}>
            <Link href="/about" title="Go to our history">Our History</Link>
            <Link href="#" title="Go to frequent questions">Frequent Questions</Link>
            <Link href="/contact" title="Go to contact">Contact</Link>
          </div>
        </div>
        <div className={styles.columnD}>
          <div className={styles.heading}>Info</div>
          <div className={styles.links}>
            <Link href="#" title="Go to delivery">Delivery</Link>
            <Link href="#" title="Go to privacy policy">Privacy</Link>
            <Link href="#" title="Go to use terms">Terms</Link>
          </div>
        </div>
        <div className={styles.columnE}>
          <div className={styles.heading}>Social Media</div>
          <div className={styles.links}>
            <Link
              href="#"
              className={styles.socialLink}
              title="Go to facebook"
            >
              <Facebook aria-hidden="true" /> Facebook
            </Link>
            <Link
              href="#"
              className={styles.socialLink}
              title="Go to twitter x"
            >
              <X aria-hidden="true" /> Twitter X
            </Link>
            <Link
              href="#"
              className={styles.socialLink}
              title="Go to instagram"  
            >
              <Instagram aria-hidden="true" /> Instagram
            </Link>
            <Link
              href="#"
              className={styles.socialLink}
              title="Go to tiktok"
            >
              <TikTok aria-hidden="true" /> TikTok
            </Link>
          </div>
        </div>
      </div>
      <p className={styles.copyright} role="status">
        &copy; 2026 Food Studio. All rights reserved.
      </p>
    </section>
  );
};
