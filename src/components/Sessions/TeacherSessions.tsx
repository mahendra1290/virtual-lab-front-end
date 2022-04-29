import { useToast } from "@chakra-ui/react"
import axios from "axios"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../providers/AuthProvider"
import { Link } from "react-router-dom"
import Loading from "../Loading"
import moment from "moment"
import { GoPrimitiveDot } from "react-icons/go"
import { Experiment, Lab } from "../../shared/types/Lab"

interface TeacherSessionProps {
  lab: Lab
  experiments: Experiment[]
}

const TeacherSessions = ({ lab, experiments }: TeacherSessionProps) => {
  const [sessionData, setSessionData] = useState<any[]>([])
  const toast = useToast()
  const [dataLoading, setDataLoading] = useState(false)
  const { user } = useAuthContext()

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

  if (dataLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="py-4">
        {sessionData?.map((sess) => (
          <div className="mb-4 rounded-lg bg-gray-100 p-4" key={sess.uid}>
            <Link to={`student/${sess.uid}`}>
              <div className="mb-2 flex justify-between align-middle">
                <h1 className="text-lg capitalize">
                  {experiments.find((exp) => exp.id == sess.expId)?.title}
                </h1>
                <GoPrimitiveDot
                  style={{ fontSize: 24, color: sess.active ? "green" : "red" }}
                />
              </div>
              <h2 className="text-gray-500">
                {sess.active ? (
                  <div>
                    {moment(sess.startedAt._seconds * 1000).format(
                      "YYYY-MM-DD HH:MM"
                    )}
                  </div>
                ) : (
                  <div>
                    {moment(sess.startedAt._seconds * 1000).format(
                      "YYYY-MM-DD HH:MM"
                    )}
                    {"  "}-{"  "}
                    {moment(sess.endedAt._seconds * 1000).format(
                      "YYYY-MM-DD HH:MM"
                    )}
                  </div>
                )}
              </h2>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}

export default TeacherSessions
