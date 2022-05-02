import SyntaxHighlighter from "react-syntax-highlighter"
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs"

const CodeViewer = ({ code, lang }: { code: string; lang: string }) => {
  return (
    <SyntaxHighlighter language={lang} style={docco}>
      {code}
    </SyntaxHighlighter>
  )
  // return <div></div>
}

export default CodeViewer
