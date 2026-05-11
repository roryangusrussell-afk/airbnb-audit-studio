import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";

export function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="flex-1">
        <div className="container max-w-[760px] px-4 py-10 sm:px-6 sm:py-14">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to the audit
          </Link>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-[12.5px] text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
          <article className="prose prose-neutral mt-8 max-w-none text-[14.5px] leading-7 text-foreground [&_h2]:mt-8 [&_h2]:text-[18px] [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-6 [&_h3]:text-[15px] [&_h3]:font-semibold [&_p]:mt-3 [&_p]:text-muted-foreground [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5 [&_li]:text-muted-foreground [&_a]:text-foreground [&_a]:underline">
            {children}
          </article>
        </div>
      </div>
      <Footer />
    </main>
  );
}
