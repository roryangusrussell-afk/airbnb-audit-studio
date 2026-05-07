import {
  Type,
  MessageSquareText,
  FileText,
  Home,
  Image as ImageIcon,
  Star,
  Building,
  KeyRound,
  AlertCircle,
  MapPin,
  ShieldCheck,
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
  TheSpace: {
    icon: Building,
    iconText: "text-amber-600",
    iconBg: "bg-amber-50",
    subtext: "What guests get when they arrive",
  },
  GuestAccess: {
    icon: KeyRound,
    iconText: "text-emerald-600",
    iconBg: "bg-emerald-50",
    subtext: "Check-in flow and what's accessible",
  },
  OtherNotes: {
    icon: AlertCircle,
    iconText: "text-warning",
    iconBg: "bg-warning-soft",
    subtext: "Honest disclosures that protect reviews",
  },
  Neighborhood: {
    icon: MapPin,
    iconText: "text-blue-600",
    iconBg: "bg-blue-50",
    subtext: "Location specifics that earn the click",
  },
  HouseRules: {
    icon: ShieldCheck,
    iconText: "text-indigo-600",
    iconBg: "bg-indigo-50",
    subtext: "Rules guests need to know up front",
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
