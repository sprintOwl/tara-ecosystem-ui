"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "./badge";
import { Project } from "@/lib/models/project";
import Image from "next/image";

export const HoverEffect = ({
  items,
  className,
}: {
  items: Project[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          href={item?.link}
          key={item?.link}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-primary/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className="flex flex-col justify-center items-center">
            <Image /* blurred background */
              src={
                (item.assets.find((asset) => asset.type === "banner") || {})
                  .imagePath || "/gradient2.jpeg"
              }
              alt=""
              className="absolute inset-0 w-full h-full filter blur-[48px] opacity-64 z-[-1]"
              layout="fill"
              sizes="100px"
            />
            <Image
              width={100}
              height={100}
              src={
                (item.assets.find((asset) => asset.type === "icon") || {})
                  .imagePath || "/Logo.png"
              }
              alt=""
              className="bg-black block w-[100px] h-[100px] mix-blend-revert rounded inset-0 object-cover"
            />
            <CardTitle>{item.name}</CardTitle>
            <div className="flex gap-2 mt-4">
              {item.tags &&
                item.tags.length > 0 &&
                item.tags?.map((tag) => (
                  <Badge variant="outline" key={tag.id}>
                    {tag.name}
                  </Badge>
                ))}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-primary/[0.2] group-hover:border-primary relative z-20",
        className
      )}
    >
      <div className="relative z-30">
        <div className="p-4 flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
