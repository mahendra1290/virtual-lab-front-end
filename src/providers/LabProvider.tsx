import { Spinner } from "@chakra-ui/react"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from "firebase/firestore"
import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import LabLoadingSkeleton from "../components/skeletons/LabLoadingSkeleton"
import { db } from "../firebase"
import useLoading from "../hooks/useLoading"
import { Experiment, Lab } from "../shared/types/Lab"

interface LabContextValue {
  lab?: Lab
  experiments?: Experiment[]
  updateLab: (data: Partial<Lab>) => void
}

const LabContext = React.createContext<LabContextValue>({} as LabContextValue)

type LabProviderProps = {
  children: React.ReactChild | React.ReactChildren
}

const useLabContext = () => {
  return useContext(LabContext)
}

const LabProvider = ({ children }: LabProviderProps) => {
  const { id } = useParams()
  const { loading, startLoading, stopLoading } = useLoading(true)
  const [lab, setLab] = useState<Lab>()
  const [experiments, setExperiments] = useState<Experiment[]>([])

  const updateLab = (data: Partial<Lab>) => {
    const tempLab = { ...lab }
    Object.assign(tempLab, data)

    setLab(tempLab as Lab)
  }

  useEffect(() => {
    let unsubscribe: Unsubscribe
    try {
      startLoading()
      const docRef = doc(collection(db, "labs"), id)
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const labRes = { ...docSnap.data(), id: docSnap.id } as Lab
          setLab(labRes)
          if (labRes) {
            const docRef = query(
              collection(db, "experiments"),
              where("labId", "==", labRes.id)
            )
            getDocs(docRef).then((res) => {
              const finalRes = res.docs.map(
                (item) => ({ id: item.id, ...item.data() } as Experiment)
              )
              setExperiments(finalRes)
            })
          }
          stopLoading()
        } else {
          stopLoading()
        }
      })
    } catch (err) {
      console.log(err)
      stopLoading()
    }
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const value: LabContextValue = { lab, experiments, updateLab }

  return (
    <LabContext.Provider value={value}>
      {loading && <LabLoadingSkeleton isLoading={true} />}
      {!loading && lab && children}
      {!loading && !lab && <h1>404: Lab not found</h1>}
    </LabContext.Provider>
  )
}

export { useLabContext, LabProvider }
