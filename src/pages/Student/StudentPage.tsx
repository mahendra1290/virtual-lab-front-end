import { Button, Grid, GridItem, Spinner } from "@chakra-ui/react"
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
import { Link } from "react-router-dom"
import { db } from "../../firebase"
import { useAuthContext } from "../../providers/AuthProvider"

interface Lab {
  id: string
  name: string
  userId: string
  visibility: string
  createdAt: Timestamp | string | Date
}

export const StudentPage = () => {
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
      const q = query(
        collection(db, "labs"),
        where("visibility", "==", "public")
      )
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

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Public Labs</h1>
      </div>
      {!labs.length && !empty && (
        <div className="mt-12 flex flex-col items-center justify-center">
          <Spinner />
          <h1>Fetching your labs...</h1>
        </div>
      )}

      <Grid templateColumns="repeat(4, 1fr)" gap={4} marginTop={4}>
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
              {item.visibility === "public" && <p>Public</p>}
            </Link>
          </GridItem>
        ))}
      </Grid>
    </div>
  )
}
