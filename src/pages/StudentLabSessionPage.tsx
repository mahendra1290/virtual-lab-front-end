import {
  Button,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  toast,
  useToast,
  VStack,
} from "@chakra-ui/react"
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
import { io } from "socket.io-client"
import LabSessionChatBox from "../components/chatbox/LabSessionChatBox"
import LabSessionChatPopover from "../components/chatbox/LabSessionChatPopover"
import { CodeEditor } from "../components/CodeEditor"
import Header from "../components/header/header"
import Loading from "../components/Loading"
import SectionViewer from "../components/SectionViewer"
import { db } from "../firebase"
import useLoading from "../hooks/useLoading"
import { useAuthContext } from "../providers/AuthProvider"
import { Experiment, Lab, LabSession } from "../shared/types/Lab"
import CodeEditorPage from "./CodeEditorPage/CodeEditorPage"

const socket = io("http://localhost:5000", {
  autoConnect: false,
})

interface ILabSession {
  id: string
  uid: string
  startedAt: Timestamp
  lab: Lab
  exp: Experiment
  labId: string
  expId: string
  active: boolean
}

const StudentLabSessionPage = () => {
  const { id } = useParams()
  const { user } = useAuthContext()
  const [session, setSession] = useState<ILabSession>()
  const toast = useToast()
  const [dataLoading, setDataLoading] = useState(false)
  const { loading, startLoading, stopLoading } = useLoading()

  useEffect(() => {
    const fetchLabSessionDetails = async () => {
      try {
        setDataLoading(true)
        const res = await axios.get(`/lab-sessions/${id}`)
        setSession(res.data as ILabSession)
        setDataLoading(false)
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

  useEffect(() => {
    if (session) {
      socket.auth = { uid: user?.uid }
      socket.connect()
      socket.on("connect", () => {
        socket.emit("join-lab-session", {
          student: {
            uid: user?.uid,
            email: user?.email,
            name: user?.name,
          },
          labSessionId: id,
        })
      })
    }
    return () => {
      socket.close()
    }
  }, [session])

  const { exp, lab } = session || {}

  if (dataLoading) {
    return <Loading />
  }

  return (
    <>
      <Header
        title={`${exp?.title}`}
        pathList={lab && exp ? [lab?.name, exp?.title] : []}
      />
      <div className="py-4">
        <Tabs className="min-h-screen">
          <TabList>
            <Tab>Experiment</Tab>
            <Tab>Assessment</Tab>
            <Tab>My Submission</Tab>
            <Tab>Chat</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SectionViewer sections={exp?.sections || []} />
            </TabPanel>
            <TabPanel>
              <CodeEditor
                sessionId={session?.id}
                expId={session?.expId}
                labId={session?.labId}
              />
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
            <TabPanel>
              <div className="mx-auto">
                <h1 className="text-lg">Chat</h1>
                <LabSessionChatBox
                  className=" min-h-[30rem] rounded-md border p-4"
                  sessionId={id || ""}
                  studentId={user?.uid || ""}
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </>
  )
}

export default StudentLabSessionPage
