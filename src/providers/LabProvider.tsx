import { Spinner } from "@chakra-ui/react"
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore"
import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import LabLoadingSkeleton from "../components/skeletons/LabLoadingSkeleton"
import { db } from "../firebase"
import useLoading from "../hooks/useLoading"
import { Lab } from "../shared/types/Lab"

interface LabContextValue {
  lab?: Lab
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

  const updateLab = (data: Partial<Lab>) => {
    const tempLab = { ...lab }
    Object.assign(tempLab, data)
    console.log(tempLab, "templab")

    setLab(tempLab as Lab)
  }

  useEffect(() => {
    let unsubscribe: Unsubscribe
    try {
      startLoading()
      const docRef = doc(collection(db, "labs"), id)
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setLab({ ...docSnap.data(), id: docSnap.id } as Lab)
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

  const value: LabContextValue = { lab, updateLab }

  return (
    <LabContext.Provider value={value}>
      {loading && <LabLoadingSkeleton isLoading={true} />}
      {!loading && lab && children}
      {!loading && !lab && <h1>404: Lab not found</h1>}
    </LabContext.Provider>
  )
}

export { useLabContext, LabProvider }
