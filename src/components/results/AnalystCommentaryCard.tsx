import {
  Home,
  Type,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  MessageSquareText,
  Star,
  ChevronRight,
} from "lucide-react";
import type { AuditResponse, Issue } from "@/lib/types";

// Truncate text to the first n complete sentences.
function firstNSentences(text: string, n: number): string {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "." || text[i] === "!" || text[i] === "?") {
      count++;
      if (count === n) return text.slice(0, i + 1).trim();
    }
  }
  return text.trim();
}

interface CommentaryRow {
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: string }>;
  softBg: string;
  iconText: string;
}

function deriveIcon(issue: Issue): Pick<CommentaryRow, "icon" | "softBg" | "iconText"> {
  const t = issue.title.toLowerCase();
  if (t.includes("amenit")) {
    return { icon: Home, softBg: "bg-success-soft", iconText: "text-success" };
  }
  if (t.includes("title") || t.includes("heading") || t.includes("character")) {
    return { icon: Type, softBg: "bg-violet-50", iconText: "text-violet-600" };
  }
  if (
    t.includes("photo") ||
    t.includes("image") ||
    t.includes("caption") ||
    t.includes("picture")
  ) {
    return { icon: ImageIcon, softBg: "bg-violet-50", iconText: "text-violet-600" };
  }
  if (
    t.includes("review") ||
    t.includes("reply") ||
    t.includes("response") ||
    t.includes("host reply")
  ) {
    return { icon: MessageSquare, softBg: "bg-brand-soft", iconText: "text-brand" };
  }
  if (t.includes("description")) {
    return { icon: FileText, softBg: "bg-sky-50", iconText: "text-sky-600" };
  }
  if (t.includes("overview") || t.includes("opening")) {
    return { icon: MessageSquareText, softBg: "bg-brand-soft", iconText: "text-brand" };
  }
  if (issue.type === "perception_risk") {
    return { icon: MessageSquare, softBg: "bg-brand-soft", iconText: "text-brand" };
  }
  return { icon: FileText, softBg: "bg-muted", iconText: "text-muted-foreground" };
}

interface Props {
  data: AuditResponse;
  introText: string;
}

export function AnalystCommentaryCard({ data, introText }: Props) {
  const rows: CommentaryRow[] = data.issues.slice(0, 4).map((issue) => ({
    title: issue.title,
    body: firstNSentences(issue.problem, 1),
    ...deriveIcon(issue),
  }));

  return (
    <div className="rounded-[24px] border border-[#EDE8E6] bg-white p-7 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brand">
        Analyst commentary
      </div>
      <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1F1F24]">
        What we picked up.
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#3F4048]">
        {firstNSentences(introText, 3)}
      </p>

      <div className="mt-6 space-y-3">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-[18px] border border-[#EDE8E6] bg-white p-4"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] ${row.softBg} ${row.iconText}`}
            >
              <row.icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[#1F1F24]">{row.title}</div>
              <div className="mt-0.5 text-xs leading-5 text-[#6D6E78] line-clamp-2">{row.body}</div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-[#8A8B95]" aria-hidden="true" />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-4 rounded-[18px] border border-[#F9D99B] bg-[#FFF7E8] p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white text-[#F59E0B]">
          <Star className="h-5 w-5 fill-current" aria-hidden="true" />
        </div>
        <div>
          <div className="text-sm font-semibold text-[#F59E0B]">Bottom line takeaway</div>
          <div className="mt-1 text-xs leading-5 text-[#3F4048]">
            {firstNSentences(data.verdict, 2)}
          </div>
        </div>
      </div>
    </div>
  );
}
