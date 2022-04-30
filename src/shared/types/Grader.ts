export interface GraderResult {
  verdict: string
  verdictCode: number
  totalScore: number
  result: {
    testCase: string
    score: string
    correct: boolean
  }[]
}
