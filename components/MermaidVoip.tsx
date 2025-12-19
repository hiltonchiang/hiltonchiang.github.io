'use client'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'
import mermaid from 'mermaid'
import { gsap } from 'gsap'
import * as d3 from 'd3'

export const zoomIndex = 1.0

function getSVG(
  svgId: string
): [number, number, d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown> | null] {
  const svg = d3.selectAll('svg')
  const nodes = svg.nodes()
  let svgRoot
  let svgWidth = -1
  let svgHeight = -1
  for (let i = 0; i < nodes.length; i++) {
    const id = d3.select(nodes[i]).attr('id')
    if (id !== null && id === svgId) {
      const vboxStr = d3.select(nodes[i]).attr('viewBox')
      if (vboxStr !== null) {
        svgRoot = d3.select(nodes[i])
        const vbox = vboxStr.split(' ')
        svgWidth = Number(vbox[2])
        svgHeight = Number(vbox[3])
        break
      }
    }
  }
  return [svgWidth, svgHeight, svgRoot]
}

interface Figure1Props {
  line: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>
}
const animateFigure1 = (svg) => {
  if (svg === null) return
  const msgLines: SVGLineElement[] = [] as SVGLineElement[]
  const L = svg.selectAll('line')
  for (const el of L) {
    const cls = d3.select(el).attr('class')
    console.log('animateFigure1 line el', cls)
    if (cls === 'messageLine0' || cls === 'messageLine1') {
      msgLines.push(el)
    }
  }
  // const tl = gsap.timeline({ repeat: -1 })
  const tl = gsap.timeline()
  for (let i = 0; i < msgLines.length; i++) {
    const line = msgLines[i]
    const G = svg.append('g')
    const circle = G.append('circle')
    circle
      .attr('cx', 0) // X-coordinate of the center
      .attr('cy', 0) // Y-coordinate of the center
      .attr('r', 5) // Radius of the circle
      .attr('style', 'fill:#2563eb !important') // Fill color
      .attr('stroke', 'black') // Border color
    const pathElement = MotionPathPlugin.convertToPath(line)
    if (pathElement !== null) {
      tl.to(circle.node(), {
        duration: 3,
        ease: 'power1.inOut',
        overwrite: 'auto',
        immediateRender: false,
        motionPath: {
          path: pathElement[0],
          align: pathElement[0],
          autoRotate: false,
          alignOrigin: [0.5, 0.5],
        },
        onStart: () => {},
        onComplete: () => {},
        onUpdate: () => {},
      })
    }
    /**
    if (line !== null) {
      gsap.set(line, { drawSVG: '0%' })
      tl.to(line, {
        duration: 3,
        drawSVG: '100%',
        ease: 'power1.inOut',
        onUpdate: function (this: gsap.core.Tween) {
          const targetElement = this.targets()[0] as SVGGraphicsElement
          console.log('Current x value:', targetElement)
        },
      })
    }*/
  }
  console.log('b4 tl.play')
  tl.play()
}
const animateFigure2 = (svg) => {}
const animateFigure3 = (svg) => {}
const animation = (id) => {
  console.log('animation IN, id', id)
  const [svgWidth, svgHeight, svgRoot] = getSVG(id)
  if (svgRoot !== null) {
    const divs = d3.selectAll('main').selectAll('div')
    const nodes = divs.nodes()
    for (let i = 0; i < nodes.length; i++) {
      const N = d3.select(nodes[i])
      const fig = N.attr('id')
      const svg = N.selectAll('svg')
      if (svg !== null && svg.node() !== null) {
        //console.log('svg', svg.node())
        const svgId = svg.attr('id')
        //console.log('svgId', svgId, id, fig)
        if (svgId !== id) continue
      } else {
        console.log('svg is null', id, fig)
        continue
      }
      //console.log('fig', fig)
      switch (fig) {
        case 'figure1':
          animateFigure1(svgRoot)
          break
        case 'figure2':
          animateFigure2(svgRoot)
          break
        case 'figure3':
          animateFigure3(svgRoot)
          break
      }
    }
  }
}

const MermaidVoip = ({ chart }) => {
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
              const scale = 'scale(' + zoomIndex + ')'
              _svg_.setAttribute('transform', scale)
            }
            gsap.registerPlugin(DrawSVGPlugin)
            gsap.registerPlugin(MotionPathPlugin)
            animation(diagramId)
          }
        } catch (error) {
          if (mermaidRef.current !== null) {
            console.log(error)
            mermaidRef.current.innerHTML = `<div style="color: red">Error rendering diagram.</div>`
          }
        }
      }
      renderChart()
    }
  }, [chart]) // Re-render if the chart code changes

  return <div ref={mermaidRef}></div>
}

export default MermaidVoip
