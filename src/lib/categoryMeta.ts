import {
  Type,
  MessageSquareText,
  FileText,
  Home,
  Image as ImageIcon,
  Star,
  type LucideIcon,
} from "lucide-react";

export type CategoryKey =
  | "Title"
  | "Overview"
  | "Description"
  | "Amenities"
  | "Photos"
  | "Reviews & rating";

export interface CategoryMeta {
  icon: LucideIcon;
  /** Tailwind text colour class for the icon */
  iconText: string;
  /** Tailwind background class for the icon tile */
  iconBg: string;
  /** Diagnostic row subtext */
  subtext: string;
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  Title: {
    icon: Type,
    iconText: "text-violet-600",
    iconBg: "bg-violet-50",
    subtext: "Clarity, keyword use, and guest appeal",
  },
  Overview: {
    icon: MessageSquareText,
    iconText: "text-brand",
    iconBg: "bg-brand-soft",
    subtext: "Hook, relevance, and first impression",
  },
  Description: {
    icon: FileText,
    iconText: "text-sky-600",
    iconBg: "bg-sky-50",
    subtext: "Detail, clarity, and conversion power",
  },
  Amenities: {
    icon: Home,
    iconText: "text-success",
    iconBg: "bg-success-soft",
    subtext: "Relevance, completeness, and desirability",
  },
  Photos: {
    icon: ImageIcon,
    iconText: "text-violet-600",
    iconBg: "bg-violet-50",
    subtext: "Quality, quantity, and room coverage",
  },
  "Reviews & rating": {
    icon: Star,
    iconText: "text-success",
    iconBg: "bg-success-soft",
    subtext: "Social proof, sentiment, and trust",
  },
};

export function getCategoryMeta(name: string): CategoryMeta {
  return (
    CATEGORY_META[name] ?? {
      icon: Type,
      iconText: "text-muted-foreground",
      iconBg: "bg-muted",
      subtext: "",
    }
  );
}
