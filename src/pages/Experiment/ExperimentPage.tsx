import {
  Button,
  Divider,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  useToast,
  Tabs,
  Textarea,
} from "@chakra-ui/react"
import axios from "axios"
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  Unsubscribe,
  updateDoc,
} from "firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import draftToHtml from "draftjs-to-html"

import { db } from "../../firebase"
import { Experiment, Lab, LabSession, TestCase } from "../../shared/types/Lab"
import Header from "../../components/header/header"
import LabMenuPanel from "../../components/labs/LabMenuPanel"
import { useConfirmationModal } from "../../hooks/useConfirmationModal"
import ConfirmationModal from "../../components/modals/ConfirmationModal"
import LabLoadingSkeleton from "../../components/skeletons/LabLoadingSkeleton"

const ExperimentPage = () => {
  const { labId, expId } = useParams()
  const [lab, setLab] = useState<Lab>()
  const [experiment, setExperiment] = useState<Experiment>()
  const [sessionData, setSessionData] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [fetchingExp, setFetchingExp] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const navigate = useNavigate()
  const { modalProps, makeModal } = useConfirmationModal()
  const [testCase, setTestCases] = useState<TestCase>()

  const [problemLoading, setProblemLoading] = useState(false)
  const [prblmStatement, setPrblmStatement] = useState("")

  const toast = useToast()

  const successToast = useToast({
    title: "Problem statement submitted successfully",
    status: "success",
    duration: 2000,
  })
  const errorToast = useToast({
    title: "Something went wrong, Unable to add problem statement",
    status: "error",
    duration: 2000,
  })

  const handleStartExperimentSession = async () => {
    setLoading(true)
    const res = await axios.post("/lab-sessions", {
      expId,
      labId,
    })
    setLoading(false)
    setSessionData(res.data)
  }

  const handleExperimentDelete = async () => {
    makeModal({
      header: `Delete Experiment ${experiment?.title}`,
      body: "This will delete all data related to this experiment. Are you sure?",
    })
  }

  useEffect(() => {
    if (labId && expId) {
      setFetchingExp(true)
      const labCollection = collection(db, "labs")
      const expCollection = collection(db, "experiments")
      getDoc(doc(labCollection, labId)).then((docSnap) => {
        if (docSnap.exists()) {
          setLab(docSnap.data() as Lab)
        }
      })
      getDoc(doc(expCollection, expId)).then((expDocSnap) => {
        if (expDocSnap.exists()) {
          const expData = expDocSnap.data() as Experiment
          setExperiment(expData)
          if (expData.problemStatement) {
            setPrblmStatement(expData.problemStatement)
          }
          setActiveSection(expData.sections?.at(0)?.name || "")
        }
        setFetchingExp(false)
      })
    }
  }, [labId, expId])

  useEffect(() => {
    let unsubscribe: Unsubscribe
    if (sessionData) {
      navigate(`/t/lab-session/${sessionData.id}`)
    }
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [sessionData])

  const sectionData = useMemo(() => {
    const obj: { [key: string]: string } = {}
    experiment?.sections?.forEach((section) => {
      obj[section.name] = draftToHtml(section.editorState)
    })
    return obj
  }, [experiment])

  useEffect(() => {
    if (expId) {
      const testCasesRef = doc(collection(db, `test-cases`), expId)
      getDoc(testCasesRef).then((docSnap) => {
        const data = docSnap.data()
        setTestCases(data as TestCase)
      })
    }
  }, [])

  const deleteTestCases = () => {
    deleteDoc(doc(collection(db, `test-cases`), expId))
  }

  const handlePrblmStatement = async () => {
    try {
      if (prblmStatement) {
        setProblemLoading(true)
        const docRef = doc(collection(db, "experiments"), expId)
        await updateDoc(docRef, {
          problemStatement: prblmStatement,
        })
        successToast()
      }
    } catch (err) {
      errorToast()
      console.error(err)
    }

    setProblemLoading(false)
  }

  if (fetchingExp) {
    return <LabLoadingSkeleton isLoading />
  }

  return (
    <>
      {!experiment ? (
        <LabLoadingSkeleton isLoading={true} />
      ) : (
        <>
          <Header
            title={experiment?.title || ""}
            pathList={[
              [`/t/labs/${lab?.id}`, lab?.name],
              experiment?.title || "",
            ]}
            rightContent={
              <HStack>
                <Button
                  colorScheme={"blue"}
                  isLoading={loading}
                  loadingText={"Starting..."}
                  onClick={handleStartExperimentSession}
                >
                  Start Session
                </Button>
                <Button
                  colorScheme={"blue"}
                  loadingText={"Starting..."}
                  onClick={() => {
                    localStorage.setItem(
                      `assessment-${expId}`,
                      JSON.stringify(experiment)
                    )
                    navigate(`/t/experiments/${expId}/assessment/create`)
                  }}
                >
                  Add Assessment
                </Button>
                <Button colorScheme={"green"}>
                  <Link to={`/t/experiments/${expId}/edit?lab=${labId}`}>
                    Edit
                  </Link>
                </Button>
                <Button onClick={handleExperimentDelete} colorScheme={"red"}>
                  Delete
                </Button>
                <Button onClick={deleteTestCases}>Delete test case</Button>
              </HStack>
            }
          />
          <div>
            <div className="flex gap-4 px-8 py-4">
              <LabMenuPanel
                activeMenu={activeSection}
                onChange={setActiveSection}
                className="w-1/4 rounded-md border p-4"
                menus={experiment?.sections?.map((section) => section.name)}
              />
              <div className="w-3/4 rounded-md border p-4">
                <h1 className="mb-2 text-xl">{activeSection}</h1>
                <Divider />
                <div
                  className="reset-tailwindcss"
                  dangerouslySetInnerHTML={{
                    __html: sectionData[activeSection],
                  }}
                />
              </div>
            </div>
          </div>
          <div className="px-8 py-4">
            <div className="min-h-4 flex-grow rounded border">
              <Tabs>
                <TabList>
                  <Tab>Problem Statement</Tab>
                  <Tab>Testcases</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel key="problem_statement_exp">
                    <Textarea
                      value={prblmStatement}
                      onChange={(e) => setPrblmStatement(e.target.value)}
                      placeholder="Here is a sample placeholder"
                      size="sm"
                      fontSize="sm"
                      minHeight="128px"
                      padding="2"
                      className={"h-full rounded border font-mono "}
                    />
                    <Button
                      className="mt-2 ml-auto"
                      onClick={handlePrblmStatement}
                      colorScheme={"green"}
                      isLoading={problemLoading}
                    >
                      Submit
                    </Button>
                  </TabPanel>
                  <TabPanel key="test_cases_exp">
                    <div className="flex">
                      <div className="w-1/2 whitespace-pre-line border-r-2 border-gray-300 p-2">
                        {testCase?.inputs &&
                          testCase.inputs.map((inp: any) => {
                            return (
                              <>
                                <div>{inp.content}</div>
                                <br />
                              </>
                            )
                          })}
                      </div>
                      <div className="w-1/2 px-4 py-2">
                        {testCase?.outputs &&
                          testCase.outputs.map((inp: any) => {
                            return (
                              <>
                                <div>{inp.content}</div>
                                <br />
                              </>
                            )
                          })}
                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          </div>
          <ConfirmationModal {...modalProps} />
        </>
      )}
    </>
  )
}

export default ExperimentPage
