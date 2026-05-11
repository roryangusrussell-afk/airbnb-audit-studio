import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer
      data-print-hide
      className="mt-16 border-t bg-background"
    >
      <div className="container max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-[12.5px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="leading-relaxed">
            Auditable is a free listing diagnostic built by Rory Russell, an Airbnb operator in Lisbon.
            Audits are automated and don't constitute financial or legal advice.
          </p>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px]">
            <Link to="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-foreground">
              Cookies
            </Link>
            <a
              href="mailto:roryangusrussell@gmail.com"
              className="hover:text-foreground"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
