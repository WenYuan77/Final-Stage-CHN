"use client";

import { createBrowserClient, isSupabaseBrowserConfigured } from "@/lib/supabase/client";
import type { PortfolioCategory, PortfolioImage } from "@/lib/portfolio-data";
import type { SiteSettings } from "@/lib/site-settings";

const DEFAULT_CATEGORIES: PortfolioCategory[] = [
  { id: "All", label: "All" },
  { id: "Wedding", label: "Wedding" },
  { id: "Engagement", label: "Engagement" },
  { id: "Family-Children", label: "Family & Children" },
  { id: "Portrait", label: "Portrait" },
  { id: "Pets", label: "Pets" },
  { id: "Automotive", label: "Automotive" },
  { id: "Events", label: "Events" },
];

const SITE_SETTINGS_DEFAULTS: SiteSettings = {
  phone: "(206) 206-9868",
  email: "pictureyour2day@gmail.com",
  intro_video_url: "",
  proposal_video_url: "",
  intro_video_autoplay: false,
  proposal_video_autoplay: false,
  hero_image_url: "",
};

export async function fetchPortfolioData(): Promise<{
  categories: PortfolioCategory[];
  images: PortfolioImage[];
}> {
  if (!isSupabaseBrowserConfigured()) {
    return { categories: DEFAULT_CATEGORIES, images: [] };
  }
  try {
    const supabase = createBrowserClient();
    const [catRes, imgRes] = await Promise.all([
      supabase.from("categories").select("id, label").order("sort_order", { ascending: true }),
      supabase.from("portfolio_images").select("*").order("sort_order").order("created_at"),
    ]);
    const categories: PortfolioCategory[] = [
      { id: "All", label: "All" },
      ...(catRes.data ?? []).map((c) => ({ id: c.id, label: c.label })),
    ];
    const images: PortfolioImage[] = (imgRes.data ?? []).map(
      (row: { id: string; category_id?: string; category?: string; src: string; alt?: string }) => ({
        id: row.id,
        category: String(row.category_id ?? row.category ?? "").trim(),
        src: row.src,
        alt: row.alt ?? "",
      })
    );
    return { categories, images };
  } catch {
    return { categories: DEFAULT_CATEGORIES, images: [] };
  }
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseBrowserConfigured()) {
    return SITE_SETTINGS_DEFAULTS;
  }
  try {
    const supabase = createBrowserClient();
    const { data } = await supabase
      .from("site_settings")
      .select(
        "phone, email, intro_video_url, proposal_video_url, intro_video_autoplay, proposal_video_autoplay, autoplay_customized, hero_image_url"
      )
      .limit(1)
      .single();

    const customized = data?.autoplay_customized ?? false;
    const introAutoplay = customized ? (data?.intro_video_autoplay ?? false) : true;
    const proposalAutoplay = customized ? (data?.proposal_video_autoplay ?? false) : false;

    return {
      phone: data?.phone ?? SITE_SETTINGS_DEFAULTS.phone,
      email: data?.email ?? SITE_SETTINGS_DEFAULTS.email,
      intro_video_url: data?.intro_video_url ?? SITE_SETTINGS_DEFAULTS.intro_video_url,
      proposal_video_url: data?.proposal_video_url ?? SITE_SETTINGS_DEFAULTS.proposal_video_url,
      intro_video_autoplay: introAutoplay,
      proposal_video_autoplay: proposalAutoplay,
      hero_image_url: data?.hero_image_url ?? SITE_SETTINGS_DEFAULTS.hero_image_url,
    };
  } catch {
    return SITE_SETTINGS_DEFAULTS;
  }
}
