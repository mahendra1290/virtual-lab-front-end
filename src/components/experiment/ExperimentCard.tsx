type Props = {
  title: string
  description?: string
  problemStatement: string
  id: string
  srNo: Number
}

export const ExperimentCard = ({
  srNo,
  title,
  description,
  problemStatement,
  id,
}: Props) => {
  return (
    <div className="px-2 py-2">
      <h1 className="text-2xl text-blue-700 hover:text-blue-500">{srNo}. {title}</h1>
      <h2>{description}</h2>
      <h3>{problemStatement}</h3>
    </div>
  )
}
