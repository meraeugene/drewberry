import { Navbar } from "@/components/common/Navbar";
import { WatchlistToast } from "@/components/common/WatchlistToast";

export default function RootAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <WatchlistToast />
    </>
  );
}
