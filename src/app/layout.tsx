import { FC } from "react";
import { montserrat, geistMono, geistSans } from "./fonts";
import "./globals.css";

type Props = Readonly<LayoutProps<"/">>;

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${geistSans.variable} ${geistMono.variable} antialiased dark`}
    >
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
