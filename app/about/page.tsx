import AboutBanner from "@/app/components/about/AboutBanner";
import OurStory from "@/app/components/about/OurStory";
import OurMission from "@/app/components/about/OurMission";
import OurTeam from "@/app/components/about/OurTeam";
import Testimonials from "@/app/components/about/Testimonials";
import FAQ from "@/app/components/about/FAQ";
import ContactUs from "@/app/components/about/ContactUs";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutBanner />
      <OurStory />
      <OurMission />
      {/* <OurTeam /> */}
      <Testimonials />
      <FAQ />
      <ContactUs />
    </main>
  );
}
