import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from "@chakra-ui/react"
import Editor from "@monaco-editor/react"
import axios from "axios"
import { collection, deleteDoc, doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import { editor } from "monaco-editor"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import useLoading from "../hooks/useLoading"
import { useAuthContext } from "../providers/AuthProvider"
import { GraderResult } from "../shared/types/Grader"
import GraderPanel from "./GraderPanel"
import { Experiment, TestCase } from "../shared/types/Lab"
import { socket } from "../socket"
import TestCaseViewer from "./TestCaseViewer"

// const languageOptions = ["javascript", "typescript", "cpp", "java", "python"]
const languageOptions = ["cpp", "python", "java"]

interface Props {
  sessionId?: string
  expId?: string
  labId?: string
}

export const CodeEditor = ({ sessionId, expId, labId }: Props) => {
  const { user } = useAuthContext()

  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  const [res, setRes] = useState("")
  const [error, setError] = useState("")
  const { loading, startLoading, stopLoading } = useLoading()
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [graderResult, setGraderResult] = useState<GraderResult>()
  const [testCase, setTestCases] = useState<TestCase>()
  const [expData, setExpData] = useState<Experiment>()

  useEffect(() => {
    socket.auth = { uid: user?.uid }
    console.log("student uid", user?.uid)

    socket.connect()
    socket.on("connect", () => {
      console.log(socket.id, "connected")
    })
  }, [])

  useEffect(() => {
    if (expId) {
      const testCasesRef = doc(collection(db, `test-cases`), expId)
      const expCollection = doc(collection(db, "experiments"), expId)
      getDoc(testCasesRef).then((docSnap) => {
        const data = docSnap.data()
        setTestCases(data as TestCase)
      })
      getDoc(expCollection).then((docSnap) => {
        setExpData(docSnap?.data() as Experiment)
      })
    }
  }, [])

  const handleRun = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue()
      startLoading()
      setRes("")
      setError("")
      axios
        .post(`/code/run/${selectedLanguage}`, {
          code,
          expId,
          sessionId,
          labId,
        })
        .then((res) => {
          if (res.status == 400) {
            stopLoading()
          }
          if (res.data.error) {
            setError(res.data.error)
            setRes("")
          } else {
            setRes(res.data.output)
            setError("")
            setGraderResult(res.data.graderResponse as GraderResult)
          }
          stopLoading()
        })
        .catch((err) => stopLoading())

      console.log(editorRef.current.getValue())
    }
  }

  const handleSubmit = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue()
      setLoadingSubmit(true)
      setRes("")
      setError("")
      axios
        .post(`/code/submit`, {
          lang: selectedLanguage,
          code,
          expId,
          sessionId,
          labId,
        })
        .then((res) => {
          if (res.status == 400) {
            setLoadingSubmit(false)
          }
          if (res.data.error) {
            setError(res.data.error)
            setRes("")
          } else {
            setRes(res.data.output)
            setError("")
            setGraderResult(res.data.graderResponse as GraderResult)
          }
          setLoadingSubmit(false)
        })
        .catch((err) => setLoadingSubmit(false))

      console.log(editorRef.current.getValue())
    }
  }

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      socket.emit("save-code", {
        lang: selectedLanguage,
        code: value,
      })
    }
  }

  useEffect(() => {
    handleCodeChange(editorRef.current?.getValue())
  }, [selectedLanguage])

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLangCode = localStorage.getItem(`${e.target.value}-code`) || ""
    const currLang = selectedLanguage
    const currCode = editorRef.current?.getValue()
    localStorage.setItem(`${currLang}-code`, currCode || "")
    editorRef.current?.setValue(newLangCode)
    console.log(currLang, currCode)
    setSelectedLanguage(e.target.value)
  }

  return (
    <div className="flex gap-2">
      <div className="w-1/2 rounded-md border p-2">
        <div className="flex gap-2 rounded  p-2">
          <div className="flex flex-grow gap-4">
            <FormControl size="sm" className="flex items-center">
              <FormLabel htmlFor="language">Language</FormLabel>
              <Select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                id="language"
                size="sm"
              >
                {languageOptions.map((val) => (
                  <option value={val} key={val}>
                    {val}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl className="flex items-center">
              <FormLabel htmlFor="theme">Theme</FormLabel>
              <Select id="theme" size="sm">
                <option value="js">Vs dark</option>
                <option value="js">light</option>
                <option value="js">C++</option>
              </Select>
            </FormControl>
          </div>
          <Button
            isLoading={loading}
            loadingText="Running..."
            size="sm"
            colorScheme="green"
            onClick={handleRun}
          >
            Run
          </Button>
          <Button
            isLoading={loadingSubmit}
            loadingText="Submitting..."
            size="sm"
            colorScheme="blue"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
        <Divider />
        <Editor
          height="70vh"
          language={selectedLanguage}
          className="w-1/2"
          theme="vs-light"
          onChange={handleCodeChange}
          onMount={(editor, monaco) => {
            editorRef.current = editor
          }}
        />
      </div>
      <div className="flex w-1/2 flex-col justify-items-stretch gap-2">
        <div className="h-1/2 flex-grow rounded border p-2">
          <Tabs>
            <TabList>
              <Tab>Problem Statement</Tab>
              <Tab>Testcases</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <div>{expData?.problemStatement} </div>
              </TabPanel>
              <TabPanel>
                <TestCaseViewer testCases={testCase} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
        <Tabs className="flex h-1/2 flex-grow flex-col p-2">
          <TabList>
            <Tab>Output</Tab>
            <Tab>Grader Output</Tab>
          </TabList>
          <TabPanels className="h-[90%]">
            <TabPanel padding="0" paddingTop="4" className="h-full">
              <Textarea
                readOnly
                value={res ? res : error}
                background="gray.800"
                fontSize="sm"
                padding="2"
                height="100%"
                className={
                  "min-h-full rounded border bg-gray-900 font-mono text-white" +
                  (error ? " text-red-500" : "")
                }
              />
            </TabPanel>
            <TabPanel className="h-full">
              <GraderPanel gradeResult={graderResult} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  )
}
