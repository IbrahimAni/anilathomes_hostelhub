import AboutBanner from "@/components/about/AboutBanner";
import OurStory from "@/components/about/OurStory";
import OurMission from "@/components/about/OurMission";
import Testimonials from "@/components/about/Testimonials";
import FAQ from "@/components/about/FAQ";
import ContactUs from "@/components/about/ContactUs";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutBanner />
      <OurStory />
      <OurMission />
      <Testimonials />
      <FAQ />
      <ContactUs />
    </main>
  );
}
