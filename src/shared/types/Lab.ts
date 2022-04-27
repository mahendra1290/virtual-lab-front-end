import { Timestamp } from "firebase/firestore"
import { RawDraftContentState } from "react-draft-wysiwyg"


export type LabJoiningLink = {
  code: string,
  url: string,
  expiryTimestamp: Timestamp
}

export type Lab = {
  id: string,
  name: string,
  userUid: string,
  visibility: string,
  createdAt: Date,
  sectionData?: { [key: string]: RawDraftContentState }
  students?: {
    uid: string,
    name: string,
    email: string
  }[]
  joiningLink?: LabJoiningLink
}

export type Experiment = {
  id: string,
  title: string,
  description?: string,
  problemStatement: string,
  sections?: { id: string, name: string, editorState: RawDraftContentState }[]
}

export interface LabSession {
  id: string,
  labId: string,
  expId: string,
  uid: string,
  active: boolean,
}
