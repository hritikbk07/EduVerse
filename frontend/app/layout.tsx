import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduVerse Admin | Dashboard",
  description: "Admin dashboard for managing the EduVerse online learning platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "10px",
              background: "#0f172a",
              color: "#f1f5f9",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#f1f5f9" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#f1f5f9" },
            },
          }}
        />
      </body>
    </html>
  );
}
