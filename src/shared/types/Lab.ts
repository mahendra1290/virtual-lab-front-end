export type Lab = {
  id: string,
  name: string,
  userUid: string,
}

export type Experiment = {
  id: string,
  title: string,
  description?: string,
  problemStatement: string,
}

export interface LabSession {
  id: string,
  labId: string,
  expId: string,
  uid: string,
  active: boolean,
}
