"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Database } from "@/lib/database.types";
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { use } from "react";
import { GoogleIcon } from "@/components/icons/google";

export default function SignUpPage(props: { searchParams: Promise<Message> }) {
  const searchParams = use(props.searchParams);

  const handleGoogleSignIn = () => {
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth
      .signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      .then(({ error }) => {
        if (error) {
          console.error("Error signing in with Google:", error.message);
        }
      });
  };

  return (
    <section className="flex-1 w-full flex flex-col mt-12 mb-40 mx-auto items-center justify-center px-4">
      <form className="flex flex-col max-w-lg w-full border border-border rounded-lg p-10">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-3xl tracking-tighter font-medium text-center">
            Sign up and get started
          </h1>
          <p className="text-md text-muted-foreground text-center">
            Already have an account?{" "}
            <Link
              className="text-foreground font-medium underline"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          type="button"
          variant="outline"
          className="flex items-center gap-2"
        >
          <GoogleIcon className="w-5 h-5" />
          Sign up with Google
        </Button>
      </form>
    </section>
  );
}
