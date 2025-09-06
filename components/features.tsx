export function FeatureGridItem(props: {
  key: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
      <div className="flex h-[180px] flex-col rounded-md p-6 gap-4">
        {props.icon}
        <div className="space-y-2">
          <h3 className="font-bold">{props.title}</h3>
          <p className="text-sm text-muted-foreground">{props.description}</p>
        </div>
      </div>
    </div>
  )
}

export function FeatureGrid(props: {
  title: string
  subtitle: string
  items: {
    icon: React.ReactNode
    title: string
    description: string
  }[]
}) {
  return (
    <div className="flex max-w-[64rem] flex-col justify-center items-center gap-4 text-center">
      <h2 className="text-3xl md:text-4xl font-semibold">{props.title}</h2>
      <p className="max-w-[85%] text-muted-foreground sm:text-lg">
        {props.subtitle}
      </p>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-5xl md:grid-cols-3">
        {props.items.map(item => (
          <FeatureGridItem key={item.title} {...item} />
        ))}
      </div>
    </div>
  )
}
