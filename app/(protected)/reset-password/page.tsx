import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <section className="flex-1 w-full flex flex-col mt-12 mb-40 mx-auto items-center justify-center px-4 lg:px-0">
      <form className="flex flex-col max-w-lg w-full border border-border rounded-lg p-10">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-3xl tracking-tighter font-medium text-center">
            Reset password
          </h1>
          <p className="text-md text-muted-foreground text-center">
            Remember your password?{" "}
            <Link
              className="text-foreground font-medium underline"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="password">New password</Label>
          <Input
            type="password"
            name="password"
            placeholder="New password"
            required
            autoComplete="new-password"
          />
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            required
            autoComplete="new-password"
          />
          <SubmitButton
            pendingText="Resetting..."
            formAction={resetPasswordAction}
          >
            Reset password
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </section>
  );
}
