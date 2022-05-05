import { nanoid } from "nanoid"
import React from "react"
import { GraderResult } from "../shared/types/Grader"

interface GraderPanelProps {
  gradeResult?: GraderResult
}

const GraderPanel = ({ gradeResult }: GraderPanelProps) => {
  console.log(gradeResult)

  if (!gradeResult) {
    return <div>No result</div>
  }

  let color = "text-green-400"

  if (gradeResult.verdictCode == 1) {
    color = "text-orange-400"
  }

  if (gradeResult.verdictCode == 0) {
    color = "text-red-400"
  }

  return (
    <div className="h-full space-y-2 rounded-md bg-gray-50 p-2 dark:bg-gray-800 ">
      <h1 className={`${color} text-xl font-bold`}>{gradeResult.verdict}</h1>
      <h2 className="text-lg font-bold">Score: {gradeResult.totalScore}</h2>
      {gradeResult.result.map((res) => (
        <div
          key={nanoid()}
          className={`${
            res.correct
              ? "bg-green-100 dark:bg-green-600"
              : "bg-red-100 dark:bg-red-500"
          } mb-2 flex justify-between rounded border px-2 py-2`}
        >
          <p>Test {res.testCase}</p>
          <p>{res.score}</p>
        </div>
      ))}
    </div>
  )
}

export default GraderPanel
