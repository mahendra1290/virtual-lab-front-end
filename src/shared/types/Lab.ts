import { Timestamp } from "firebase/firestore"
import { RawDraftContentState } from "react-draft-wysiwyg"

export type LabJoiningLink = {
  code: string
  url: string
  expiryTimestamp: Timestamp
}

export type Lab = {
  id: string
  name: string
  userUid: string
  visibility: string
  createdAt: Date
  sectionData?: {
    name: string
    editorState: RawDraftContentState
    order: number
  }[]
  students?: {
    uid: string
    name: string
    joinedAt: Timestamp
    email: string
  }[]
  joiningLink?: LabJoiningLink
}

export type Experiment = {
  id: string
  title: string
  description?: string
  problemStatement: string
  sections?: { id: string; name: string; editorState: RawDraftContentState }[]
}

export interface LabSession {
  id: string
  labId: string
  expId: string
  expName?: string
  uid: string
  active: boolean
  startedAt: Timestamp,
  endedAt: Timestamp
}

export interface Input {
  score: number
  content: string
  name: string
}

export interface Output {
  content: string
  name: string
  score: number
}
export interface TestCase {
  inputs: Input[]
  outputs: Output[]
}
