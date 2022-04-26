import { Button, VStack } from "@chakra-ui/react"
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
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { db } from "../../firebase"
import { useAuthContext } from "../../providers/AuthProvider"
import { Experiment, Lab, LabSession } from "../../shared/types/Lab"
import Header from "../../components/header/header"
import { nanoid } from "nanoid"

const ExperimentPage = () => {
  const { user } = useAuthContext()
  const { labId, expId } = useParams()
  const [lab, setLab] = useState<Lab>()
  const [experiment, setExperiment] = useState<Experiment>()
  const [sessionData, setSessionData] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [labSessions, setLabSessions] = useState<LabSession[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
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
          console.log("lab snap", docSnap.data())
        }
      })
      getDoc(doc(expCollection, expId)).then((expDocSnap) => {
        if (expDocSnap.exists()) {
          console.log(expDocSnap.data(), "exp")
          setExperiment(expDocSnap.data() as Experiment)
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

  return (
    <>
      <Header
        title={experiment?.title || ""}
        pathList={[[`/t/labs/${lab?.id}`, lab?.name], experiment?.title || ""]}
      />
      <div className="mt-4 space-y-2 px-8">
        <h3 className="text-xl">
          <b>Problem Statement:</b> {experiment?.problemStatement}
        </h3>
        <h1>Sessions</h1>
        <VStack align="flex-start">
          {labSessions
            .filter((val) => val.active)
            .map((val) => (
              <Link
                className="rounded border-2 p-4"
                to={`/t/lab-session/${val.id}`}
              >
                {val.id}
              </Link>
            ))}
        </VStack>
        {user?.role === "teacher" && (
          <Button
            isLoading={loading}
            loadingText={"Starting Session"}
            onClick={handleStartExperimentSession}
          >
            Start Experiment Session
          </Button>
        )}
      </div>
    </>
  )
}

export default ExperimentPage
