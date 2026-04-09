import { useRef, useCallback } from 'react'

export default function useDragScroll() {
  const ref = useRef(null)
  const state = useRef(null)

  const onPointerDown = useCallback((e) => {
    const el = ref.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    state.current = {
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
    }
    el.style.cursor = 'grabbing'
  }, [])

  const onPointerMove = useCallback((e) => {
    if (!state.current) return
    const el = ref.current
    el.scrollLeft = state.current.scrollLeft - (e.clientX - state.current.startX)
  }, [])

  const onPointerUp = useCallback(() => {
    state.current = null
    if (ref.current) ref.current.style.cursor = 'grab'
  }, [])

  return {
    ref,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    style: { cursor: 'grab' },
  }
}
