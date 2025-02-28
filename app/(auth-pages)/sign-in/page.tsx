"use client";

import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { use } from "react";
import { GoogleIcon } from "@/components/icons/google";
import { handleGoogleSignIn } from "@/app/actions";

export default function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = use(props.searchParams);

  return (
    <section className="flex-1 w-full flex flex-col mt-12 mb-40 mx-auto items-center justify-center px-4 lg:px-0">
      <form className="flex flex-col max-w-lg w-full border border-border rounded-lg p-10">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-3xl tracking-tighter font-medium text-center">
            Sign in to your account
          </h1>
          <p className="text-md text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link
              className="text-foreground font-medium underline"
              href="/sign-up"
            >
              Sign up
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              className="text-xs text-foreground underline"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in
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
          Continue with Google
        </Button>
      </form>
    </section>
  );
}
