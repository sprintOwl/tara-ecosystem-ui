import { ProjectDetails } from "@/components/project-details";

export default function Page({ params }: { params: { id: number } }) {
  return <ProjectDetails id={params.id} />;
}
