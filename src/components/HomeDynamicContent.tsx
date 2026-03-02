"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import VideoSection from "@/components/VideoSection";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { fetchPortfolioData } from "@/lib/fetch-public-data";
import { fetchSiteSettings } from "@/lib/fetch-public-data";
import type { SiteSettings } from "@/lib/site-settings";
import type { PortfolioCategory, PortfolioImage } from "@/lib/portfolio-data";

const DEFAULT_SETTINGS: SiteSettings = {
  phone: "(206) 206-9868",
  email: "pictureyour2day@gmail.com",
  intro_video_url: "",
  proposal_video_url: "",
  intro_video_autoplay: false,
  proposal_video_autoplay: false,
  hero_image_url: "",
};

const DEFAULT_CATEGORIES: PortfolioCategory[] = [{ id: "All", label: "All" }];

export default function HomeDynamicContent() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [portfolio, setPortfolio] = useState<{
    categories: PortfolioCategory[];
    images: PortfolioImage[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [settings, portfolioData] = await Promise.all([
          fetchSiteSettings(),
          fetchPortfolioData(),
        ]);
        if (!cancelled) {
          setSiteSettings(settings);
          setPortfolio(portfolioData);
        }
      } catch {
        if (!cancelled) {
          setSiteSettings(DEFAULT_SETTINGS);
          setPortfolio({ categories: DEFAULT_CATEGORIES, images: [] });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main>
        <div className="min-h-[60vh] flex items-center justify-center bg-[#0d0d0d]">
          <div className="text-center">
            <div className="inline-block w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[var(--muted)] text-sm tracking-widest uppercase">Loading…</p>
          </div>
        </div>
        <About />
        <Services />
      </main>
    );
  }

  const settings = siteSettings ?? DEFAULT_SETTINGS;
  const { categories, images } = portfolio ?? { categories: DEFAULT_CATEGORIES, images: [] };

  return (
    <main>
      <Hero heroImageUrl={settings.hero_image_url || null} />
      <About />
      <VideoSection
        url={settings.intro_video_url}
        title="Our Studio"
        subtitle="Video"
        sectionId="intro-video"
        autoplay={settings.intro_video_autoplay}
      />
      <Portfolio categories={categories} images={images} />
      <VideoSection
        url={settings.proposal_video_url}
        title="Featured Work"
        subtitle="Proposal Reel"
        sectionId="proposal-video"
        dark
        autoplay={settings.proposal_video_autoplay}
      />
      <Services />
      <Contact phone={settings.phone} email={settings.email} />
      <Footer phone={settings.phone} email={settings.email} />
    </main>
  );
}
