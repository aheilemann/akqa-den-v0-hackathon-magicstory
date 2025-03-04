import Link from "next/link";
import HeaderAuth from "@/components/header-auth";
import { UserAvatar } from "@/components/ui/avatar";
import { MobileMenu } from "./mobile-menu";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";

const navigationLinks = [
  { href: "/create", label: "Create Story" },
  { href: "/pricing", label: "Pricing" },
  { href: "/shop", label: "Shop" },
];

export async function Navigation() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 z-50">
      <div className="container px-4 md:px-6 flex justify-between items-center p-3 text-sm">
        <Link
          href="/"
          className="font-semibold text-lg tracking-tighter hover:opacity-60 transition-opacity duration-300 ease-out"
        >
          ✨StoryMagic
        </Link>

        <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <HeaderAuth />

          {user && (
            <Link href={`/profile`}>
              <UserAvatar
                user={user}
                className="h-8 w-8 transition-transform hover:scale-105"
              />
            </Link>
          )}
        </div>

        <MobileMenu user={user} links={navigationLinks} />
      </div>
    </nav>
  );
}
