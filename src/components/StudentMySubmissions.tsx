import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react"
import {
  collection,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from "firebase/firestore"
import { groupBy } from "lodash"
import { useEffect, useState } from "react"
import { db } from "../firebase"
import { nanoid } from "nanoid"
import moment from "moment"
import Loading from "./Loading"
import { StudentWork } from "../shared/types/Grader"
import CodeViewer from "./CodeViewer"
import GraderPanel from "./GraderPanel"
import { useAuthContext } from "../providers/AuthProvider"
import { Experiment } from "../shared/types/Lab"

interface StudentWorkProps {
  sessionId: string
  experiment?: Experiment
}

const StudentMySubmissions = ({ sessionId, experiment }: StudentWorkProps) => {
  const { user } = useAuthContext()
  const [workLoading, setWorkLoading] = useState(false)
  const [studentWork, setStudentWork] =
    useState<{ [key: string]: StudentWork[] }>()

  const studentUid = user?.uid

  useEffect(() => {
    let unSub: Unsubscribe
    if (studentUid) {
      setWorkLoading(true)
      const workCol = query(
        collection(db, `student-work-${studentUid}`),
        where("sessionId", "==", sessionId)
      )
      unSub = onSnapshot(workCol, (docSnaps) => {
        const data = docSnaps.docs.map((doc) => doc.data())
        const studentWork = data as StudentWork[]
        studentWork.sort((a, b) => {
          if (a.runnedAt.seconds < b.runnedAt.seconds) {
            return -1
          }
          return 0
        })
        const groupedBySession = groupBy(studentWork, "sessionId")
        setStudentWork(groupedBySession)
        setWorkLoading(false)
      })
    }
    return () => {
      if (unSub) {
        unSub()
      }
    }
  }, [studentUid])

  if (workLoading) {
    return <Loading />
  }

  return (
    <div className="px-4">
      <h1 className="px-4 text-xl font-bold">My submissions</h1>
      {Object.entries(studentWork || {}).map(([key, val]) => (
        <div key={nanoid(4)}>
          <div className="flex items-center justify-between px-4 py-2">
            <h1 className="text-lg capitalize">{experiment?.title}</h1>
            <p className="ml-4">
              Started At{" "}
              {moment(val.at(0)?.session?.startedAt.toMillis() || 0).format(
                "DD-MM-YYYY"
              )}
            </p>
          </div>
          <div>
            <Accordion allowToggle>
              {val.map((work, index) => (
                <AccordionItem key={nanoid()}>
                  <AccordionButton className="flex justify-between">
                    <p>
                      {`Run ${moment(work.runnedAt.seconds * 1000).format(
                        "DD-MM-YYYY hh:mm:A"
                      )}`}
                    </p>
                    <p>
                      {work?.graderResult?.totalScore
                        ? `Score: ${work.graderResult.scoreReceived} / ${work.graderResult.totalScore}`
                        : ""}
                    </p>
                  </AccordionButton>
                  <AccordionButton />
                  <AccordionPanel>
                    <p>Lang: {work.lang}</p>
                    <CodeViewer code={work.code} lang={work.lang} />
                    <p>Score: {work?.graderResult?.scoreReceived}</p>
                    <GraderPanel gradeResult={work.graderResult} />
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StudentMySubmissions
