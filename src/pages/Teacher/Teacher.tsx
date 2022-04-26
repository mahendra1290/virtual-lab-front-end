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
  getDocs,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  Unsubscribe,
  where,
} from "firebase/firestore"
import { sortBy } from "lodash"
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

const Teacher = () => {
  const navigate = useNavigate()

  const { user } = useAuthContext()
  const [name, setName] = useState("")
  const [labVisibility, setLabVisibility] = useState("public")
  const [labs, setLabs] = useState<Lab[]>([])
  const [empty, setEmpty] = useState(false)

  useEffect(() => {
    let unsubscribe: Unsubscribe
    const fetchLabs = async () => {
      const q = query(collection(db, "labs"), where("userUid", "==", user?.uid))
      const snapshot = await getDocs(q)
      if (snapshot.empty) {
        setEmpty(true)
      } else {
        setEmpty(false)
      }
      let labDocs = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Lab))
        .map((item) => ({
          ...item,
          createdAt: moment((item.createdAt as Timestamp).toDate()).format(
            "DD-MM-YYYY"
          ),
        }))
      labDocs = sortBy(labDocs, "name")
      sessionStorage.setItem("LABS", JSON.stringify(labDocs))
      setLabs(labDocs)
    }
    if (user) {
      const cachedLabs = sessionStorage.getItem("LABS")
      if (cachedLabs) {
        setLabs(JSON.parse(cachedLabs))
      }
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
        rightContent={<Button onClick={handleCreateLab}>Create new lab</Button>}
      />
      <div className="px-8">
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
      </div>
    </>
  )
}

export default Teacher
