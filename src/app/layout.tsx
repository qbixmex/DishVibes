import { FC } from "react";
import type { Metadata } from "next";
import { geistMono, geistSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dine Flow",
  description: "A restaurant food application",
};

type Props = Readonly<LayoutProps<"/">>;

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
