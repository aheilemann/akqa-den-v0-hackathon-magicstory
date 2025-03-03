import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { UserProfile } from "@/components/organisms/user-profile";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email_confirmed_at) {
    redirect("/sign-in");
  }

  return (
    <section className="flex-1 w-full max-w-4xl mx-auto pt-12 pb-24">
      <UserProfile user={user} />
    </section>
  );
}
