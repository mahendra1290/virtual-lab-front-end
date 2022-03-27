import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, doc, getDoc } from "firebase/firestore"
import { Button, Spinner } from "@chakra-ui/react"
import { db } from "../../firebase"

interface Lab {
  name: string
  createdAt: Date
  userUid: string
}

export const LabPage = () => {
  const { id } = useParams()
  const [lab, setLab] = useState<Lab>()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchLab = async () => {
      try {
        setLoading(true)
        const docSnap = await getDoc(doc(collection(db, "labs"), id))
        if (docSnap.exists()) {
          setLab(docSnap.data() as Lab)
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

  console.log(id, "parmam")

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
      <Button>Create Experiment</Button>
      <h1 className="text-4xl capitalize">{lab?.name}</h1>
      <h2 className="mt-4">Experiments: </h2>
    </div>
  )
}
