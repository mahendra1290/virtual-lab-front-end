import { CodeEditor } from "../../components/CodeEditor"

import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"
import { MonacoBinding } from "y-monaco"
import Editor from "@monaco-editor/react"
import { editor } from "monaco-editor"
import { useRef } from "react"

// const ydocument = new Y.Doc()
// const provider = new WebsocketProvider(
//   // `wss://mahendrasuthar.engineer/yjs`,
//   "wss://7769-2402-3a80-d7d-9e5f-92a6-5ad1-df15-4916.ngrok.io",
//   "monaco-ed",
//   ydocument
// )
// const type = ydocument.getText("monaco")

const CodeEditorPage = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  const monacoBinding = useRef()

  const onMonacoMount = (editor: editor.IStandaloneCodeEditor) => {
    // if (!monacoBinding.current) {
    //   const bind = new MonacoBinding(
    //     type,
    //     editor.getModel(),
    //     new Set([editorRef.current]),
    //     provider.awareness
    //   )
    //   monacoBinding.current = bind
    //   if (provider.shouldConnect) {
    //     provider.connect()
    //   }
    // }
  }

  return (
    <div>
      <Editor
        height="70vh"
        language={"javascript"}
        className="w-1/2"
        theme="vs-light"
        onMount={(editor, monaco) => {
          editorRef.current = editor
          onMonacoMount(editor)
        }}
      />
    </div>
  )
}

export default CodeEditorPage
