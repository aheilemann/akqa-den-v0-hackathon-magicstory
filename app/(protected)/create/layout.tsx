import { CreateProvider } from "@/context/CreateStoryContext";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CreateProvider>{children}</CreateProvider>;
}
