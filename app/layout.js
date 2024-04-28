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
{/* 
      <header className="navbar" style={{ background: '#9488EC', color: 'white', padding: '10px', textAlign: 'center', position: 'fixed', width: '100%', zIndex: 1000 }}>
          <h1>{metadata.title}</h1>
          <nav>
            <a href="#about" style={{ color: 'white', marginLeft: '20px', marginRight: '20px', textDecoration: 'none' }}>About</a>
          </nav>
        </header> */}

        <main className="dark text-foreground bg-background">

          <body className={inter.className}>{children}</body>

          <div className="feature-buttons" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '20px', background: '#9488EC', display: 'flex', justifyContent: 'center' }}>
            
            <button className="feature-button">
              <img src="StriideLogo.png" alt="Closure" />
            </button>
            <button className="feature-button">
              <img src="assets/construction2.png" alt="Lighting" />
            </button>
            <button className="feature-button">
              <img src="assets/construction1.png" alt="Police" />
            </button>
            <button className="feature-button">
              <img src="assets/construction1.png" alt="Foot Traffic" />
            </button>
            <button className="feature-button">
              <img src="assets/construction1.png" alt="Bad Weather" />
            </button>
            <button className="feature-button">
              <img src="assets/construction1.png" alt="Safe Haven" />
            </button>
            <button className="feature-button">
              <img src="assets/construction1.png" alt="Hazard" />
            </button>
            <button className="feature-button">
              <img src="assets/construction1.png" alt="Quality of Area" />
            </button>
            <button className="feature-button">
              <img src="assets/construction1.png" alt="Open Business" />
            </button>
            </div>

        </main>
      </NextUIProvider>

    </html>
  );
}
