'use client'
import { useState, useRef, useEffect } from 'react'
import mermaid from 'mermaid'

const Mermaid = ({ chart }) => {
  const mermaidRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (mermaidRef.current) {
      const renderChart = async () => {
        // Generate a unique ID for the diagram
        const diagramId = `mermaid-diagram-${Math.random().toString(36).substring(7)}`
        try {
          const { svg, bindFunctions } = await mermaid.render(diagramId, chart)
          if (mermaidRef.current !== null) {
            mermaidRef.current.innerHTML = svg
            bindFunctions?.(mermaidRef.current)
          }
        } catch (error) {
          console.error('Mermaid render error:', error)
          if (mermaidRef.current !== null) {
            mermaidRef.current.innerHTML = `<div style="color: red">Error rendering diagram.</div>`
          }
        }
      }
      renderChart()
    }
  }, [chart]) // Re-render if the chart code changes

  return <div ref={mermaidRef}></div>
}

export default Mermaid
