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
import Editor, { Monaco } from "@monaco-editor/react"
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

import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"
import { MonacoBinding } from "y-monaco"

const languageOptions = ["javascript", "typescript", "cpp", "java", "python"]

interface Props {
  sessionId?: string
  expId?: string
  labId?: string
}

export const CodeEditor = ({ sessionId, expId, labId }: Props) => {
  const { user } = useAuthContext()
  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  const monacoBinding = useRef()
  const [provider, setProvider] = useState<WebsocketProvider>()
  const [res, setRes] = useState("")
  const [error, setError] = useState("")
  const { loading, startLoading, stopLoading } = useLoading()
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

  const onMonacoMount = (editor: editor.IStandaloneCodeEditor) => {
    const ydocument = new Y.Doc()
    const wsProvider = new WebsocketProvider(
      `wss://mahendrasuthar.engineer/yjs`,
      `lab-session-${sessionId}-student=${user?.uid}`,
      ydocument
    )
    const type = ydocument.getText("monaco")
    setProvider(wsProvider)
    if (!monacoBinding.current) {
      const bind = new MonacoBinding(
        type,
        editor.getModel(),
        new Set([editorRef.current]),
        wsProvider.awareness
      )
      monacoBinding.current = bind
    }
  }

  useEffect(() => {
    if (provider && provider.shouldConnect) {
      provider.connect()
    }
    return () => {
      if (provider && provider.wsconnected) {
        provider.disconnect()
      }
    }
  }, [provider])

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
    <div className="flex gap-2 border p-4">
      <div className="w-1/2 rounded-md border p-2">
        <div className="flex gap-4 rounded  p-2">
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
            onMonacoMount(editor)
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
                <div className="flex">
                  <div className="w-1/2 whitespace-pre-line border-r-2 border-gray-300 p-2">
                    {testCase?.inputs &&
                      testCase.inputs.map((inp) => {
                        return (
                          <>
                            <div key={inp.name}> {inp.content}</div>
                            <br />
                          </>
                        )
                      })}
                  </div>
                  <div className="w-1/2 px-4 py-2">
                    {testCase?.outputs &&
                      testCase.outputs.map((inp) => {
                        return (
                          <>
                            <div>{inp.content}</div>
                            <br />
                          </>
                        )
                      })}
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
        <Tabs className="flex h-1/2 flex-grow flex-col">
          <TabList>
            <Tab>Output</Tab>
            <Tab>Grader Output</Tab>
          </TabList>
          <TabPanels className="h-[90%]">
            <TabPanel className="h-full">
              <Textarea
                readOnly
                value={res ? res : error}
                background="gray.800"
                fontSize="sm"
                padding="2"
                height="100%"
                className={
                  "h-full rounded border bg-gray-900 font-mono text-white" +
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
