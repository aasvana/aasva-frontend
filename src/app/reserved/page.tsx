import Footer from "@/components/generic/footer";
import Header from "@/components/generic/header";
import Cta from "@/components/generic/landing/cta";
import Features from "@/components/generic/landing/features";
import Hero from "@/components/generic/landing/hero";
import HowItWorks from "@/components/generic/landing/how-it-works";
import Products from "@/components/generic/landing/products";
import Testimonials from "@/components/generic/landing/testimonials";
import React from "react";

export default function ReservedLanding() {
  return (
    <>
      <Header />
      <main id="content">
        <Hero />
        <Products />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
