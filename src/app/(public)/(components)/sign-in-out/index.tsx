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
            >
              { !isAuthenticated ? <LogIn /> : <LogOut /> }
            </Link>
          }
        />
        <TooltipContent side="left">
          { !isAuthenticated ? 'login' : 'logout' }
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
