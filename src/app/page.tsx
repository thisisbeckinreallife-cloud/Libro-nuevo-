import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Hook } from "@/components/Hook";
import { BookIntro } from "@/components/BookIntro";
import { Problem } from "@/components/Problem";
import { Insight } from "@/components/Insight";
import { Transformation } from "@/components/Transformation";
import { Authority } from "@/components/Authority";
import { Differentiation } from "@/components/Differentiation";
import { Extracts } from "@/components/Extracts";
import { Proof } from "@/components/Proof";
import { Buy } from "@/components/Buy";
import { Depth } from "@/components/Depth";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Hook />
        <BookIntro />
        <Problem />
        <Insight />
        <Transformation />
        <Authority />
        <Differentiation />
        <Extracts />
        <Proof />
        <Buy />
        <Depth />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
