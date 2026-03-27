import localFont from "next/font/local";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { QueryClientProvider,QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/theme.js"
import {AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter"
import "./globals.css";
import "react-big-calendar/lib/css/react-big-calendar.css"
import { TanstackProvider } from "../lib/provider/tanstackprovider";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});
export const metadata = {
  title: "EventApt",
  description: "The elite marketplace for high-end event services.",
};
// const queryClient = new QueryClient()
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <TanstackProvider>
        <AppRouterCacheProvider>
       <ThemeProvider theme={theme}>
       {children}
       </ThemeProvider>
        </AppRouterCacheProvider>
        </TanstackProvider>
      </body>
      </html>
  );
}