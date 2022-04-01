import { Button } from "@chakra-ui/react"
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
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../../firebase"
import { useAuthContext } from "../../providers/AuthProvider"
import { Experiment, Lab } from "../../shared/types/Lab"

const ExperimentPage = () => {
  const { user } = useAuthContext()
  const { labId, expId } = useParams()
  const [lab, setLab] = useState<Lab>()
  const [experiment, setExperiment] = useState<Experiment>()
  const [sessionData, setSessionData] = useState<any>()
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleStartExperimentSession = async () => {
    setLoading(true)
    const res = await axios.post("/experiment-sessions", {
      expId,
      labId,
    })
    console.log(res)
    setLoading(false)
    setSessionData(res.data)
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
    <div className="space-y-2 p-4">
      <h1 className="text-2xl  capitalize">
        {lab?.name} / {experiment?.title}
      </h1>
      <h2>{experiment?.description}</h2>
      <p>{experiment?.id}</p>
      <h3 className="text-xl">
        <b>Problem Statement:</b> {experiment?.problemStatement}
      </h3>
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
  )
}

export default ExperimentPage
