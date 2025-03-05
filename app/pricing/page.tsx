import { fetchTiers, fetchProfileData } from "@/app/actions";
import PricingContent from "@/components/pricing/pricing-content";

// For static site generation (builds at build time)
export const revalidate = 3600; // Revalidate every hour

export default async function PricingPage() {
  // Fetch data at build time
  const tiers = await fetchTiers();
  const profileData = await fetchProfileData();

  // Pass data to client component
  return <PricingContent initialTiers={tiers} currentSubscription={profileData?.subscription} />;
}
