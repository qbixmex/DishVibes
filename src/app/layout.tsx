import { FC } from "react";
import { montserrat, openSans, robotoMono } from "./fonts";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const cssClasses = [
  "antialiased",
  "dark",
  "font-sans",
  montserrat.variable,
  openSans.variable,
  robotoMono.variable,
];

type Props = Readonly<LayoutProps<"/">>;

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html
      lang="es"
      className={cn(cssClasses)}
    >
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}

export default RootLayout;
