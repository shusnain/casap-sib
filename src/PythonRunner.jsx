import { useState, useRef, useCallback, useEffect } from 'react'
import { Play, Loader } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'

const DEFAULT_CODE = `def get_even_numbers(arr):
    if arr is None:
        return []
    if not isinstance(arr, list):
        raise TypeError(f"Expected a list, got {type(arr).__name__}")
    return [x for x in arr if not isinstance(x, bool) and isinstance(x, int) and x % 2 == 0]


# Test cases
print(get_even_numbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
print(get_even_numbers([]))
print(get_even_numbers(None))
print(get_even_numbers([True, False, 2, 4]))
print(get_even_numbers([1, 3, 5, 7]))
print(get_even_numbers(["2", "4", 6, 8]))
`

function highlightCode(code) {
  return Prism.highlight(code, Prism.languages.python, 'python')
}

export default function PythonRunner() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [loading, setLoading] = useState(false)
  const pyodideRef = useRef(null)
  const textareaRef = useRef(null)
  const preRef = useRef(null)

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current
    setLoading(true)
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js'
    document.head.appendChild(script)
    await new Promise((resolve) => { script.onload = resolve })
    const pyodide = await window.loadPyodide()
    pyodideRef.current = pyodide
    setLoading(false)
    return pyodide
  }, [])

  const runCode = useCallback(async () => {
    setRunning(true)
    setOutput('')
    try {
      const pyodide = await loadPyodide()
      pyodide.setStdout({ batched: (text) => setOutput((prev) => prev + text + '\n') })
      pyodide.setStderr({ batched: (text) => setOutput((prev) => prev + text + '\n') })
      await pyodide.runPythonAsync(code)
    } catch (err) {
      setOutput((prev) => prev + err.message + '\n')
    }
    setRunning(false)
  }, [code, loadPyodide])

  // Sync scroll between textarea and highlighted pre
  const syncScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop
      preRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }, [])

  // Auto-resize both textarea and pre to fit content
  const autoResize = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = ta.scrollHeight + 'px'
  }, [])

  useEffect(() => { autoResize() }, [code, autoResize])

  // Handle tab key in textarea
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = textareaRef.current
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const newCode = code.substring(0, start) + '    ' + code.substring(end)
      setCode(newCode)
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4
      })
    }
  }, [code])

  return (
    <div className="python-runner">
      <div className="python-editor-header">
        <span className="python-filename">solution.py</span>
        <button
          className="python-run-btn"
          onClick={runCode}
          disabled={running || loading}
        >
          {running || loading ? (
            <Loader size={14} className="spinning" />
          ) : (
            <Play size={14} />
          )}
          {loading ? 'Loading Python...' : running ? 'Running...' : 'Run'}
        </button>
      </div>
      <div className="python-editor-wrap">
        <pre
          ref={preRef}
          className="python-highlight"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: highlightCode(code) + '\n' }}
        />
        <textarea
          ref={textareaRef}
          className="python-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          spellCheck={false}
        />
      </div>
      {output && (
        <div className="python-output">
          <div className="python-output-header">Output</div>
          <pre className="python-output-content">{output}</pre>
        </div>
      )}
    </div>
  )
}
