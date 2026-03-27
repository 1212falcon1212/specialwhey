import { HeroBanner } from "@/components/storefront/home/hero-banner";
import { JarConfigurator } from "@/components/storefront/home/jar-configurator";
import { IntroText } from "@/components/storefront/home/intro-text";
import { MarqueeTicker } from "@/components/storefront/home/marquee-ticker";
import { LifestyleGallery } from "@/components/storefront/home/lifestyle-gallery";
import { HowItWorks } from "@/components/storefront/home/how-it-works";
import { WhyPromix } from "@/components/storefront/home/why-promix";
import { IngredientsShowcase } from "@/components/storefront/home/ingredients-showcase";
import { SplitBanner } from "@/components/storefront/home/split-banner";
import { CtaBand } from "@/components/storefront/home/cta-band";
import { BlogPreview } from "@/components/storefront/home/blog-preview";
import { FaqSection } from "@/components/storefront/home/faq-section";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <IntroText />
      <JarConfigurator />
      <MarqueeTicker />
      <LifestyleGallery />
      <HowItWorks />
      <IngredientsShowcase />
      <WhyPromix />
      <SplitBanner />
      <BlogPreview />
      <CtaBand />
      <FaqSection />
    </>
  );
}
