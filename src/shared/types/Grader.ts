import { Experiment } from './Lab';
import { Timestamp } from 'firebase/firestore';
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

export interface StudentWork {
  uid: string,
  code: string,
  lang: string,
  sessionId: string,
  expId: string,
  labId: string,
  runnedAt: Timestamp
  graderResult: GraderResult
  experiment?: Experiment
}
