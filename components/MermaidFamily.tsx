'use client'
import { useState, useRef, useEffect } from 'react'
import mermaid from 'mermaid'
import { useSearchParams } from 'next/navigation'

let zoomIndex = 1.0
let xPosition = 0.0
let yPosition = 150.0

interface Props {
  id: string
}
function transformSVG(id: string) {
  const element = document.getElementById(id)
  if (element instanceof SVGSVGElement) {
    const _svg_: SVGSVGElement = element
    const attr = 'scale(' + zoomIndex + ')' + 'translate(' + xPosition + ',' + yPosition + ')'
    _svg_.setAttribute('transform', attr)
  }
}
function handleButtons(diagramId: string) {
  const buttonLeft = document.getElementById('familyLeftArrow')
  if (buttonLeft !== null) {
    buttonLeft.addEventListener('click', function () {
      console.log('LeftArrow Button clicked!')
      xPosition -= 5
      transformSVG(diagramId)
    })
  }
  const buttonRight = document.getElementById('familyRightArrow')
  if (buttonRight !== null) {
    buttonRight.addEventListener('click', function () {
      console.log('RightArrow Button clicked!')
      xPosition += 5
      transformSVG(diagramId)
    })
  }
  const buttonUp = document.getElementById('familyUpArrow')
  if (buttonUp !== null) {
    buttonUp.addEventListener('click', function () {
      console.log('UpArrow Button clicked!')
      yPosition -= 5
      transformSVG(diagramId)
    })
  }
  const buttonDown = document.getElementById('familyDownArrow')
  if (buttonDown !== null) {
    buttonDown.addEventListener('click', function () {
      console.log('DownArray Button clicked!')
      yPosition += 5
      transformSVG(diagramId)
    })
  }
  const buttonZoomIn = document.getElementById('familyZoomIn')
  if (buttonZoomIn !== null) {
    buttonZoomIn.addEventListener('click', function () {
      console.log('ZoomIn Button clicked!')
      if (zoomIndex < 1.45) {
        zoomIndex += 0.1
        transformSVG(diagramId)
      }
    })
  }
  const buttonZoomOut = document.getElementById('familyZoomOut')
  if (buttonZoomOut !== null) {
    buttonZoomOut.addEventListener('click', function () {
      console.log('ZoomOut Button clicked!')
      if (zoomIndex >= 1.0) {
        zoomIndex -= 0.1
        transformSVG(diagramId)
      }
    })
  }
}

const Mermaid = ({ chart }) => {
  const mermaidRef = useRef<HTMLDivElement | null>(null)
  const searchParams = useSearchParams()
  const msg = searchParams.get('msg')
  console.log(msg)
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
            transformSVG(diagramId)
            handleButtons(diagramId)
            const tooltips = document.getElementById('tooltips-message') as HTMLTextAreaElement
            console.log(tooltips)
            if (msg !== null && tooltips !== null) {
              tooltips.textContent = msg
              console.log(tooltips)
            }
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
  }, [chart, msg]) // Re-render if the chart code changes

  return <div ref={mermaidRef}></div>
}

export default Mermaid
