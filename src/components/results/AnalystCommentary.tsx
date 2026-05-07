import { Star } from "lucide-react";
import { getCategoryMeta } from "@/lib/categoryMeta";
import type { AuditResponse, Issue } from "@/lib/types";

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

function deriveCategoryFromIssue(issue: Issue): string {
  const t = issue.title.toLowerCase();
  if (t.includes("title") || t.includes("heading")) return "Title";
  if (t.includes("photo") || t.includes("image") || t.includes("caption")) return "Photos";
  if (t.includes("description")) return "Description";
  if (t.includes("overview") || t.includes("opening")) return "Overview";
  if (t.includes("amenit")) return "Amenities";
  if (t.includes("review") || t.includes("response") || t.includes("reply")) return "Reviews & rating";
  return "Overview";
}

export function AnalystCommentary({ data }: { data: AuditResponse }) {
  const intro = data.summary ?? data.listingSignals ?? data.verdict;
  const paragraphs = intro
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 2);

  const issues = data.issues.slice(0, 2);

  return (
    <div className="rounded-[20px] border border-[#EDE8E6] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
        Analyst commentary
      </div>
      <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#1F1F24]">
        What we found
      </h2>
      <div className="mt-3 space-y-3 text-[13.5px] leading-6 text-[#3F4048]">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {issues.length > 0 && (
        <>
          <div className="mt-5 mb-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#6D6E78]">
            Key signals
          </div>
          <ul className="space-y-2">
            {issues.map((issue, i) => {
              const meta = getCategoryMeta(deriveCategoryFromIssue(issue));
              const Icon = meta.icon;
              return (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-[#EFEAE7] bg-[#FBFAF9] p-3"
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${meta.iconBg}`}>
                    <Icon className={`h-3.5 w-3.5 ${meta.iconText}`} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-[#1F1F24]">{issue.title}</div>
                    <div className="mt-0.5 text-xs leading-5 text-[#6D6E78] line-clamp-2">
                      {firstNSentences(issue.problem, 1)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <div className="mt-5">
        <div className="flex items-start gap-3 rounded-2xl border border-[#F9D99B] bg-[#FFF7E8] p-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#F59E0B]">
            <Star className="h-4 w-4 fill-current" aria-hidden />
          </div>
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#B4730A]">Bottom line takeaway</div>
            <div className="mt-1 text-[13px] leading-5 text-[#3F4048]">
              {firstNSentences(data.verdict, 1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
