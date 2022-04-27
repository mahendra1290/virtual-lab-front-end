import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
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
import SectionViewer from "../../components/SectionViewer"
import { db } from "../../firebase"
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

const LabSessionPage = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [session, setSession] = useState<ILabSession>()

  const handleEndSession = async () => {
    // try {
    //   const res = await axios.put(`/lab-sessions/${id}`, {
    //     active: false,
    //     endedAt: Timestamp.fromDate(new Date()),
    //   })
    //   console.log(res.data)
    // } catch (err) {
    //   console.log(err)
    // }
  }

  const handleStartSession = async () => {}

  useEffect(() => {
    const fetchLabSessionDetails = async () => {
      const res = await axios.get(`/lab-sessions/${id}`)
      setSession(res.data as ILabSession)
    }
    fetchLabSessionDetails()
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

  const { exp, lab } = session || {}

  return (
    <>
      <Header
        title={`${exp?.title}`}
        pathList={lab && exp ? [lab?.name, exp?.title] : []}
        rightContent={
          <Button onClick={handleEndSession} colorScheme="red">
            Stop Session
          </Button>
        }
      />
      <div className="py-4 px-8">
        <Tabs className="min-h-screen rounded-lg border p-2">
          <TabList>
            <Tab>Experiment</Tab>
            <Tab>Submission</Tab>
            <Tab>Students</Tab>
            <Tab>Settings</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SectionViewer sections={exp?.sections || []} />
            </TabPanel>
            <TabPanel>
              <p>two!</p>
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
