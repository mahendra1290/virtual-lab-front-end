import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Select,
  Textarea,
} from "@chakra-ui/react"
import Editor from "@monaco-editor/react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { editor } from "monaco-editor"
import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import Header from "../../components/header/header"
import useLoading from "../../hooks/useLoading"
import { useAuthContext } from "../../providers/AuthProvider"
import LabSessionChatBox from "../../components/chatbox/LabSessionChatBox"
import LabSessionChatPopover from "../../components/chatbox/LabSessionChatPopover"

const languageOptions = ["javascript", "typescript", "cpp", "java", "python"]

const socket = io("http://localhost:5000", {
  autoConnect: false,
})

export const StudentActivity = () => {
  const { user } = useAuthContext()
  const { stdId, id } = useParams()
  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  const [res, setRes] = useState("")
  const [error, setError] = useState("")
  const [codeData, setCodeData] = useState("")
  const { loading, startLoading, stopLoading } = useLoading()
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")

  const studName = localStorage.getItem("stdName")

  useEffect(() => {
    socket.auth = { uid: stdId }
    // console.log("student uid", stdId)

    socket.connect()
    // socket.on("connect", () => {
    //   console.log(socket.id)
    // })

    socket.emit("view-student", stdId)
    socket.on(`code-update-${stdId}`, (code) => {
      //   console.log(code, " code cde ")
      setCodeData(code)
    })
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

      //   console.log(editorRef.current.getValue())
    }
  }

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCodeData(value)
      socket.emit("save-code", value)
    }
  }

  return (
    <div>
      <Header
        title={studName || ""}
        pathList={[]}
        // rightContent={<Button colorScheme="blue">Join</Button>}
      />
      <div className="flex gap-2 border p-4">
        <div className="w-1/2 rounded-md border p-2">
          <div className="flex gap-4 rounded  p-2">
            <div className="flex flex-grow gap-4">
              <FormControl size="sm" className="flex items-center">
                <FormLabel htmlFor="language">Language</FormLabel>
                <Select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
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
            value={codeData}
            theme="vs-light"
            onChange={handleCodeChange}
            onMount={(editor, monaco) => {
              editorRef.current = editor
            }}
          />
        </div>
        <div className="flex w-1/2 flex-col justify-items-stretch gap-2">
          <div className="flex-grow rounded border p-2">Problem Statement</div>
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
        <LabSessionChatPopover>
          <LabSessionChatBox sessionId={id || ""} studentId={stdId || ""} />
        </LabSessionChatPopover>
      </div>
    </div>
  )
}
