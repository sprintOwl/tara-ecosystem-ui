"use client";

import { Project } from "@/lib/models/project";
import { ProjectForm } from "./project-form";
import { useEffect, useState } from "react";
import { useConnection } from "../hooks/useConnection";
import { RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";

type UpdateProjectProps = {
  id: number;
};

export const UpdateProject = ({ id }: UpdateProjectProps) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { account, isConnected } = useConnection();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetch(`/api/get-project?id=${id}`)
        .then((response) => response.json())
        .then((data: Project) => {
          if (data) {
            setProject(data);
          }
          setIsLoading(false);
        });
    }
  }, [id]);

  if (!isConnected) {
    return (
      <Alert className="max-w-3xl">
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Sorry!</AlertTitle>
        <AlertDescription>
          You need to be connected in order to update your project
        </AlertDescription>
      </Alert>
    );
  }

  if (!project || project.owner !== account) {
    return (
      <Alert className="max-w-3xl">
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Sorry!</AlertTitle>
        <AlertDescription>
          It seems you don`ƒt have permissions to access this project or it
          doesn`t exist.{" "}
          <Link href="/">
            <Button size="sm" variant="outline">
              Go Back
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return <ProjectForm project={project} />;
};
