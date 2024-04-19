import { Tag } from "./tag";

export type AssetType = "icon" | "banner";

export type Asset = {
  id?: number;
  imagePath: string;
  imageMimetype: string;
  imageSize: string;
  imageKey: string;
  type: AssetType;
  projectId?: number;
};

export type Project = {
  id: number;
  owner: string;
  name: string;
  description: string;
  link: string;
  twitter?: string;
  telegram?: string;
  documentation?: string;
  tradeLink?: string;
  coinMarketcapLink?: string;
  coingekoLink?: string;
  github?: string;
  discord?: string;
  contractAddress?: string;
  isModerated: boolean;
  explorerLink?: string;
  tags: Tag[];
  assets: Asset[];
};

export type ImageUpload = Omit<Asset, "id" | "projectId">

export type ProjectCreate = Omit<
  Project,
  "id" | "isModerated" | "assets" | "tags"
> & {
  id?: number;
  tags: number[];
  icon: ImageUpload;
  banner: ImageUpload;
};

export type ProjectUpdate = Omit<Project, "isModerated" | "assets" | "tags"> & {
  tags: number[];
  icon: ImageUpload;
  banner: ImageUpload;
};
