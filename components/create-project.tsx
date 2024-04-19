"use client";

import { RocketIcon } from "@radix-ui/react-icons";
import { useConnection } from "@/hooks/useConnection";
import { ProjectForm } from "./project-form";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export const CreateProject: React.FC = () => {
  const { isConnected } = useConnection();

  if (!isConnected) {
    return (
      <Alert className="max-w-3xl">
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Sorry!</AlertTitle>
        <AlertDescription>
          You need to be connected in order to add your project
        </AlertDescription>
      </Alert>
    );
  }
  return <ProjectForm />;
};
