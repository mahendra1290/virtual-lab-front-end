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
import { collection, doc, getDoc } from "firebase/firestore"
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
import { TestCase } from "../../shared/types/Lab"
import { socket } from "../../socket"

const languageOptions = ["javascript", "typescript", "cpp", "java", "python"]

export const StudentActivity = () => {
  const { user } = useAuthContext()
  const { stdId, id } = useParams()
  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  const [res, setRes] = useState("")
  const [error, setError] = useState("")
  const [codeData, setCodeData] = useState("")
  const { loading, startLoading, stopLoading } = useLoading()
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [testCase, setTestCases] = useState<TestCase>()

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
    socket.on(`code-update-${stdId}`, ({ lang, code }) => {
      if (selectLangRef.current !== lang) {
        selectLangRef.current = lang
        setSelectedLanguage(lang)
      }
      setCodeData(code)
      editorRef.current?.setValue(code)
    })
  }, [])

  useEffect(() => {
    if (expId) {
      const testCasesRef = doc(collection(db, `test-cases`), expId)
      getDoc(testCasesRef).then((docSnap) => {
        const data = docSnap.data()
        setTestCases(data as TestCase)
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
          <div className="flex-grow rounded border p-2">
            <Tabs>
              <TabList>
                <Tab>Problem Statement</Tab>
                <Tab>Testcases</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <div />
                </TabPanel>
                <TabPanel>
                  <div className="flex">
                    <div className="w-1/2 whitespace-pre-line border-r-2 border-gray-300 p-2">
                      {testCase?.inputs &&
                        testCase.inputs.map((inp) => {
                          return (
                            <>
                              <div>{inp.content}</div>
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
          <div className="flex flex-grow flex-col">
            <h1>Output:</h1>
            <Textarea
              readOnly
              value={res ? res : error}
              background="gray.800"
              fontSize="sm"
              padding="2"
              className={
                "flex-grow rounded border bg-gray-900 font-mono text-white" +
                (error ? " text-red-500" : "")
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
