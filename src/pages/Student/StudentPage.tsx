import { Button, Grid, GridItem, Spinner } from "@chakra-ui/react"
import axios from "axios"
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
import Header from "../../components/header/header"

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

  useEffect(() => {
    let unsubscribe: Unsubscribe
    const fetchLabs = async () => {
      const res = await axios.get(`/labs?studentUid=${user?.uid}`)
      setLabs(res.data.labs)
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
    <>
      <Header title={"My Labs"} pathList={["labs"]} />
      <div className="px-8 py-2">
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
              <Link to={`/s/labs/${item.id}`}>
                <h1 className="cursor-pointer text-2xl capitalize group-hover:underline">
                  {item.name}
                </h1>
                {/* <p className="mt-2">Created At: {Timestamp.fromMillis(item.createdAt.seconds)}</p> */}
                {item.visibility === "public" && <p>Public</p>}
              </Link>
            </GridItem>
          ))}
        </Grid>
      </div>
    </>
  )
}
