import { FeaturesShowcase } from "@/components/organisms/features-showcase";

export default async function AboutPage() {
  return (
    <section className="flex-1 w-full flex flex-col gap-12 my-40 mx-auto items-center justify-center">
      <FeaturesShowcase />
    </section>
  );
}
