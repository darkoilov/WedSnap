import Link from "next/link"

const routeExamples = [
  {
    title: "Public Event Page",
    href: "/e/demo-event",
    route: "/e/[eventSlug]",
  },
  {
    title: "Event Gallery",
    href: "/e/demo-event/gallery",
    route: "/e/[eventSlug]/gallery",
  },
  {
    title: "Event Admin",
    href: "/admin/events/demo-event",
    route: "/admin/events/[eventSlug]",
  },
]

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-12 md:px-6 md:py-16">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
        <p className="text-sm text-muted-foreground">WedSnap MVP Foundation</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground md:text-4xl">
          Event-scoped routing is now the default direction
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
          The root route now serves as a neutral project entrypoint while the
          product moves to event-based public, gallery, and admin URLs.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {routeExamples.map((item) => (
            <Link
              key={item.route}
              href={item.href}
              className="rounded-2xl border border-border p-4 transition-colors hover:bg-muted"
            >
              <p className="text-sm text-muted-foreground">{item.title}</p>
              <p className="mt-2 font-mono text-sm text-foreground">{item.route}</p>
            </Link>
          ))}
        </div>

        <Link
          href="/demo"
          className="mt-8 inline-flex w-fit rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Open Prototype Demo Pages
        </Link>
      </div>
    </main>
  )
}
