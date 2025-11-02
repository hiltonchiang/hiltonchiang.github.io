'use client'
import { useState, useRef, useEffect } from 'react'
import mermaid from 'mermaid'

export const zoomIndex = 1.0

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
            const element = document.getElementById(diagramId)
            if (element instanceof SVGSVGElement) {
              const _svg_: SVGSVGElement = element
              console.log(_svg_.viewBox.baseVal)
              console.log(_svg_.transform.baseVal)
              const scale = 'scale(' + zoomIndex + ')'
              console.log(scale)
              _svg_.setAttribute('transform', scale)
            }
          }
        } catch (error) {
          console.error('Mermaid render error:', error)
          if (mermaidRef.current !== null) {
            mermaidRef.current.innerHTML = `<div style="color: red">Error rendering diagram.</div>`
          }
        }
        const myButton = document.getElementById('myButton')
        myButton?.addEventListener('click', () => {
          myButton.textContent = 'Clicked!'
          myButton.classList.remove('bg-blue-500', 'hover:bg-blue-700')
          myButton.classList.add('bg-green-500', 'hover:bg-green-700')
          console.log('Button was clicked!')
        })
      }
      renderChart()
    }
  }, [chart]) // Re-render if the chart code changes

  return <div ref={mermaidRef}></div>
}

export default Mermaid
