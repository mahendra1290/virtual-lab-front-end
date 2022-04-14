import { Editor, EditorState } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

type TextEditorProps = {
  value?: EditorState
  onChange?: (editorState: EditorState) => void
}

const TextEditor = ({ value, onChange }: TextEditorProps) => {
  return (
    <Editor
      editorState={value}
      onEditorStateChange={onChange}
      wrapperClassName="min-h-[20rem] flex flex-col"
      editorClassName="flex-grow border rounded p-2"
      placeholder="Write here..."
      toolbarClassName="p-4"
    />
  )
}

export default TextEditor
