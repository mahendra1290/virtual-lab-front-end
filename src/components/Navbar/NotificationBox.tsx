import {
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Box,
  Portal,
  VStack,
} from "@chakra-ui/react"
import React, { useRef, useState, useEffect } from "react"

import { useAuthContext } from "../../providers/AuthProvider"
import { FaBell } from "react-icons/fa"
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  Unsubscribe,
} from "firebase/firestore"
import { db } from "../../firebase"
import { Link } from "react-router-dom"
import moment from "moment"

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

const NotificationBox = () => {
  const { user, signOut } = useAuthContext()

  const [notifications, setNotifications] = useState<FireNotification[]>([])

  useEffect(() => {
    const uid = user?.uid
    let sub: Unsubscribe
    if (uid) {
      const notRef = collection(db, `notifications-${uid}`)
      const q = query(notRef, orderBy("createdAt"))
      sub = onSnapshot(q, (data) => {
        setNotifications(
          data.docs.map((doc) => doc.data() as FireNotification).reverse()
        )
      })
    }
    return () => {
      if (sub) {
        sub()
      }
    }
  }, [])

  // console.log(notifications, "notes")

  const initRef = useRef()
  return (
    <Popover closeOnBlur={true} placement="bottom-start">
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <IconButton
              variant="link"
              colorScheme="teal"
              aria-label="Call Segun"
              size="lg"
              icon={<FaBell />}
            />
          </PopoverTrigger>
          <Portal>
            <PopoverContent width="500px">
              <PopoverHeader>Notifications</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <VStack
                  align="stretch"
                  className="max-h-[400px] min-h-[150px] overflow-y-auto overflow-x-hidden"
                >
                  {notifications.length > 0 ? (
                    notifications.map((note) => {
                      return (
                        <Box className="rounded-lg border p-2">
                          <h1>{note.title}</h1>
                          <h1 className="text-sm text-gray-600">
                            {note.description}
                          </h1>

                          {note?.actions?.map((act) => {
                            return (
                              <div className="flex justify-between">
                                <div className="text-xs text-gray-400">
                                  {moment(
                                    note.createdAt.seconds * 1000
                                  ).fromNow()}
                                </div>
                                <div className="flex justify-end">
                                  <Link
                                    onClick={onClose}
                                    to={act.action}
                                    className="text-sm uppercase text-blue-500"
                                  >
                                    {act.name}
                                  </Link>
                                </div>
                              </div>
                            )
                          })}
                        </Box>
                      )
                    })
                  ) : (
                    <Box className="rounded-lg border p-2 text-center">
                      <h1>No new notifications</h1>
                    </Box>
                  )}
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  )
}

export default NotificationBox
