import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  collection,
  deleteDoc,
  doc,
  FirestoreError,
  getDoc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore"
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useToast,
  VStack,
} from "@chakra-ui/react"
import draftToHtml from "draftjs-to-html"
import { db } from "../../firebase"
import { CreateExperment } from "../../components/experiment/CreateExperiment"
import { ExperimentCard } from "../../components/experiment/ExperimentCard"
import { useAuthContext } from "../../providers/AuthProvider"
import axios from "axios"
import { Lab, LabSession } from "../../shared/types/Lab"
import LabSectionMenu from "../../components/labs/LabSectionMenu"
import LabMenuPanel from "../../components/labs/LabMenuPanel"
import { RawDraftContentState } from "react-draft-wysiwyg"
import Header from "../../components/header/header"
import LabOptionMenu from "../../components/labs/LabOptionMenu"
import { useConfirmationModal } from "../../hooks/useConfirmationModal"
import ConfirmationModal from "../../components/modals/ConfirmationModal"

export const LabPage = () => {
  const { user } = useAuthContext()
  const { id } = useParams()

  const { makeModal, modalProps } = useConfirmationModal()
  const navigate = useNavigate()
  const deleteToast = useToast({
    title: "Lab deleted successfully",
    status: "success",
    duration: 2000,
    isClosable: true,
  })

  const [lab, setLab] = useState<Lab>()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [experiments, setExperiments] = useState<any[]>([])
  const [labSessions, setLabSessions] = useState<LabSession[]>([])
  const [activeSection, setActiveSection] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const openModal = () => {
    setModalOpen(true)
  }

  const showDeleteLabConfirmation = () => {
    makeModal(
      `Delete ${lab?.name}`,
      "This will delete all data. Are you sure?"
    ).show(() => {
      handleDeleteLab()
    })
  }

  const handleDeleteLab = async () => {
    try {
      setDeleteLoading(true)
      await deleteDoc(doc(collection(db, "labs"), lab?.id))
      setDeleteLoading(false)
      deleteToast()
      setTimeout(() => {
        navigate(-1)
      }, 500)
    } catch (err: any) {
      const error = err as FirestoreError
      console.log(error.message)
    }
  }

  useEffect(() => {
    const fetchLab = async () => {
      try {
        setLoading(true)
        const docSnap = await getDoc(doc(collection(db, "labs"), id))
        if (docSnap.exists()) {
          setLab({ ...docSnap.data(), id: docSnap.id } as Lab)
        } else {
          setError("404: Lab not found...")
        }
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    }
    fetchLab()
  }, [])

  useEffect(() => {
    ;(async () => {
      const labSessions = await axios.get<LabSession[]>("/lab-sessions")
      setLabSessions(labSessions.data)
    })()
    if (lab) {
      const docRef = collection(db, "labs", lab.id, "experiments")
      onSnapshot(docRef, (snapShot) => {
        setExperiments(
          snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        )
      })
    }
  }, [lab])

  const sectionData = useMemo(() => {
    const data: { [key: string]: string } = {}
    if (lab && lab.sectionData) {
      Object.entries(lab.sectionData).forEach(([key, val]) => {
        data[key] = draftToHtml(val)
      })
    }
    return data
  }, [lab])

  const sections = useMemo(() => {
    const arr = Object.keys(sectionData).map((sectionName) => sectionName)
    arr.push("Experiments")
    return arr
  }, [sectionData])

  if (!activeSection && sections.length > 0) {
    setActiveSection(sections[0])
  }

  if (loading) {
    return <Spinner size="xl" />
  }

  if (error) {
    return (
      <h1 className="mx-auto w-fit p-20 text-4xl">
        {error} <Button>Back</Button>
      </h1>
    )
  }

  return (
    <>
      <Header
        title={lab?.name || ""}
        pathList={[["/t/labs", "labs"], lab?.name || ""]}
        rightContent={
          <div className="space-x-4">
            <Button onClick={openModal}>Create Experiment</Button>
            <Button
              isLoading={deleteLoading}
              loadingText={"Deleting..."}
              variant="outline"
              colorScheme={"red"}
              onClick={showDeleteLabConfirmation}
            >
              Delete
            </Button>
            <LabOptionMenu />
          </div>
        }
      />
      <div className="p-8">
        <div className="flex gap-4">
          <LabMenuPanel
            activeMenu={activeSection}
            onChange={setActiveSection}
            className="w-1/4 rounded-md border p-4"
            menus={sections}
          />
          <div className="w-3/4 rounded-md border p-4">
            <h1 className="mb-4 text-xl">{activeSection}</h1>
            {activeSection === "Experiments" ? (
              <VStack spacing={4} align={"strecth"} className="mt-4 w-1/2">
                {experiments.map((item) => (
                  <Link key={item.id} to={`experiments/${item.id}`}>
                    <ExperimentCard {...item} key={item.id} />
                  </Link>
                ))}
              </VStack>
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: sectionData[activeSection] }}
              />
            )}
          </div>
        </div>

        <ConfirmationModal {...modalProps} />

        <Modal size="2xl" isOpen={modalOpen} onClose={handleModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Experiment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <CreateExperment
                onSuccess={handleModalClose}
                labId={lab?.id || ""}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </>
  )
}
