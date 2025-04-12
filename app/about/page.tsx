import AboutBanner from "@/components/about/AboutBanner";
import OurStory from "@/components/about/OurStory";
import OurMission from "@/components/about/OurMission";
import Testimonials from "@/components/about/Testimonials";
import FAQ from "@/components/about/FAQ";
import ContactUs from "@/components/about/ContactUs";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <AboutBanner />
        <OurStory />
        <OurMission />
        <Testimonials />
        <FAQ />
        <ContactUs />
      </main>
      <Footer />
    </>
  );
}
