
import Nav from "@/components/Nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="md:flex">
      <Nav name="Our Wedding" />
      <main className="min-w-0 flex-1 px-4 py-6 md:px-10 md:py-10">
        {children}
      </main>
    </div>
  );
}
