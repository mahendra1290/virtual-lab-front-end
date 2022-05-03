import { Experiment, LabSession } from './Lab';
import { Timestamp } from 'firebase/firestore';
export interface GraderResult {
  verdict: string
  verdictCode: number
  totalScore: number
  scoreReceived: number
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
  session: LabSession
  expId: string,
  labId: string,
  runnedAt: Timestamp
  graderResult: GraderResult
  experiment?: Experiment
}
