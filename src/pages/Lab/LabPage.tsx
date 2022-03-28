import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  collection,
  doc,
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
  VStack,
} from "@chakra-ui/react"
import { db } from "../../firebase"
import { CreateExperment } from "../../components/experiment/CreateExperiment"
import { ExperimentCard } from "../../components/experiment/ExperimentCard"

interface Lab {
  id: string
  name: string
  createdAt: Date
  userUid: string
}

export const LabPage = () => {
  const { id } = useParams()
  const [lab, setLab] = useState<Lab>()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const [experiments, setExperiments] = useState<any[]>([])

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const openModal = () => {
    setModalOpen(true)
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
    if (lab) {
      const docRef = collection(db, "labs", lab.id, "experiments")
      onSnapshot(docRef, (snapShot) => {
        setExperiments(
          snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        )
      })
    }
  }, [lab])

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
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl capitalize">{lab?.name}</h1>
        <Button onClick={openModal}>Create Experiment</Button>
      </div>
      <h2 className="mt-4 text-2xl">Experiments: </h2>
      <VStack spacing={4} align={"strecth"} className="w-1/2">
        {experiments.map((item) => (
          <Link key={item.id} to={`experiments/${item.id}`}>
            <ExperimentCard {...item} key={item.id} />
          </Link>
        ))}
      </VStack>
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
  )
}
