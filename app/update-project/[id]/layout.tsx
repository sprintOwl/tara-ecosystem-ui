import { Navigation } from "@/components/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 p-10 w-full">
      <main className="flex min-h-screen flex-col items-center justify-between w-full">
        <div className="container mx-auto max-w-10xl flex flex-col">
          <div className="flex flex-col w-full justify-center items-center gap-10">
            <Navigation />
            {children}
          </div>
        </div>
      </main>
    </section>
  );
}
