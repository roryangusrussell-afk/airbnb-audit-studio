import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UrlForm } from "./UrlForm";
import { PreviewPanel } from "./PreviewPanel";

export function Hero({ onSubmit }: { onSubmit: (url: string) => void }) {
  return (
    <section className="container py-12 md:py-20 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="eyebrow mb-5">Auditable · For Airbnb hosts</div>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
            See exactly what your Airbnb listing should fix first.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Paste your listing URL. We score 6 categories, flag the highest-impact gaps,
            and write the rewrites for you. Free, in under a minute.
          </p>

          <div className="mt-8 max-w-xl">
            <UrlForm onSubmit={onSubmit} />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" size="sm" className="rounded-lg">
                <Link to="/sample">View sample report</Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Free · Read-only · No login · Nothing edited
              </p>
            </div>
          </div>
        </div>

        <div className="lg:pl-6">
          <PreviewPanel />
        </div>
      </div>
    </section>
  );
}
