import { Button, Divider, HStack } from "@chakra-ui/react"
import axios from "axios"
import { collection, doc, getDoc, Unsubscribe } from "firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import draftToHtml from "draftjs-to-html"

import { db } from "../../firebase"
import { useAuthContext } from "../../providers/AuthProvider"
import { Experiment, Lab, LabSession } from "../../shared/types/Lab"
import Header from "../../components/header/header"
import LabMenuPanel from "../../components/labs/LabMenuPanel"
import { useConfirmationModal } from "../../hooks/useConfirmationModal"
import ConfirmationModal from "../../components/modals/ConfirmationModal"
import Loading from "../../components/Loading"
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
                  isLoading={loading}
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
          <ConfirmationModal {...modalProps} />
        </>
      )}
    </>
  )
}

export default ExperimentPage
