import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Textarea,
  VStack,
} from "@chakra-ui/react"
import { collection, getDocs } from "firebase/firestore"
import { groupBy } from "lodash"
import React, { useEffect, useState } from "react"
import { db } from "../../firebase"
import { StudentWork } from "../../shared/types/Grader"
import { Experiment } from "../../shared/types/Lab"
import Loading from "../Loading"
import { nanoid } from "nanoid"
import GraderPanel from "../GraderPanel"
import moment from "moment"
import CodeViewer from "../CodeViewer"

interface StudentWorkProps {
  studentUid: string
  experiments: Experiment[]
}

const StudentWorkViewer = ({ studentUid, experiments }: StudentWorkProps) => {
  const [workLoading, setWorkLoading] = useState(false)
  const [studentWork, setStudentWork] =
    useState<{ [key: string]: StudentWork[] }>()

  console.log(experiments, "Exp")

  useEffect(() => {
    if (studentUid && experiments.length > 0) {
      setWorkLoading(true)
      const workCol = collection(db, `student-work-${studentUid}`)
      getDocs(workCol)
        .then((docSnaps) => {
          const data = docSnaps.docs.map((doc) => doc.data())
          const studentWork = data as StudentWork[]

          studentWork.forEach((work) => {
            work.experiment = experiments.find((exp) => exp.id === work.expId)
          })
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
        .catch((err) => setWorkLoading(false))
    }
  }, [studentUid, experiments])

  if (workLoading) {
    return <Loading />
  }

  return (
    <Accordion allowToggle>
      {Object.entries(studentWork || {}).map(([key, val]) => (
        <AccordionItem key={nanoid(4)}>
          <div className="flex items-center justify-between py-2">
            <AccordionButton>
              <h1 className="text-lg capitalize">
                {val.at(0)?.experiment?.title || key} Experiment
              </h1>
              <p className="ml-4">
                Started At{" "}
                {moment(val.at(0)?.session?.startedAt.toMillis() || 0).format(
                  "DD-MM-YYYY"
                )}
              </p>
            </AccordionButton>
            <AccordionIcon />
          </div>
          <AccordionPanel>
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
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default StudentWorkViewer
