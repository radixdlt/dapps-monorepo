import { Code } from './Code'
import { useState } from 'react'
export const useLogger = () => {
  const [state, setState] = useState<{
    address?: string
    logs: string[]
  }>({ logs: [] })

  const addLog = (log: string) =>
    setState((prev) => ({
      ...prev,
      logs: [...prev.logs, `[${new Date().toLocaleTimeString()}] ${log}`]
    }))

  return {
    Logger: state.logs.length ? (
      <Code code={state.logs.reverse().join('\n')}></Code>
    ) : null,
    addLog,
    reset: () => setState({ logs: [] })
  }
}
