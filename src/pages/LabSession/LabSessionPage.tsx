import { Button, VStack } from "@chakra-ui/react"
import axios from "axios"
import {
  collection,
  doc,
  getDocFromCache,
  getDocs,
  onSnapshot,
  query,
  Timestamp,
  Unsubscribe,
} from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../../firebase"

export const LabSessionPage = () => {
  const { id } = useParams()
  const [session, setSession] = useState<any>()
  const [students, setStudents] = useState<any>()
  const [experiment, setExperiment] = useState<any>()

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

  useEffect(() => {
    let unsubscribeSession: Unsubscribe
    let unsubscribeStudent: Unsubscribe
    if (id) {
      unsubscribeSession = onSnapshot(
        doc(collection(db, "experiment-sessions"), id),
        (doc) => {
          console.log(doc.data(), "got data")
          setSession(doc.data())
        }
      )
      unsubscribeStudent = onSnapshot(
        collection(db, "experiment-sessions", id, "students"),
        (data) => {
          setStudents(data.docs.map((docSnap) => docSnap.data()))
          console.log(data.docs)
        }
      )
    }
    return () => {
      if (unsubscribeSession) {
        unsubscribeSession()
      }
      if (unsubscribeStudent) {
        unsubscribeStudent()
      }
    }
  }, [])

  return (
    <div className="p-4">
      <Button onClick={handleEndSession}>End Session</Button>
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
  )
}
