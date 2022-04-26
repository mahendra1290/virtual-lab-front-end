import { Button, VStack } from "@chakra-ui/react"
import { async } from "@firebase/util"
import axios from "axios"
import {
  collection,
  doc,
  getDoc,
  getDocFromCache,
  getDocs,
  onSnapshot,
  query,
  Timestamp,
  Unsubscribe,
} from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import Header from "../../components/header/header"
import { db } from "../../firebase"
import { Experiment, Lab } from "../../shared/types/Lab"

const LabSessionPage = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [session, setSession] = useState<any>()
  const [students, setStudents] = useState<any>()
  const [experiment, setExperiment] = useState<Experiment>()
  const [lab, setLab] = useState<Lab>()

  const handleEndSession = async () => {
    try {
      const res = await axios.put(`/lab-sessions/${id}`, {
        active: false,
        endedAt: Timestamp.fromDate(new Date()),
      })
      console.log(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleStartSession = async () => {}

  useEffect(() => {
    ;(async () => {
      const labId = searchParams.get("labId")
      const expId = searchParams.get("expId")
      if (labId && expId) {
        const labRef = doc(db, `labs/${labId}`)
        const expRef = doc(db, `labs/${labId}/experiments/${expId}`)
        const labDoc = await getDoc(labRef)
        const expDoc = await getDoc(expRef)
        setLab(labDoc.data() as Lab)
        setExperiment(expDoc.data() as Experiment)
      }
    })()
  }, [])

  // useEffect(() => {
  //   let unsubscribeSession: Unsubscribe
  //   let unsubscribeStudent: Unsubscribe
  //   if (id) {
  //     unsubscribeSession = onSnapshot(
  //       doc(collection(db, "experiment-sessions"), id),
  //       (doc) => {
  //         console.log(doc.data(), "got data")
  //         setSession(doc.data())
  //       }
  //     )
  //     unsubscribeStudent = onSnapshot(
  //       collection(db, "experiment-sessions", id, "students"),
  //       (data) => {
  //         setStudents(data.docs.map((docSnap) => docSnap.data()))
  //         console.log(data.docs)
  //       }
  //     )
  //   }
  //   return () => {
  //     if (unsubscribeSession) {
  //       unsubscribeSession()
  //     }
  //     if (unsubscribeStudent) {
  //       unsubscribeStudent()
  //     }
  //   }
  // }, [])

  console.log(experiment, lab)

  return (
    <>
      <Header
        title={experiment?.title}
        pathList={["lab", "random", "experi one"]}
        rightContent={
          <Button onClick={handleEndSession} colorScheme="green">
            Start Session
          </Button>
        }
      />
      <div className="px-8 py-4">
        <h1>{experiment?.title}</h1>
        <p>{experiment?.problemStatement}</p>
        <h1 className="mb-2 text-2xl">Students: </h1>
        <VStack align="stretch">
          {students?.map((stud: any) => (
            <div className="rounded border-2  p-2 shadow-md">
              {stud.name}
              <p className="font-mono">Code: {stud.code}</p>
            </div>
          ))}
        </VStack>
      </div>
    </>
  )
}

export default LabSessionPage
