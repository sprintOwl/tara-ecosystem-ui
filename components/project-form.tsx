"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
  AssetType,
  ImageUpload,
  Project,
  ProjectCreate,
} from "@/lib/models/project";
import { Tag } from "@/lib/models/tag";
import { useRouter } from "next/navigation";
import { useConnection } from "@/hooks/useConnection";
import { RocketIcon } from "@radix-ui/react-icons";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { LoadingSpinner } from "./ui/spinner";
import { onFileUpload } from "../lib/upload-image";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  icon: z.string().optional(),
  banner: z.string().optional(),
  link: z.string().min(2, {
    message: "Link must be at least 2 characters.",
  }),
  twitter: z.string().optional(),
  telegram: z.string().optional(),
  documentation: z.string().optional(),
  tradeLink: z.string().optional(),
  coinMarketcapLink: z.string().optional(),
  coingekoLink: z.string().optional(),
  discord: z.string().optional(),
  github: z.string().optional(),
  contractAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, {
      message: "Invalid Ethereum contract address.",
    })
    .optional(),
  explorerLink: z.string().optional(),
  tags: z.array(z.number()).min(1, "Please select at least one tag."),
});

export type ProjectFormProps = {
  project?: Project;
};

export function ProjectForm({ project }: ProjectFormProps) {
  const isUpdating = !!project;
  const { isConnected, account } = useConnection();
  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
  const [hasExistingIcon, setHasExistingIcon] = useState(
    !!project?.assets.find((asset) => asset.type === "icon")
  );
  const [hasExistingBanner, setHasExistingBanner] = useState(
    !!project?.assets.find((asset) => asset.type === "banner")
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tags, setTags] = useState<Tag[]>([]);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/get-tags`)
      .then((response) => response.json())
      .then((data: Tag[]) => {
        if (data.length > 0) {
          setTags(data);
        }
        setIsLoading(false);
      });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: project
      ? {
          ...project,
          tags: project.tags.map((tag) => tag.id),
        }
      : {
          name: "",
          description: "",
          icon: "",
          banner: "",
          link: "",
          twitter: "",
          telegram: "",
          documentation: "",
          tradeLink: "",
          coinMarketcapLink: "",
          coingekoLink: "",
          discord: "",
          github: "",
          contractAddress: "",
          explorerLink: "",
          tags: [],
          // name: "Test Project",
          // description: "Some description here.",
          // icon: "",
          // banner: "",
          // link: "https://shadcn.com",
          // twitter: "https://twitter.com/shadcn",
          // telegram: "https://telegram.com/shadcn",
          // documentation: "https://shadcn.com",
          // tradeLink: "https://shadcn.com",
          // coinMarketcapLink: "https://shadcn.com",
          // coingekoLink: "https://shadcn.com",
          // github: "https://github.com/shadcn",
          // discord: "https://discord.gg/shadcn",
          // contractAddress: "0xA6362Dcb7Db14C357E788C876eE99e1f982f1115",
          // explorerLink:
          //   "https://etherscan.io/address/0x1234567890123456789012345678901234567890",
          // tags: [],
        },
  });

  const { handleSubmit, setError, getValues, setValue } = form;

  if (!isConnected) {
    return (
      <Alert className="max-w-3xl">
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You must be connected to add a new project
        </AlertDescription>
      </Alert>
    );
  }

  // Handle tag selection
  const toggleTag = (tag: number) => {
    const currentTags = getValues("tags");
    if (currentTags.includes(tag)) {
      setValue(
        "tags",
        currentTags.filter((t) => t !== tag),
        { shouldValidate: true }
      );
    } else {
      setValue("tags", [...currentTags, tag], { shouldValidate: true });
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedIcon && !hasExistingIcon) {
      setError("icon", {
        type: "manual",
        message: "Icon is required.",
      });
      return;
    }

    if (!selectedBanner && !hasExistingBanner) {
      setError("banner", {
        type: "manual",
        message: "Banner is required.",
      });
      return;
    }
    setIsLoading(true);

    let icon: ImageUpload | undefined = project?.assets.find(
      (asset) => asset.type === "icon"
    );
    let banner: ImageUpload | undefined = project?.assets.find(
      (asset) => asset.type === "banner"
    );

    if (selectedIcon) {
      try {
        const dataIcon = await onFileUpload(selectedIcon);
        icon = {
          imagePath: dataIcon.imagePath,
          imageMimetype: dataIcon.imageMimetype,
          imageSize: dataIcon.imageSize,
          imageKey: dataIcon.imageKey,
          type: "icon" as AssetType,
        };
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        return;
      }
    }
    if (selectedBanner) {
      try {
        const dataBanner = await onFileUpload(selectedBanner);
        banner = {
          imagePath: dataBanner.imagePath,
          imageMimetype: dataBanner.imageMimetype,
          imageSize: dataBanner.imageSize,
          imageKey: dataBanner.imageKey,
          type: "banner" as AssetType,
        };
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        return;
      }
    }

    if (!icon || !banner) {
      return;
    }

    const payload: ProjectCreate = {
      id: project?.id,
      ...values,
      icon,
      banner,
      owner: account || "",
    };

    const fetchOptions = {
      method: isUpdating ? "PATCH" : "POST",
      body: JSON.stringify({ ...payload }),
    };
    await fetch(
      `/api/${isUpdating ? "update-project" : "create-project"}`,
      fetchOptions
    );

    toast({
      title: `Project ${
        isUpdating ? "updated" : "created"
      }! Once the project is approved, it will be live.`,
    });
    setIsLoading(false);

    // router.push("/", { scroll: false });
  }

  return (
    <Form {...form}>
      <Card className="w-full max-w-[500px]">
        <CardHeader>
          <CardTitle>
            {isUpdating ? "Update project" : "Create project"}
          </CardTitle>
          {!isUpdating && (
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your description here."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="my-8" />
            <div className="flex flex-col gap-y-4">
              {project && hasExistingIcon && !selectedIcon && (
                <div className="flex flex-col gap-2">
                  <Image
                    width={100}
                    height={100}
                    src={
                      (
                        project.assets.find((asset) => asset.type === "icon") ||
                        {}
                      ).imagePath || "/Logo.png"
                    }
                    alt=""
                    className="bg-black block w-[100px] h-[100px] mix-blend-revert rounded inset-0 object-cover"
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    Current icon. Upload a new one to replace it.
                  </p>
                </div>
              )}
              {selectedIcon && (
                <div className="flex flex-col gap-y-4">
                  <Image
                    alt="Project Image"
                    width="200"
                    height={200 / (16 / 9)}
                    src={URL.createObjectURL(selectedIcon)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedIcon(null)}
                  >
                    Remove Image
                  </Button>
                </div>
              )}
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Upload an icon"
                        {...field}
                        id="icon"
                        type="file"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          if (field.onChange) {
                            field.onChange(event);
                          }
                          if (event.target.files) {
                            setSelectedIcon(event.target.files[0]);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>This will be your icon</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="my-8" />
            <div className="flex flex-col gap-y-4">
              {project && hasExistingBanner && !selectedBanner && (
                <div className="flex flex-col gap-2">
                  <Image
                    width={100}
                    height={100}
                    src={
                      (
                        project.assets.find(
                          (asset) => asset.type === "banner"
                        ) || {}
                      ).imagePath || "/gradient2.jpeg"
                    }
                    alt=""
                    className="bg-black block w-[100px] h-[100px] mix-blend-revert rounded inset-0 object-cover"
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    Current banner. Upload a new one to replace it.
                  </p>
                </div>
              )}
              {selectedBanner && (
                <div className="flex flex-col gap-y-4">
                  <Image
                    alt="Project Banner"
                    width="200"
                    height={200 / (16 / 9)}
                    src={URL.createObjectURL(selectedBanner)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedBanner(null)}
                  >
                    Remove Image
                  </Button>
                </div>
              )}
              <FormField
                control={form.control}
                name="banner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Upload a banner"
                        {...field}
                        id="banner"
                        type="file"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          if (field.onChange) {
                            field.onChange(event);
                          }
                          if (event.target.files) {
                            setSelectedBanner(event.target.files[0]);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>This will be your banner</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="my-8" />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Your link here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Twitter link here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telegram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telegram</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Telegram link here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input placeholder="Your GitHub link here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discord"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discord</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Discord link here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="my-8" />
            <FormField
              control={form.control}
              name="documentation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documentation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your documentation link here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tradeLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trade Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Your trade link here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coinMarketcapLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CoinMarketCap Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your CoinMarketCap link here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coingekoLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coingeko Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Coingeko link here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="my-8" />
            <FormField
              control={form.control}
              name="contractAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your contract address here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="explorerLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explorer Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Your explorer link here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" disabled={isLoading}>
                            Select Tags
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Tags (Max 3)</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <div className="h-72 overflow-auto">
                            {tags?.map((tag) => (
                              <DropdownMenuCheckboxItem
                                key={tag.id}
                                checked={form.watch("tags").includes(tag.id)}
                                onCheckedChange={() => toggleTag(tag.id)}
                                disabled={
                                  !form.watch("tags").includes(tag.id) &&
                                  form.watch("tags").length >= 3
                                }
                              >
                                {tag.name}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-2 mt-4">
                {form.getValues("tags").map((tagId) => {
                  const tag = tags.find((t) => t.id === tagId);
                  return (
                    <Badge key={tagId} variant="secondary">
                      {tag && tag.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/">
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}
