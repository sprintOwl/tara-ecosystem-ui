import { RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import { UpdateProject } from "../../../components/update-project";

export default function NewProjectPage({ params }: { params: { id: number } }) {
  const { id } = params;

  if (!params.id) {
    return (
      <Alert className="max-w-3xl">
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Sorry!</AlertTitle>
        <AlertDescription>
          It seems this project doesn`t exist. Start adding one{" "}
          <Link href="/new-project">
            <Button size="sm" variant="outline">
              HERE
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <UpdateProject id={id} />
    </div>
  );
}
