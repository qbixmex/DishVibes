'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { links } from "./data";
import { cn } from "cn";
import { usePathname, useRouter } from "next/navigation";
import styles from "./styles.module.css";

export const MobileMenu = () => {
  const path = usePathname();
  const route = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.mobileMenuButton}>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </Button>

      {
        open && (
          <div className={styles.mobileMenu}>
            {links.map((link) => (
              <Button
                key={link.id}
                className={cn({ 'text-primary': link.url === path })}
                onClick={() => {
                  setOpen(false);
                  route.push(link.url);
                }}
                variant="ghost"
              >
                {link.label}
              </Button>
            ))}
            <Button
              type="button"
              onClick={() => setOpen(false)}
              variant="ghost"
              className={styles.closeMenu}
            >
              <X />
            </Button>
          </div>
        )
      }
    </div>
  );
};
