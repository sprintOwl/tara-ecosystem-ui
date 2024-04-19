"use client";

import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  RocketIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "../lib/models/project";
import { shortenAddress } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Tag } from "../lib/models/tag";
import {
  TwitterIcon,
  GithubIcon,
  TelegramIcon,
  DiscordIcon,
  DocsIcon,
} from "@/components/icons";
import clsx from "clsx";
import { CopyBtn } from "./copy-btn";
import { useConnection } from "@/hooks/useConnection";

type ProjectDetailsProps = {
  id: number;
};

export const ProjectDetails = ({ id }: ProjectDetailsProps) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { account } = useConnection();

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

  if (!project) {
    return (
      <Alert className="max-w-3xl">
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
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
    <Card className="max-w-[1000px] w-full relative">
      <Image
        src={
          (project.assets.find((asset) => asset.type === "banner") || {})
            .imagePath || "/gradient2.jpeg"
        }
        width={1000}
        height={500}
        objectFit="cover"
        alt={project.name}
        className="rounded-t-lg h-[500px] w-full object-cover"
      />
      <Link href="/" className="absolute top-2 left-4">
        <Button variant="outline">
          <ChevronLeftIcon />
        </Button>
      </Link>
      {project.owner === account && (
        <Link href={`/update-project/${id}`} className="absolute top-2 right-4">
          <Button variant="outline">
            <Pencil2Icon />
          </Button>
        </Link>
      )}
      <CardHeader className="relative">
        <Image
          width={100}
          height={100}
          objectFit="cover"
          alt={project.name || "/Logo.png"}
          src={
            (project.assets.find((asset) => asset.type === "icon") || {})
              .imagePath || ""
          }
          className="bg-white rounded-full border-black border-4 absolute top-[-50px] left-4 h-[100px] object-cover"
        />
        <div className="!mt-10 flex flex-col md:flex-row md:justify-between gap-4">
          <div className="flex flex-col gap-4">
            <CardTitle className="text-2xl">{project.name}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
            <div className="flex gap-2 mt-4 flex-wrap">
              {project.tags &&
                project.tags.length > 0 &&
                project.tags?.map((tag: Tag) => (
                  <Badge variant="outline" key={tag.name}>
                    {tag.name}
                  </Badge>
                ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 md:justify-center md:items-center">
            <div className="flex gap-4">
              {project.twitter && (
                <Link
                  href={project.twitter}
                  target="_blank"
                  aria-label="Twitter"
                >
                  <TwitterIcon
                    className={clsx(
                      "transition ease-in-out duration-300",
                      "hover:text-primary"
                    )}
                  />
                </Link>
              )}
              {project.discord && (
                <Link
                  href={project.discord}
                  target="_blank"
                  aria-label="Discord"
                >
                  <DiscordIcon
                    className={clsx(
                      "transition ease-in-out duration-300",
                      "hover:text-primary"
                    )}
                  />
                </Link>
              )}
              {project.github && (
                <Link href={project.github} target="_blank" aria-label="Github">
                  <GithubIcon
                    className={clsx(
                      "transition ease-in-out duration-300",
                      "hover:text-primary"
                    )}
                  />
                </Link>
              )}
              {project.telegram && (
                <Link
                  href={project.telegram}
                  target="_blank"
                  aria-label="Telegram"
                >
                  <TelegramIcon
                    className={clsx(
                      "transition ease-in-out duration-300",
                      "hover:text-primary"
                    )}
                  />
                </Link>
              )}
              {project.documentation && (
                <Link
                  href={project.documentation}
                  target="_blank"
                  aria-label="Documentation"
                >
                  <DocsIcon
                    className={clsx(
                      "transition ease-in-out duration-300",
                      "hover:text-primary"
                    )}
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {project.assets && project.assets.length > 0 && <></>}
        {project.contractAddress && (
          <CardDescription className="flex gap-4 flex-wrap items-center">
            Contract address: {shortenAddress(project.contractAddress)}
            <CopyBtn value={project.contractAddress} />
          </CardDescription>
        )}
      </CardContent>
      <CardFooter className="flex justify-between flex-col md:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          {project.tradeLink && (
            <Link href={project.tradeLink} target="_blank">
              <Button variant="outline">Trade link</Button>
            </Link>
          )}
          {project.coinMarketcapLink && (
            <Link href={project.coinMarketcapLink} target="_blank">
              <Button variant="outline">Coin market cap</Button>
            </Link>
          )}
          {project.coingekoLink && (
            <Link href={project.coingekoLink} target="_blank">
              <Button variant="outline">Coingeko</Button>
            </Link>
          )}
          {project.explorerLink && (
            <Link href={project.explorerLink} target="_blank">
              <Button variant="outline">Explorer</Button>
            </Link>
          )}
        </div>
        <Link href={project.link} target="_blank">
          <Button>Check it out</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
