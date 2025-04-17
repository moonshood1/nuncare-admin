import { Admin } from "./AdminResources";
import { User } from "./Doctors";

// Ads
export interface Ad {
  _id: string;
  label: string;
  img: string;
  company: string;
  description: string;
  websiteLink: string;
  isActive: boolean;
  createdBy: Admin["_id"];
  createdAt: string;
  updatedAt: string;
}

export type AdPayload = Pick<
  Ad,
  "label" | "img" | "company" | "description" | "websiteLink"
>;

// articles

export interface Article {
  _id: string;
  title: string;
  description: string;
  content: string;
  img: string;
  coverImage: string;
  isActive: boolean;
  theme?: string;
  author: User["_id"];
  authorName: string;
  likes: User["_id"][];
  isDraft: boolean;
  isPublished: boolean;
  externalLink: string;
  externalLinkTitle: string;
  type: string | null;
  createdAt: string;
  updatedAt: string;
}
