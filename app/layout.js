import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Striide Demo",
  description: "Techstars Start Up 2024",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <NextUIProvider>
        
        <main className="dark text-foreground bg-background">

          <body className={inter.className}>{children}</body>

        </main>
      </NextUIProvider>

    </html>
  );
}
