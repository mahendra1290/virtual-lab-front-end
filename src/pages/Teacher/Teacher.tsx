import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
} from "@chakra-ui/react"
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  Unsubscribe,
  where,
} from "firebase/firestore"
import moment from "moment"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "../../components/header/header"
import { db } from "../../firebase"
import { useAuthContext } from "../../providers/AuthProvider"

interface Lab {
  id: string
  name: string
  userId: string
  visibility: string
  createdAt: Timestamp | string | Date
}

export const Teacher = () => {
  const navigate = useNavigate()

  const { user } = useAuthContext()
  const [addLabModalOpen, setAddModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [labVisibility, setLabVisibility] = useState("public")
  const [loading, setLoading] = useState(false)
  const [labs, setLabs] = useState<Lab[]>([])
  const [empty, setEmpty] = useState(false)

  const createLab = async () => {
    setLoading(true)
    try {
      await setDoc(doc(collection(db, "labs")), {
        userUid: user?.uid,
        name: name,
        visibility: labVisibility,
        createdAt: new Date(),
      })
      setAddModalOpen(false)
      setName("")
      setLabVisibility("public")
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
        if (querySnapshot.empty) {
          setEmpty(true)
        } else {
          setEmpty(false)
        }
        const labDocs = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Lab))
          .map((item) => ({
            ...item,
            createdAt: moment((item.createdAt as Timestamp).toDate()).format(
              "DD-MM-YYYY"
            ),
          }))
        setLabs(labDocs)
      })
    }
    if (user) {
      fetchLabs()
    }
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user])

  const handleCreateLab = () => {
    navigate("labs/create")
  }

  return (
    <>
      <Header
        title="Labs"
        pathList={["labs"]}
        rightContent={<Button onClick={handleCreateLab}>Create Lab</Button>}
      />
      <div className="p-4">
        {!labs.length && !empty && (
          <div className="mt-12 flex flex-col items-center justify-center">
            <Spinner />
            <h1>Fetching your labs...</h1>
          </div>
        )}
        {!labs.length && empty && (
          <div className="mt-4 py-2 text-xl text-gray-600">
            No labs found. Please create new
          </div>
        )}
        <Grid templateColumns="repeat(4, 1fr)" gap={4} marginTop={4}>
          {labs.map((item) => (
            <GridItem
              key={item.id}
              className="cursor-pointer rounded border p-4"
              role="button"
            >
              <Link to={`labs/${item.id}`}>
                <h1 className="cursor-pointer text-2xl capitalize group-hover:underline">
                  {item.name}
                </h1>
                <p className="mt-2">Created At: {item.createdAt}</p>
                {item.visibility === "public" && <p>Public</p>}
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
                <FormControl className="mt-4">
                  <FormLabel htmlFor="labVisibility">Lab Visibility</FormLabel>
                  <Select
                    value={labVisibility}
                    onChange={(e) => setLabVisibility(e.target.value)}
                    defaultValue="public"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </Select>
                  <FormHelperText>
                    Public labs are accessible by everyone.
                  </FormHelperText>
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
    </>
  )
}
