import React from "react";
import HeroSection from "../components/site-homepage/HeroSection";
import Navbar from "../components/site-homepage/Navbar";
import AchievementsSection from "../components/site-homepage/AchievementsSection";
import EmailSection from "../components/site-homepage/EmailSection";
import Footer from "../components/site-homepage/Footer";

export default async function Home() {
  return (
    <main
      className="relative flex min-h-screen flex-col px-12 py-4 bg-cover bg-no-repeat w-full "
      style={{ backgroundImage: 'url("/images/bg4.png")' }}
    >
      <Navbar />

      <div className="container mt-24 mx-auto px-12 py-4 ">
        <HeroSection />
      </div>
      <Footer />
    </main>
  );
}
