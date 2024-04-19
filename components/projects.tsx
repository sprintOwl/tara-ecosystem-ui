"use client";

import { useEffect, useState } from "react";
import { HoverEffect } from "./ui/card-hover-effect";
import { Project } from "@/lib/models/project";
import { RocketIcon } from "@radix-ui/react-icons";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import Link from "next/link";
import { Tag } from "@/lib/models/tag";
import { Badge } from "./ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "./ui/spinner";

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState<boolean>(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);
  const isLoading = isLoadingProjects || isLoadingTags;

  useEffect(() => {
    setIsLoadingTags(true);
    fetch(`/api/get-tags`)
      .then((response) => response.json())
      .then((data: Tag[]) => {
        if (data.length > 0) {
          setTags(data);
        }
        setIsLoadingTags(false);
      });
  }, []);

  useEffect(() => {
    const query = new URLSearchParams({
      tagNames: selectedTags.join(","),
    }).toString();
    setIsLoadingProjects(true);
    fetch(`/api/get-projects?${query}`)
      .then((response) => response.json())
      .then((data: Project[]) => {
        if (data.length > 0) {
          setProjects(data);
        } else {
          setProjects([]);
        }
        setIsLoadingProjects(false);
      });
  }, [selectedTags]);

  const toggleTagSelection = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const hoverProjects = projects?.map((project) => ({
    ...project,
    link: "/project/" + project.id,
  }));

  // if (isLoading) {
  //   return (
  //     <div className="max-w-5xl mx-auto px-8 py-10">
  //       <div className="flex gap-2 mt-4 flex-wrap mb-4">
  //         {Array.from({ length: 12 }).map((_, index) => (
  //           <Badge key={index} variant="default" className="animate-pulse">
  //             Loading
  //           </Badge>
  //         ))}
  //       </div>
  //       <div className="flex flex-wrap gap-2">
  //         {Array.from({ length: 3 }).map((_, index) => (
  //           <Skeleton className="h-[244px] w-[310px] rounded-2xl" key={index} />
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <div className="flex gap-2 mt-4 flex-wrap mb-4">
        {tags && tags.length > 0 && (
          <>
            {tags?.map((tag: Tag) => (
              <Badge
                variant={
                  selectedTags.includes(tag.name) ? "default" : "outline"
                }
                key={tag.name}
                className="cursor-pointer"
                onClick={() => toggleTagSelection(tag.name)}
              >
                {tag.name}
              </Badge>
            ))}
            {selectedTags.length > 0 && (
              <Button
                size="sm"
                className="max-h-[22px]"
                variant="destructive"
                onClick={() => setSelectedTags([])}
              >
                Clear
              </Button>
            )}
          </>
        )}
      </div>
      <div className="h-10 flex items-center justify-center">
        {isLoading && <LoadingSpinner className="text-primary" size={32} />}
      </div>
      {projects.length > 0 ? (
        <HoverEffect items={hoverProjects} />
      ) : (
        <div className="max-w-5xl mx-auto py-10 px-8">
          <Alert className="max-w-3xl">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              It seems there aren`t any projects found.{" "}
              {selectedTags.length > 0 ? (
                "Try other categories"
              ) : (
                <div>
                  Start adding on{" "}
                  <Link href="/new-project">
                    <Button size="sm" variant="outline">
                      HERE
                    </Button>
                  </Link>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
