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
    <div>
      <h1 className="text-lg text-blue-700 hover:text-blue-500">
        {srNo}. {title}
      </h1>
    </div>
  )
}
