import { Button, Input, Textarea } from "@chakra-ui/react"
import axios from "axios"
import {
  collection,
  doc,
  getDoc,
  getDocFromCache,
  getDocs,
  onSnapshot,
  query,
  Unsubscribe,
} from "firebase/firestore"
import { debounce, values } from "lodash"
import React, { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../../firebase"
import { useAuthContext } from "../../providers/AuthProvider"
import Editor from "@monaco-editor/react"

export const JoinedLabSessionPage = () => {
  const { user } = useAuthContext()
  const { id } = useParams()
  const [session, setSession] = useState<any>()
  const [experiment, setExperiment] = useState<any>()
  const [result, setResult] = useState()
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState("")
  const [inp, setInp] = useState("")

  const handleCodeChange = (value: string) => {
    setCode(value)
  }

  const debouncedHandleCodeChange = useCallback(
    debounce(handleCodeChange, 300),
    // handleCodeChange,
    []
  )

  const handleJoinSession = async () => {
    setLoading(true)
    const res = await axios.post("/attach-session", {
      expSessionId: session.id,
      studentName: user?.name,
      studentUid: user?.uid,
    })
    console.log(res)
    setLoading(false)
    // setResult(res)
  }

  useEffect(() => {
    if (session) {
      getDoc(doc(collection(db, "experiments"), session.experimentId)).then(
        (docSnap) => {
          if (docSnap.exists()) {
            setExperiment({ id: docSnap.id, ...docSnap.data() })
          }
        }
      )
    }
  }, [session])

  useEffect(() => {
    let unsubscribeSession: Unsubscribe
    let unsubscribeStudent: Unsubscribe
    if (id) {
      unsubscribeSession = onSnapshot(
        doc(collection(db, "experiment-sessions"), id),
        (doc) => {
          setSession({ id: doc.id, ...doc.data() })
        }
      )
    }
    return () => {
      if (unsubscribeSession) {
        unsubscribeSession()
      }
      if (unsubscribeStudent) {
        unsubscribeStudent()
      }
    }
  }, [])

  useEffect(() => {
    if (session && code) {
      axios.post("/save-progress", {
        expSessionId: session.id,
        code,
        studentUid: user?.uid,
      })
    }
  }, [code])

  return (
    <div className="p-4">
      <h1 className="text-3xl capitalize">{experiment?.title}</h1>
      <h2 className="text-xl text-gray-600">
        Problem Statement: {experiment?.problemStatement}
      </h2>
      {!result && (
        <Button isLoading={loading} onClick={handleJoinSession}>
          Join
        </Button>
      )}
      <div>
        <div className="mt-4 w-2/3 rounded-sm border-2 p-4">
          <h1 className="text-xl">Editor: </h1>
          <Editor
            className="border-grey-600 border-2"
            defaultValue="// Type your code here"
            height="60vh"
            theme="vs-light"
            defaultLanguage="javascript"
            value={code}
            // onChange={(value) => {
            //   setInp(value)
            //   debouncedHandleCodeChange(value)
            // }}
          />
          <div className="mt-4 flex justify-center gap-4">
            <Button>Run</Button>
            <Button>Clear</Button>
          </div>
        </div>
      </div>

      {/* <Editor /> */}
    </div>
  )
}
