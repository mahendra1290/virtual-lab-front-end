import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import { async } from "@firebase/util"
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  Unsubscribe,
  where,
} from "firebase/firestore"
import moment from "moment"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { db } from "../../firebase"
import { useAuthContext } from "../../providers/AuthProvider"
import { ProfileForm } from "../Signup/ProfileForm"

interface Lab {
  id: string
  name: string
  userId: string
  createdAt: Timestamp | string | Date
}

export const Teacher = () => {
  const { user } = useAuthContext()
  const [addLabModalOpen, setAddModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [labs, setLabs] = useState<Lab[]>([])

  const createLab = async () => {
    setLoading(true)
    try {
      await setDoc(doc(collection(db, "labs")), {
        userUid: user?.uid,
        name: name,
        createdAt: new Date(),
      })
      setAddModalOpen(false)
      setName("")
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    let unsubscribe: Unsubscribe
    const fetchLabs = async () => {
      const q = query(collection(db, "labs"), where("userUid", "==", user?.uid))
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const labDocs = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Lab))
          .map((item) => ({
            ...item,
            createdAt: moment((item.createdAt as Timestamp).toDate()).format(
              "DD-MM-YYYY"
            ),
          }))

        setLabs(labDocs)
        console.log(labDocs)
      })
    }
    if (user) {
      fetchLabs()
    }
    return () => {
      console.log("called")

      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user])

  return (
    <div>
      <Button onClick={() => setAddModalOpen(true)}>Create Lab</Button>
      <p>{user?.email}</p>
      <p>{user?.role}</p>
      <Grid templateColumns="repeat(4, 1fr)" gap={4} padding="4">
        {labs.map((item) => (
          <GridItem
            key={item.id}
            className="cursor-pointer rounded border p-4"
            role="button"
          >
            <Link to={`/labs/${item.id}`}>
              <h1 className="cursor-pointer text-2xl capitalize group-hover:underline">
                {item.name}
              </h1>
              <p className="mt-2">Created At: {item.createdAt}</p>
            </Link>
          </GridItem>
        ))}
      </Grid>
      <Modal isOpen={addLabModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Lab</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                createLab()
              }}
            >
              <FormControl>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  autoFocus
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <HStack
                paddingTop="1rem"
                justify="end"
                marginBottom="1.5"
                spacing="1rem"
              >
                <Button
                  isLoading={loading}
                  loadingText="Creating"
                  isDisabled={name === ""}
                  type="submit"
                >
                  Create
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => setAddModalOpen(false)}
                >
                  Cancel
                </Button>
              </HStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}
