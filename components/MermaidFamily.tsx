'use client'
import { useState, useRef, useEffect } from 'react'
import mermaid from 'mermaid'
import { useSearchParams } from 'next/navigation'
import * as d3 from 'd3'

/*
 * using d3 to zoom entire svg
 */
const zoom = d3.zoom().on('zoom', function (event) {
  d3.select(this).select('g').attr('transform', event.transform)
  d3.select(this)
    .select('g')
    .attr('stroke-width', 1 / event.transform.k)
})
const className =
  'max-w-[150px] md:max-w-[300px] bg-stone-900 -translate-x-6 translate-y-4 text-base text-stone-300 dark:text-lime-300 border-2 border-blue-500 p-4'

const tooltip = d3
  .select('body')
  .append('div')
  .attr('class', className)
  .style('opacity', 0)
  .style('position', 'absolute')
  .style('pointer-events', 'none')

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

function d3HandleZoom(id) {
  const [svgWidth, svgHeight, svgRoot] = getSVG(id)
  if (svgRoot !== null) {
    svgRoot.call(zoom)
    svgRoot.on('click', function () {
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

/*
 * using d3 to find <span class='edgeLabel'
 */
function d3HandleEdgeLabel(id) {
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
function d3HandleAnchor(id, md) {
  const [svgWidth, svgHeight, svgRoot] = getSVG(id)
  if (svgRoot === null) {
    console.log('in d3handleAnchor, svgRoot is null')
    return
  }
  const anchor = svgRoot.selectAll('a')
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
        if (md === true) {
          return
        }
        e.preventDefault()
        e.stopPropagation()
        const n = d3.select(this).node() as SVGSVGElement
        const transformList = n?.transform.baseVal
        if (transformList.numberOfItems > 0) {
          const transform = transformList.getItem(0)
          const matrix = transform.matrix
          const [svgWidth, svgHeight, svgRoot] = getSVG(id)
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
                      .scale(2)
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

function d3AppendResetSvg(id) {
  const [w, h, svg] = getSVG(id)
  if (svg !== null) {
    const resetSVG = svg
      .append('svg')
      .attr('viewBox', '0 0 24 24') // Set width of the inner SVG
      .attr('width', 36) // Set height of the inner SVG
      .attr('height', 36) // Set height of the inner SVG
      .attr('x', 10) // Position the inner SVG within the parent SVG
      .attr('y', 10)
      .attr('fill', 'none')
      .attr('stroke-width', '1.5')
      .attr('stroke', 'currentColor')
      .attr('class', 'size-6')
    resetSVG
      .style('fill', 'transparent')
      .append('path')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr(
        'd',
        'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z'
      )
    resetSVG
      .on('click', function () {
        const node = svg.node() as SVGSVGElement
        if (node) {
          svg
            .transition()
            .duration(750)
            .on('end', function () {
              if (this instanceof SVGSVGElement) {
                zoom.transform(
                  d3.select<SVGSVGElement, unknown>(this),
                  d3.zoomIdentity,
                  d3.zoomTransform(node).invert([w / 2, h / 2])
                )
              }
            })
        }
      })
      .on('mouseover', function (e, d) {
        d3.select(this).style('cursor', 'pointer')
        tooltip.html('Reset<br/>Graph').style('opacity', 1)
      })
      .on('mousemove', function (e, d) {
        tooltip.style('left', e.pageX + 10 + 'px').style('top', e.pageY - 10 + 'px')
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0)
      })
  }
}
const Mermaid = ({ chart, mDevice }) => {
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
            if (mDevice === false) {
              d3HandleZoom(diagramId)
            }
            d3HandleAnchor(diagramId, mDevice)
            d3HandleEdgeLabel(diagramId)
            if (mDevice === false) {
              d3AppendResetSvg(diagramId)
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
  }, [chart, msg, mDevice]) // Re-render if the chart code changes

  return <div ref={mermaidRef}></div>
}

export default Mermaid
