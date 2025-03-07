import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getUser } from "@/app/actions";

type FooterLink = {
  href: string;
  label: string;
};

type FooterLinkGroup = {
  title: string;
  links: FooterLink[];
};

const productLinks: FooterLink[] = [
  { href: "/create", label: "Create Story" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

const accountLinks: FooterLink[] = [
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
  { href: "/forgot-password", label: "Forgot Password" },
];

const accountLinksAuth: FooterLink[] = [
  { href: "/profile", label: "Profile" },
  { href: "/reset-password", label: "Reset Password" },
];

const legalLinks: FooterLink[] = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
];

export async function Footer() {
  const user = await getUser();

  const linkGroups: FooterLinkGroup[] = [
    { title: "Product", links: productLinks },
    { title: "Account", links: user ? accountLinksAuth : accountLinks },
  ];

  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-2xl font-medium">
                MagicStory
              </Link>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Transform your ideas into interactive digital or physical stories
              with AI.
            </p>
          </div>

          {linkGroups.map(({ title, links }) => (
            <div key={title} className="space-y-4">
              <h4 className="text-sm font-semibold">{title}</h4>
              <ul className="space-y-4 text-sm">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <span className="text-muted-foreground">
              © 2025 MagicStory. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            {legalLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
