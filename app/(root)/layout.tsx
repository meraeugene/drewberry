import { Navbar } from "@/components/common/Navbar";

export default function RootAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
