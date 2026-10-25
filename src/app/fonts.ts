import { Montserrat, Open_Sans, Roboto_Mono} from "next/font/google";

export const montserrat = Montserrat({
  variable: "--font-heading",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const openSans = Open_Sans({
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const robotoMono = Roboto_Mono({
  variable:'--font-mono',
  subsets:['latin'],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});
