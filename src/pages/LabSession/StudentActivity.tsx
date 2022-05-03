import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react"
import Editor from "@monaco-editor/react"
import axios from "axios"
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore"
import { db } from "../../firebase"
import { useParams } from "react-router-dom"
import { editor } from "monaco-editor"
import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import Header from "../../components/header/header"
import useLoading from "../../hooks/useLoading"
import { useAuthContext } from "../../providers/AuthProvider"
import LabSessionChatBox from "../../components/chatbox/LabSessionChatBox"
import LabSessionChatPopover from "../../components/chatbox/LabSessionChatPopover"
import { Experiment, TestCase } from "../../shared/types/Lab"
import { socket } from "../../socket"
import GraderPanel from "../../components/GraderPanel"
import TestCaseViewer from "../../components/TestCaseViewer"
import { GraderResult } from "../../shared/types/Grader"

const languageOptions = ["cpp", "java", "python"]

export const StudentActivity = () => {
  const { user } = useAuthContext()
  const { stdId, id } = useParams()
  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  const [res, setRes] = useState("")
  const [error, setError] = useState("")
  const [codeData, setCodeData] = useState("")
  const { loading, startLoading, stopLoading } = useLoading()
  const [selectedLanguage, setSelectedLanguage] = useState("python")
  const [testCase, setTestCases] = useState<TestCase>()
  const [expData, setExpData] = useState<Experiment>()
  const [graderResult, setGraderResult] = useState<GraderResult>()

  const selectLangRef = useRef("javascript")

  const studName = localStorage.getItem("stdName")
  const expId = localStorage.getItem("expId")

  useEffect(() => {
    socket.auth = { uid: stdId }
    socket.connect()
    socket.on("connect", () => {
      console.log(socket.id, "connected")
    })
    socket.emit("view-student", stdId)
    socket.on(`code-update-${stdId}`, (data) => {
      if (data && data.lang && data.code) {
        const { lang, code } = data
        if (selectLangRef.current !== lang) {
          selectLangRef.current = lang
          setSelectedLanguage(lang)
        }
        setCodeData(code)
        editorRef.current?.setValue(code)
      }
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
        .post("/code/run/python", { code })
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
          }
          stopLoading()
        })
        .catch((err) => stopLoading())
    }
  }

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCodeData(value)
      socket.emit("save-code", {
        lang: selectedLanguage,
        code: value,
      })
    }
  }

  useEffect(() => {
    const colRef = doc(collection(db, "run-outputs"), `${id}${stdId}`)
    const unsub = onSnapshot(colRef, (doc) => {
      console.log(doc.data())
      const data = doc.data()
      if (data) {
        if (data.error) {
          setError(data.error)
          setRes("")
        } else {
          setRes(data.output)
          setError("")
          setGraderResult(data.graderResponse as GraderResult)
        }
      }
    })
    return () => {
      if (unsub) {
        unsub()
      }
    }
  }, [])

  return (
    <div>
      <Header
        title={studName || ""}
        pathList={[]}
        rightContent={
          <LabSessionChatPopover>
            <LabSessionChatBox sessionId={id || ""} studentId={stdId || ""} />
          </LabSessionChatPopover>
        }
      />
      <div className="flex gap-4 border p-4">
        <div className="w-1/2 rounded-md border p-2">
          <div className="flex gap-4 rounded  p-2">
            <div className="flex flex-grow gap-4">
              <FormControl size="sm" className="flex items-center">
                <FormLabel htmlFor="language">Language</FormLabel>
                <Select
                  value={selectedLanguage}
                  disabled
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
          </div>
          <Divider />
          <Editor
            height="70vh"
            language={selectedLanguage}
            className="w-1/2"
            // value={codeData}
            theme="vs-light"
            // onChange={handleCodeChange}
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
    </div>
  )
}
