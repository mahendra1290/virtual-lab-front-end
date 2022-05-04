import { collection, onSnapshot, query, where } from "firebase/firestore"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { GoPrimitiveDot } from "react-icons/go"
import { Link } from "react-router-dom"
import { db } from "../firebase"
import { useAuthContext } from "../providers/AuthProvider"
import { LabSession } from "../shared/types/Lab"

const StudentPracticeSessions = ({ labId }: { labId: string }) => {
  const { user } = useAuthContext()

  const [sessions, setSessions] = useState<LabSession[]>([])

  useEffect(() => {
    const q = query(
      collection(db, "practice-sessions"),
      where("uid", "==", user?.uid),
      where("labId", "==", labId)
    )
    const unsub = onSnapshot(q, (docSnaps) => {
      if (!docSnaps.empty) {
        const sessionsData = docSnaps.docs.map(
          (doc) => doc.data() as LabSession
        )
        setSessions(sessionsData)
      }
    })
    return () => {
      unsub()
    }
  }, [])

  return (
    <div className="mt-4">
      {sessions?.map((sess) => (
        <div
          className="mb-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-700 dark:text-slate-200"
          key={sess.id}
        >
          <Link to={`/s/practice-session/${sess.id}`}>
            <div className="mb-2 flex justify-between align-middle">
              <h1 className="text-lg capitalize">Session - {sess.expName}</h1>
              <GoPrimitiveDot
                className={`${
                  sess.active
                    ? "text-green-400 dark:text-green-300"
                    : "text-red-400 dark:text-red-300"
                }`}
                style={{ fontSize: 24 }}
              />
            </div>
            <h2 className="text-gray-500 dark:text-slate-300">
              {sess.active ? (
                <div>
                  {moment(sess.startedAt.seconds * 1000).format(
                    "YYYY-MM-DD HH:MM"
                  )}
                </div>
              ) : (
                <div>
                  {moment(sess.startedAt.seconds * 1000).format(
                    "YYYY-MM-DD HH:MM"
                  )}
                  {"  "}-{"  "}
                  {moment(sess.endedAt.seconds * 1000).format(
                    "YYYY-MM-DD HH:MM"
                  )}
                </div>
              )}
            </h2>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default StudentPracticeSessions
