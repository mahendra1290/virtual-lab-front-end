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
import { editor } from "monaco-editor"
import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import useLoading from "../hooks/useLoading"
import { useAuthContext } from "../providers/AuthProvider"

const languageOptions = ["javascript", "typescript", "cpp", "java", "python"]

const socket = io("http://localhost:5000", {
  autoConnect: false,
})

export const CodeEditor = () => {
  const { user } = useAuthContext()

  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  const [res, setRes] = useState("")
  const [error, setError] = useState("")
  const { loading, startLoading, stopLoading } = useLoading()
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")

  useEffect(() => {
    socket.auth = { uid: user?.uid }
    console.log("student uid", user?.uid)

    socket.connect()
    socket.on("connect", () => {
      console.log(socket.id)
    })
  }, [])

  const handleRun = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue()
      startLoading()
      setRes("")
      setError("")
      axios
        .post("/code/run/js", { code })
        .then((res) => {
          if (res.status == 400) {
            stopLoading()
          }
          if (res.data.error) {
            setError(res.data.error)
            setRes("")
          } else {
            setRes(res.data.out)
            setError("")
          }
          stopLoading()
        })
        .catch((err) => stopLoading())

      console.log(editorRef.current.getValue())
    }
  }

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      socket.emit("save-code", value)
    }
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
    </div>
  )
}
