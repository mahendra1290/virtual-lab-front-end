import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  VStack,
} from "@chakra-ui/react"
import axios from "axios"
import { doc, onSnapshot, Timestamp, Unsubscribe } from "firebase/firestore"
import { useEffect, useState } from "react"
import { GoPrimitiveDot } from "react-icons/go"
import { Link, useParams, useSearchParams } from "react-router-dom"
import LabSessionChatBox from "../../components/chatbox/LabSessionChatBox"
import LabSessionChatPopover from "../../components/chatbox/LabSessionChatPopover"
import Header from "../../components/header/header"
import Loading from "../../components/Loading"
import SectionViewer from "../../components/SectionViewer"
import { db } from "../../firebase"
import useLoading from "../../hooks/useLoading"
import { Experiment, Lab } from "../../shared/types/Lab"

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

const LabSessionPage = () => {
  const { id } = useParams()
  const [session, setSession] = useState<ILabSession>()
  const [students, setStudents] = useState<JoinedStudent[]>([])
  const toast = useToast()
  const [dataLoading, setDataLoading] = useState(false)
  const { loading, startLoading, stopLoading } = useLoading()

  const handleEndSession = async () => {
    try {
      startLoading()
      const res = await axios.post(`/lab-sessions/${id}/end`)
      if (session) {
        setSession({ ...session, ...(res.data as ILabSession) })
      }
      toast({
        title: "Session ended successfully",
        status: "success",
        duration: 2000,
        position: "top",
        isClosable: true,
      })
      stopLoading()
    } catch (err) {
      stopLoading()
      toast({
        title: "Unable to stop session",
        description: "Something went wrong",
        duration: 2000,
        status: "error",
        isClosable: true,
        position: "top",
      })
      console.log(err)
    }
  }

  const handleStartSession = async () => {}

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
    let unsubscribeSession: Unsubscribe
    let unsubscribeStudent: Unsubscribe
    if (id) {
      unsubscribeStudent = onSnapshot(
        doc(db, "session-students", `session-${id}`),
        (data) => {
          setStudents(data?.data()?.students as JoinedStudent[])
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

  const { exp, lab } = session || {}

  if (dataLoading) {
    return <Loading />
  }

  return (
    <>
      <Header
        title={`${exp?.title}`}
        pathList={lab && exp ? [lab?.name, exp?.title] : []}
        rightContent={
          <Button
            onClick={handleEndSession}
            disabled={!session?.active}
            colorScheme="red"
            loadingText="Ending..."
            isLoading={loading}
          >
            {session?.active ? "Stop Session" : "Ended"}
          </Button>
        }
      />
      <div className="py-4 px-8">
        <Tabs className="min-h-screen rounded-lg border p-2">
          <TabList>
            <Tab>Experiment</Tab>
            <Tab>Students</Tab>
            <Tab>Submission</Tab>
            <Tab>Stats</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SectionViewer sections={exp?.sections || []} />
            </TabPanel>
            <TabPanel>
              <div className="flex">
                {students?.map((stud) => (
                  <div
                    className="m-2 w-full rounded-lg bg-gray-100 p-4 lg:w-1/3 xl:w-1/4"
                    key={stud.uid}
                  >
                    <div className="flex justify-between align-middle">
                      <GoPrimitiveDot
                        style={{
                          fontSize: 24,
                          color: stud.active ? "green" : "red",
                        }}
                      />
                      <Link
                        className="mr-auto"
                        to={`student/${stud.uid}`}
                        onClick={() => {
                          localStorage.setItem("stdName", stud.name)
                          localStorage.setItem("expId", exp?.id || "")
                        }}
                      >
                        <h1 className="text-lg capitalize">{stud.name}</h1>
                      </Link>
                      <LabSessionChatPopover>
                        <LabSessionChatBox
                          studentId={stud.uid}
                          sessionId={id || ""}
                        />
                      </LabSessionChatPopover>
                    </div>
                  </div>
                ))}
              </div>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </>
  )
}

export default LabSessionPage
