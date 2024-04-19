import React from "react";
import { Spotlight } from "./ui/spotlight";
import { Navigation } from "@/components/navigation";
import { Button } from "./ui/button";
import Link from "next/link";

export function SpotlightPreview() {
  return (
    <div className="h-[35rem] w-full rounded-md  bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden flex flex-col justify-between">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-10">
        <Navigation />
      </div>
      <div className="flex md:items-center md:justify-center">
        <div className=" p-4 max-w-7xl  mx-auto relative w-full md:pt-0">
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            <span className="text-primary">Ecosystem</span> <br /> is the new
            Taraxa portal.
          </h1>
          <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
            Ecosystem is a comprehensive project showcase platform dedicated to
            the Taraxa blockchain. It serves as a central hub where all projects
            developed within the Taraxa ecosystem.
          </p>
          <div className="flex items-center justify-center mt-10">
            <Link href="/new-project">
              <Button size="lg">Post your project</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
