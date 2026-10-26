'use client';

import { useState, type FC } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

export const SignInOut: FC = () => {
  const [isAuthenticated] = useState(false);

  return (
    <div className={styles.signInOut}>
      <Link href="#">
      {!isAuthenticated ? 'Sign In' : 'Sign Out'}
      </Link>
    </div>
  );
};
