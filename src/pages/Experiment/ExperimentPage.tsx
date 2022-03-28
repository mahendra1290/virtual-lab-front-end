import { Button } from "@chakra-ui/react"
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../../firebase"
import { Experiment, Lab } from "../../shared/types/Lab"

const ExperimentPage = () => {
  const { labId, expId } = useParams()
  const [lab, setLab] = useState<Lab>()
  const [experiment, setExperiment] = useState<Experiment>()

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

  return (
    <div className="space-y-2 p-4">
      <h1 className="text-2xl  capitalize">
        {lab?.name} / {experiment?.title}
      </h1>
      <h2>{experiment?.description}</h2>
      <h3 className="text-xl">
        <b>Problem Statement:</b> {experiment?.problemStatement}
      </h3>
      <Button>Start Experiment Session</Button>
    </div>
  )
}

export default ExperimentPage
