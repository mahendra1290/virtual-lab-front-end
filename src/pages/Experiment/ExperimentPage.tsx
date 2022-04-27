import { Button, Divider, HStack, VStack } from "@chakra-ui/react"
import axios from "axios"
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import draftToHtml from "draftjs-to-html"

import { db } from "../../firebase"
import { useAuthContext } from "../../providers/AuthProvider"
import { Experiment, Lab, LabSession } from "../../shared/types/Lab"
import Header from "../../components/header/header"
import { nanoid } from "nanoid"
import LabMenuPanel from "../../components/labs/LabMenuPanel"

const ExperimentPage = () => {
  const { user } = useAuthContext()
  const { labId, expId } = useParams()
  const [lab, setLab] = useState<Lab>()
  const [experiment, setExperiment] = useState<Experiment>()
  const [sessionData, setSessionData] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [labSessions, setLabSessions] = useState<LabSession[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeSection, setActiveSection] = useState("")
  const navigate = useNavigate()

  const handleStartExperimentSession = async () => {
    if (lab && experiment) {
      navigate(`/t/lab-session/${nanoid()}?labId=${labId}&expId=${expId}`)
    }
  }

  useEffect(() => {
    if (labId && expId) {
      const labCollection = collection(db, "labs")
      const expCollection = collection(db, "labs", labId, "experiments")
      getDoc(doc(labCollection, labId)).then((docSnap) => {
        if (docSnap.exists()) {
          setLab(docSnap.data() as Lab)
        }
      })
      getDoc(doc(expCollection, expId)).then((expDocSnap) => {
        if (expDocSnap.exists()) {
          const expData = expDocSnap.data() as Experiment
          setExperiment(expData)
          setActiveSection(expData.sections?.at(0)?.name || "")
        }
      })
    }
    ;(async () => {
      const result = await axios.get<LabSession[]>("lab-sessions", {
        params: {
          labId,
          expId,
        },
      })
      console.log(result, "res")
      setLabSessions(result.data)
    })()
  }, [labId, expId])

  useEffect(() => {
    let unsubscribe: Unsubscribe
    if (sessionData) {
      navigate(`/t/lab-session/${sessionData.id}`)
      // console.log(sessionData, "ses data")
      // unsubscribe = onSnapshot(
      //   doc(collection(db, "experiment-sessions"), sessionData.id),
      //   (doc) => {
      //     console.log(doc.data(), "got data")
      //   }
      // )
    }
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [sessionData])

  const sectionData = useMemo(() => {
    const obj: { [key: string]: string } = {}
    experiment?.sections?.forEach((section) => {
      obj[section.name] = draftToHtml(section.editorState)
    })
    return obj
  }, [experiment])

  return (
    <>
      <Header
        title={experiment?.title || ""}
        pathList={[[`/t/labs/${lab?.id}`, lab?.name], experiment?.title || ""]}
        rightContent={
          <HStack>
            <Button colorScheme={"blue"}>Start Session</Button>
            <Button colorScheme={"green"}>Edit</Button>
            <Button colorScheme={"red"}>Delete</Button>
          </HStack>
        }
      />
      <div>
        <div className="flex gap-4 px-8 py-4">
          <LabMenuPanel
            activeMenu={activeSection}
            onChange={setActiveSection}
            className="w-1/4 rounded-md border p-4"
            menus={experiment?.sections?.map((section) => section.name)}
          />
          <div className="w-3/4 rounded-md border p-4">
            <h1 className="mb-2 text-xl">{activeSection}</h1>
            <Divider />
            <div
              className="reset-tailwindcss"
              dangerouslySetInnerHTML={{
                __html: sectionData[activeSection],
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ExperimentPage
