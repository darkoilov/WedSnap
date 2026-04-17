import Link from "next/link"

export default function AdminIndexPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-12 md:px-6 md:py-16">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Route Repurposed</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground md:text-3xl">
          Admin is event-scoped
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Use the event-specific admin route instead of the old prototype page.
        </p>
        <p className="mt-4 font-mono text-sm text-foreground">
          /admin/events/[eventSlug]
        </p>
        <Link
          href="/admin/events/demo-event"
          className="mt-6 inline-flex w-fit rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Open Sample Admin Route
        </Link>
      </div>
    </main>
  )
}
