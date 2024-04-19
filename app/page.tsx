import { SpotlightPreview } from "@/components/spotlight-preview";
import { Projects } from "@/components/projects";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full">
      <div className="container mx-auto max-w-10xl flex flex-col">
        <div className="w-full min-h-screen">
          <div className="flex flex-col w-full justify-center items-center">
            <SpotlightPreview />
            <Projects />
          </div>
        </div>
      </div>
    </main>
  );
}
