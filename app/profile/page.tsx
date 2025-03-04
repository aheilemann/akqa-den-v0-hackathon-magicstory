import { fetchProfileData } from "@/app/actions";
import { redirect } from "next/navigation";
import { UserProfile } from "@/components/organisms/user-profile";

export const revalidate = 0; // Disable caching for this page

export default async function ProfilePage() {
  const profileData = await fetchProfileData();

  if (!profileData?.user) {
    redirect("/sign-in");
  }

  return (
    <section className="flex-1 w-full max-w-4xl mx-auto pt-12 pb-24">
      <UserProfile initialProfileData={profileData} />
    </section>
  );
}
