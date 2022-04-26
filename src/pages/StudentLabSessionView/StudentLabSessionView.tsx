import { Textarea } from "@chakra-ui/react"
import Editor from "@monaco-editor/react"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { io } from "socket.io-client"
import { useAuthContext } from "../../providers/AuthProvider"

const socket = io("http://localhost:5000", {
  autoConnect: false,
})

const StudentLabSessionView = () => {
  const { user } = useAuthContext()
  const { id } = useParams()
  const [data, setData] = useState("")

  useEffect(() => {
    socket.auth = { uid: user?.uid }
    socket.connect()
    socket.on("connect", () => {
      console.log("connected", socket.id)
    })
    socket.emit("view-student", id)
    socket.on(`code-update-${id}`, (code) => {
      console.log(code)
      setData(code)
    })
  }, [])

  return (
    <div>
      <Editor
        // readOnly
        language="javascript"
        height="80vh"
        className="border-2 p-4 font-mono"
        value={data}
      />
    </div>
  )
}

export default StudentLabSessionView
