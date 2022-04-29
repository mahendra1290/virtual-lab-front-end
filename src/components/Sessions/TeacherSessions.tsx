import { useToast, VStack } from "@chakra-ui/react"
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
import { useAuthContext } from "../../providers/AuthProvider"
import { Link, useParams } from "react-router-dom"
import Header from "../header/header"
import Loading from "../Loading"
import { db } from "../../firebase"
import moment from "moment"
import { Experiment, Lab, LabSession } from "../../shared/types/Lab"

interface ILabSession {
  uid: string
  startedAt: Timestamp
  lab: Lab
  exp: Experiment
  labId: string
  expId: string
  active: boolean
}

interface JoinedStudent {
  uid: string
  email: string
  name: string
  active: boolean
}

interface TeacherSessionProps {
  lab: Lab
  experiments: Experiment[]
}

const TeacherSessions = ({ lab, experiments }: TeacherSessionProps) => {
  const { id } = useParams()
  const [session, setSession] = useState<ILabSession>()
  const [students, setStudents] = useState<JoinedStudent[]>([])
  const [sessionData, setSessionData] = useState<any[]>([])
  const toast = useToast()
  const [dataLoading, setDataLoading] = useState(false)
  const { user } = useAuthContext()

  console.log(experiments, " experiemnts ")
  useEffect(() => {
    const fetchLabSessionDetails = async () => {
      try {
        if (user?.uid) {
          setDataLoading(true)
          ;(async () => {
            const result = await axios.get<any[]>("lab-sessions", {
              params: {
                id: user?.uid,
                labId: lab?.id,
              },
            })
            console.log(result, "res")
            setSessionData(result.data)
            setDataLoading(false)
          })()
        }
      } catch (err) {
        toast({
          title: "Not found",
          duration: 2000,
        })
        setDataLoading(false)
      }
    }
    fetchLabSessionDetails()
  }, [])

  //   useEffect(() => {
  //     let unsubscribeSession: Unsubscribe
  //     let unsubscribeStudent: Unsubscribe
  //     if (id) {
  //       // unsubscribeSession = onSnapshot(
  //       //   doc(collection(db, "experiment-sessions"), id),
  //       //   (doc) => {
  //       //     console.log(doc.data(), "got data")
  //       //     setSession(doc.data())
  //       //   }
  //       // )
  //       unsubscribeStudent = onSnapshot(
  //         doc(db, "session-students", `session-${id}`),
  //         (data) => {
  //           setStudents(data?.data()?.students as JoinedStudent[])
  //           console.log(data.data(), "update")
  //         }
  //       )
  //     }
  //     return () => {
  //       if (unsubscribeSession) {
  //         unsubscribeSession()
  //       }
  //       if (unsubscribeStudent) {
  //         unsubscribeStudent()
  //       }
  //     }
  //   }, [])

  if (dataLoading) {
    return <Loading />
  }

  console.log(sessionData, " session data")

  return (
    <>
      <div className="py-4">
        {sessionData?.map((sess) => (
          <div className="mb-4 rounded-lg bg-gray-100 p-4" key={sess.uid}>
            <Link to={`student/${sess.uid}`}>
              <h1 className="text-lg capitalize">
                {experiments.find((exp) => exp.id == sess.expId)?.title}
                Started At:{" "}
                {moment(sess.startedAt._seconds * 1000).format(
                  "YYYY-MM-DD HH:MM"
                )}
              </h1>
            </Link>
            <div>{sess.active ? "active" : "gone"}</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default TeacherSessions
