interface HeaderProps {
  eventName: string
}

export function Header({ eventName }: HeaderProps) {
  return (
    <header className="text-center">
      <h1 className="text-2xl font-semibold text-foreground md:text-3xl text-balance">
        {eventName}
      </h1>
    </header>
  )
}
