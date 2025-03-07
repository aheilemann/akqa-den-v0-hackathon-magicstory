"use client";

import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  user: User | null;
  links: { href: string; label: string }[];
}

export function MobileMenu({ user, links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center">
      {user ? (
        <Link
          href={`/profile`}
          className="flex items-center justify-center h-10 w-10"
        >
          <UserAvatar user={user} />
        </Link>
      ) : (
        <Link
          href="/sign-in"
          className="flex items-center justify-center h-10 w-10"
        >
          <UserAvatar user={null} />
        </Link>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-10 w-10 p-0 min-w-0 min-h-0"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <div
        className={cn(
          "fixed inset-0 top-16 bg-background md:hidden transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col p-4 space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
