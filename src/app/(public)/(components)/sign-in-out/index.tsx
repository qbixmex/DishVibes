'use client';

import { useState, type FC } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import { LogIn, LogOut } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";

export const SignInOut: FC = () => {
  const [isAuthenticated] = useState(false);

  return (
    <div className={styles.signInOut}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href="#"
              className={
                buttonVariants({
                  variant: "outline",
                  size: 'icon',
                })
              }
              aria-label="Go to authentication"
            >
              {
                !isAuthenticated ? (
                  <LogIn data-testid="login-icon" aria-hidden="true" />
                ) : (
                  <LogOut data-testid="logout-icon" aria-hidden="true" />
                )
              }
            </Link>
          }
        />
        <TooltipContent side="left" data-testid="tooltip-content">
          { !isAuthenticated ? 'login' : 'logout' }
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
