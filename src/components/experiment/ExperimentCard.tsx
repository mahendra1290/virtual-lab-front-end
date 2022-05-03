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
      <h1 className="text-lg text-teal-700 hover:text-teal-800 dark:text-teal-500 hover:dark:text-teal-200">
        {srNo}. {title}
      </h1>
    </div>
  )
}
