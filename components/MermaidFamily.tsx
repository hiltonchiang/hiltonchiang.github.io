'use client'
import { useState, useRef, useEffect } from 'react'
import mermaid from 'mermaid'
import { useSearchParams } from 'next/navigation'
import * as d3 from 'd3'

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
      xPosition -= 5
      transformSVG(diagramId)
    })
  }
  const buttonRight = document.getElementById('familyRightArrow')
  if (buttonRight !== null) {
    buttonRight.addEventListener('click', function () {
      xPosition += 5
      transformSVG(diagramId)
    })
  }
  const buttonUp = document.getElementById('familyUpArrow')
  if (buttonUp !== null) {
    buttonUp.addEventListener('click', function () {
      yPosition -= 5
      transformSVG(diagramId)
    })
  }
  const buttonDown = document.getElementById('familyDownArrow')
  if (buttonDown !== null) {
    buttonDown.addEventListener('click', function () {
      yPosition += 5
      transformSVG(diagramId)
    })
  }
  const buttonZoomIn = document.getElementById('familyZoomIn')
  if (buttonZoomIn !== null) {
    buttonZoomIn.addEventListener('click', function () {
      if (zoomIndex < 1.45) {
        zoomIndex += 0.1
        transformSVG(diagramId)
      }
    })
  }
  const buttonZoomOut = document.getElementById('familyZoomOut')
  if (buttonZoomOut !== null) {
    buttonZoomOut.addEventListener('click', function () {
      if (zoomIndex >= 1.0) {
        zoomIndex -= 0.1
        transformSVG(diagramId)
      }
    })
  }
}

function handleD3() {
  const tooltip = d3
    .select('body')
    .append('div')
    .attr(
      'class',
      'max-w-[300px] bg-stone-900  -translate-x-6 translate-y-4 text-base text-stone-300 dark:text-lime-300 border-2 border-blue-500 p-4'
    )
    .style('opacity', 0)
    .style('position', 'absolute')
    .style('pointer-events', 'none')
  const anchor = d3.selectAll('a')
  if (anchor.size() !== 0) {
    anchor
      .on('mouseover', function (event, d) {
        console.log('we are in mouseover')
        const tip = d3.select(this).attr('xlink:href')
        tooltip.html(tip).style('opacity', 1)
      })
      .on('mousemove', function (event) {
        tooltip.style('left', event.pageX + 10 + 'px').style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0)
      })
  }
}
const Mermaid = ({ chart }) => {
  const mermaidRef = useRef<HTMLDivElement | null>(null)
  const searchParams = useSearchParams()
  const msg = searchParams.get('msg')
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
            if (msg !== null && tooltips !== null) {
              tooltips.textContent = msg
            }
            handleD3()
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
