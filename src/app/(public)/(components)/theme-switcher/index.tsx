'use client';

import type { FC } from "react";
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import styles from "./styles.module.css";

export const ThemeSwitcher: FC = () => {
  const { setTheme } = useTheme();

  return (
    <div className={styles.themeSwitcher}>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="icon" aria-label="Theme">
                    <Sun className={styles.lightIcon} />
                    <Moon className={styles.darkIcon} />
                  </Button>
                }
              />
            }
          />
          <TooltipContent side="right">change theme</TooltipContent>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="w-full inline-flex justify-between"
            >
              Light <Sun />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="w-full inline-flex justify-between"
            >
              Dark <Moon />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="w-full inline-flex justify-between"
            >
              System <Monitor />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </div>
  );
};
