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
            <Phone />
            <span>+1 232-555-1232</span>
          </div>
          <div className={styles.contactData}>
            <AtSign />
            <span>contact@dishvibes.com</span>
          </div>
        </div>
        <div className={styles.columnB}>
          <div className={styles.heading}>Order</div>
          <div className={styles.links}>
            <Link href="#">Menu</Link>
            <Link href="#">Offers</Link>
            <Link href="#">Location</Link>
            <Link href="#">Track Order</Link>
          </div>
        </div>
        <div className={styles.columnC}>
          <div className={styles.heading}>About Us</div>
          <div className={styles.links}>
            <Link href="#">Our History</Link>
            <Link href="#">Frequent Questions</Link>
            <Link href="#">Contact</Link>
          </div>
        </div>
        <div className={styles.columnD}>
          <div className={styles.heading}>Info</div>
          <div className={styles.links}>
            <Link href="#">Delivery</Link>
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
          </div>
        </div>
        <div className={styles.columnE}>
          <div className={styles.heading}>Social Media</div>
          <div className={styles.links}>
            <Link href="#" className={styles.socialLink}><Facebook /> Facebook</Link>
            <Link href="#" className={styles.socialLink}><X /> Twitter X</Link>
            <Link href="#" className={styles.socialLink}><Instagram /> Instagram</Link>
            <Link href="#" className={styles.socialLink}><TikTok /> TikTok</Link>
          </div>
        </div>
      </div>
      <p className={styles.copyright}>© 2026 Food Studio. All rights reserved.</p>
    </section>
  );
};
