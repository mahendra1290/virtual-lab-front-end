import {
  collection,
  doc,
  onSnapshot,
  Timestamp,
  Unsubscribe,
} from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { db } from "../firebase"
import { useAuthContext } from "../providers/AuthProvider"

export interface FireNotificationAction {
  name: string
  action: string
}

export interface FireNotification {
  id: string
  title: string
  description: string
  createdAt: Timestamp
  actions?: FireNotificationAction[]
}

const Notifications = () => {
  const { user } = useAuthContext()

  const [notifications, setNotifications] = useState<FireNotification[]>([])

  useEffect(() => {
    const uid = user?.uid
    let sub: Unsubscribe
    if (uid) {
      const notRef = collection(db, `notifications-${uid}`)
      sub = onSnapshot(notRef, (data) => {
        setNotifications(data.docs.map((doc) => doc.data() as FireNotification))
      })
    }
    return () => {
      if (sub) {
        sub()
      }
    }
  }, [])

  return (
    <div>
      {notifications.map((note) => (
        <div>
          <h1>{note.title}</h1>
          <h1>{note.description}</h1>
        </div>
      ))}
    </div>
  )
}

export default Notifications
