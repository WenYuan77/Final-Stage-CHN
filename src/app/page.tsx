import Header from "@/components/Header";
import HomeDynamicContent from "@/components/HomeDynamicContent";

/**
 * Home page: static shell. Portfolio, site settings (hero, videos, contact) are
 * loaded client-side from Supabase so admin updates appear without redeploying.
 */
export default function Home() {
  return (
    <>
      <Header />
      <HomeDynamicContent />
    </>
  );
}
