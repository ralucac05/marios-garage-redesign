import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { business } from "@/features/business/data";
import { ButtonLink } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Section";
import { Wordmark } from "@/shared/ui/Logo";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/90 text-on-ink backdrop-blur-md supports-[backdrop-filter]:bg-ink/75">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-signal focus:px-3 focus:py-2 focus:text-ink-deep"
      >
        Skip to content
      </a>
      <Container className="flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <Link to="/" aria-label="Marios Garage, home" className="text-on-ink">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ "aria-current": "page", className: "text-on-ink after:scale-x-100" }}
              inactiveProps={{ className: "text-on-ink-dim" }}
              className="relative px-3 py-2 text-[0.95rem] font-medium transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-signal after:transition-transform hover:text-on-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href={business.phoneHref} className="hidden sm:inline-flex">
            <Phone aria-hidden="true" />
            {business.phoneDisplay}
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex size-11 items-center justify-center rounded-md border border-white/15 text-on-ink md:hidden"
          >
            {open ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </Container>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        hidden={!open}
        className="border-t border-white/10 bg-ink md:hidden"
      >
        <Container className="py-3">
          <ul>
            {[{ to: "/", label: "Home" } as const, ...nav].map((item) => (
              <li key={item.to} className="border-b border-white/10 last:border-0">
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "text-on-ink" }}
                  inactiveProps={{ className: "text-on-ink-dim" }}
                  className="block py-3.5 font-display text-2xl font-bold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  );
}
