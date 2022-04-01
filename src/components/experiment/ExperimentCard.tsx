type Props = {
  title: string
  description?: string
  problemStatement: string
  id: string
}

export const ExperimentCard = ({
  title,
  description,
  problemStatement,
  id,
}: Props) => {
  return (
    <div className="border-2 px-4 py-2">
      <h1 className="text-2xl">{title}</h1>
      <h2>{description}</h2>
      <h3>{problemStatement}</h3>
    </div>
  )
}
