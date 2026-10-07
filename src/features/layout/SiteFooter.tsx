import { Link } from "@tanstack/react-router";
import { business } from "@/features/business/data";
import { Container } from "@/shared/ui/Section";
import { Wordmark } from "@/shared/ui/Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-ink-deep pt-16 pb-28 text-on-ink-dim md:pb-12">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" aria-label="Marios Garage, home" className="text-on-ink">
              <Wordmark />
            </Link>
            <p className="mt-5 max-w-sm">
              Independent car servicing, diagnostics and engine repair in {business.area}.
            </p>
          </div>

          <div>
            <h2 className="font-sans text-sm font-semibold text-on-ink">Visit</h2>
            <p className="mt-3">
              <a href={business.phoneHref} className="text-on-ink hover:text-signal">
                {business.phoneDisplay}
              </a>
              <br />
              {business.address}
              <br />
              Monday to Friday, 8:00 – 17:00
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-sans text-sm font-semibold text-on-ink">Pages</h2>
            <ul className="mt-3 space-y-1.5">
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-on-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={business.googleListingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-on-ink"
                >
                  Google listing
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-on-ink-dim/80 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {business.name}
          </p>
          <p>
            3D model “Mercedes E-Class W212” by{" "}
            <a
              href="https://sketchfab.com/3d-models/mercedes-e-class-w212-119c5e10733142b197aa53b86f6aeb04"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-on-ink"
            >
              Peter_D
            </a>
            , licensed CC BY 4.0
          </p>
        </div>
      </Container>
    </footer>
  );
}
