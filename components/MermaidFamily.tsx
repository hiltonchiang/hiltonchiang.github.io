'use client'
import { useState, useRef, useEffect } from 'react'
import mermaid from 'mermaid'
import { useSearchParams } from 'next/navigation'
import * as d3 from 'd3'

let svgWidth
let svgHeight
let svgRoot
/*
 * using d3 to zoom entire svg
 */
const zoom = d3.zoom().on('zoom', function (event) {
  d3.select(this).select('g').attr('transform', event.transform)
  d3.select(this)
    .select('g')
    .attr('stroke-width', 1 / event.transform.k)
})

function d3HandleZoom() {
  const svg = d3.selectAll('svg')
  svg.each(function (d, i, nodes) {
    const id = d3.select(this).attr('id')
    if (id !== null && id.includes('mermaid')) {
      d3.select(this).call(zoom)
      const vboxStr = d3.select(this).attr('viewBox')
      if (vboxStr !== null) {
        svgRoot = d3.select(this)
        const vbox = vboxStr.split(' ')
        svgWidth = Number(vbox[2])
        svgHeight = Number(vbox[3])
        console.log(vbox, 'W ', svgWidth, 'H ', svgHeight)
        d3.select(this).on('click', function () {
          const _svg_ = d3.select(this)
          const node = _svg_.node() as SVGSVGElement
          if (node) {
            _svg_
              .transition()
              .duration(750)
              .on('end', function () {
                if (this instanceof SVGSVGElement) {
                  zoom.transform(
                    d3.select<SVGSVGElement, unknown>(this),
                    d3.zoomIdentity,
                    d3.zoomTransform(node).invert([svgWidth / 2, svgHeight / 2])
                  )
                }
              })
          }
        })
      }
    }
  })
}

/*
 * using d3 to find <span class='edgeLabel'
 */
function d3HandleEdgeLabel() {
  const group = d3.selectAll('g')
  group.each(function (d, i, nodes) {
    /*
     * 'this' refers to the current circle element
     * 'd' is the data bound to this circle
     * 'i' is the index of this group in the selection
     * nodes' is the array of all selected group elements
     */
    const edge = d3.select(this).attr('class')
    if (edge === 'edgeLabel') {
      const tr = d3.select(this).attr('transform')
      if (tr != null) {
        const span = d3.select(this).select('span').attr('class')
        if (span !== null && span === 'edgeLabel') {
          const p = d3.select(this).select('span').select('p')
          if (!p.empty()) {
            d3.select(this)
              .on('mouseover', function (event, d) {
                const tr = d3.select(this).attr('transform')
                d3.select(this).attr('transform', tr + ',scale(1.9)')
              })
              .on('mouseout', function () {
                const tr = d3.select(this).attr('transform')
                d3.select(this).attr('transform', tr.replace(',scale(1.9)', ''))
              })
          }
        }
      }
    }
  })
}
/*
 * using d3 to find anchor and display Tooltips
 */
function d3HandleAnchor() {
  const className =
    'max-w-[150px] md:max-w-[300px] bg-stone-900 -translate-x-6 translate-y-4 text-base text-stone-300 dark:text-lime-300 border-2 border-blue-500 p-4'
  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', className)
    .style('opacity', 0)
    .style('position', 'absolute')
    .style('pointer-events', 'none')
  const anchor = d3.selectAll('a')
  if (anchor.size() !== 0) {
    anchor
      .on('mouseover', function (event, d) {
        const tip = d3.select(this).attr('xlink:href')
        const tr = d3.select(this).attr('transform')
        const trscale = tr + ',scale(2.0)'
        d3.select(this).attr('transform', trscale)
        tooltip.html(tip).style('opacity', 1)
      })
      .on('mousemove', function (event) {
        tooltip.style('left', event.pageX + 10 + 'px').style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0)
        const tr = d3.select(this).attr('transform')
        d3.select(this).attr('transform', tr.replace(',scale(2.0)', ''))
      })
      .on('click', function (e, d) {
        e.preventDefault()
        e.stopPropagation()
        const n = d3.select(this).node() as SVGSVGElement
        const transformList = n?.transform.baseVal
        if (transformList.numberOfItems > 0) {
          const transform = transformList.getItem(0)
          const matrix = transform.matrix
          if (svgRoot) {
            const node = svgRoot.node()
            if (node) {
              svgRoot
                .transition()
                .duration(750)
                .on('end', function () {
                  const centerX = matrix.e
                  const centerY = matrix.f
                  const svgCenterX = svgWidth / 2
                  const svgCenterY = svgHeight / 2
                  zoom.transform(
                    svgRoot,
                    d3.zoomIdentity
                      .translate(svgCenterX, svgCenterY)
                      .scale(1.5)
                      .translate(-centerX, -centerY),
                    d3.pointer(e, node)
                  )
                })
            }
          }
        }
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
            d3HandleZoom()
            d3HandleAnchor()
            d3HandleEdgeLabel()
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
