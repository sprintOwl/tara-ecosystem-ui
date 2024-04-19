import { Project } from "./project";

export type Tag = {
  id: number;
  name: string;
  projects: Project[];
};
