import SyntaxHighlighter from 'react-syntax-highlighter'
import { monokaiSublime } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export const Code = ({ code }: { code: string }) => (
  <SyntaxHighlighter language="javascript" style={monokaiSublime}>
    {code}
  </SyntaxHighlighter>
)
