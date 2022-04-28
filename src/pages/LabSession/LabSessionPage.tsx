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
import Header from "../../components/header/header"
import Loading from "../../components/Loading"
import SectionViewer from "../../components/SectionViewer"
import { db } from "../../firebase"
import useLoading from "../../hooks/useLoading"
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
      })
      stopLoading()
    } catch (err) {
      stopLoading()
      toast({
        title: "Unable to stop session",
        description: "Something went wrong",
        duration: 2000,
        status: "error",
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
      // unsubscribeSession = onSnapshot(
      //   doc(collection(db, "experiment-sessions"), id),
      //   (doc) => {
      //     console.log(doc.data(), "got data")
      //     setSession(doc.data())
      //   }
      // )
      unsubscribeStudent = onSnapshot(
        doc(db, "session-students", `session-${id}`),
        (data) => {
          setStudents(data?.data()?.students as JoinedStudent[])
          console.log(data.data(), "update")
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
              {students?.map((stud) => (
                <div className="mb-4 rounded-lg bg-gray-100 p-4" key={stud.uid}>
                  <h1 className="text-lg capitalize">{stud.name}</h1>
                  <div>{stud.active ? "active" : "gone"}</div>
                </div>
              ))}
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
      <div className="px-8 py-4">
        <h1 className="mb-2 text-2xl">Students: </h1>
        <VStack align="stretch">
          {/* {students?.map((stud: any) => (
            <div className="rounded border-2  p-2 shadow-md">
              {stud.name}
              <p className="font-mono">Code: {stud.code}</p>
            </div>
          ))} */}
        </VStack>
      </div>
    </>
  )
}

export default LabSessionPage
