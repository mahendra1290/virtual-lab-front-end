import { CodeEditor } from "../../components/CodeEditor"

import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"
import { MonacoBinding } from "y-monaco"
import Editor from "@monaco-editor/react"
import { editor } from "monaco-editor"
import { useRef } from "react"

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
