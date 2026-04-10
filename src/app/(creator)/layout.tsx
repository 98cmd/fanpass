import { CreatorSidebar } from "@/components/layouts/creator-sidebar";
import { CreatorMobileHeader } from "@/components/layouts/creator-header";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <CreatorSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <CreatorMobileHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
