import Image from "next/image";
import localFont from "next/font/local";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

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

export default function Home() {
  return (
    <>
      <main className='flex w-full h-screen overflow-hidden bg-black'>
        <Sidebar />
        <div>Main</div>
      </main>
      <div className="sticky z-20 bottom-0 h-24 w-full bg-red-100">Player</div>
    </>
  );
}
