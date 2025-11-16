'use client'
import { useState, useRef, useEffect } from 'react'
import mermaid from 'mermaid'
import { useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import parse from 'parse-svg-path'
import * as d3 from 'd3'
/*
 * Transform return types
 */
interface TypeMatrix {
  type: string
  a: number
  b: number
  c: number
  d: number
  e: number
  f: number
}
interface TypeTranslateScale {
  type: string
  x: number
  y: number
}
interface TypeRotate {
  type: string
  angle: number
  x: number
  y: number
}
interface TypeSkew {
  type: string
  angle: number
}
type TypeTransform = TypeMatrix | TypeTranslateScale | TypeRotate | TypeSkew

function parseSvgTransform(transformString) {
  const svgns = 'http://www.w3.org/2000/svg'
  // Create a temporary SVG element to apply the transform to
  const tempSvg = document.createElementNS(svgns, 'svg')
  const tempRect = document.createElementNS(svgns, 'rect')
  // Get the transform attribute value from the target element
  // const transformString = element.getAttribute('transform')

  if (!transformString) {
    return [] // No transform attribute found
  }

  // Set the transform attribute on the temporary element
  tempRect.setAttribute('transform', transformString)
  // Access the SVGTransformList through the DOM API
  const transformList = tempRect.transform.baseVal
  const parsedTransforms: TypeTransform[] = []

  for (let i = 0; i < transformList.numberOfItems; i++) {
    const transform = transformList.getItem(i)
    const matrix = transform.matrix

    switch (transform.type) {
      case SVGTransform.SVG_TRANSFORM_MATRIX:
        parsedTransforms.push({
          type: 'matrix',
          a: matrix.a,
          b: matrix.b,
          c: matrix.c,
          d: matrix.d,
          e: matrix.e,
          f: matrix.f,
        })
        break
      case SVGTransform.SVG_TRANSFORM_TRANSLATE:
        parsedTransforms.push({
          type: 'translate',
          x: matrix.e,
          y: matrix.f,
        })
        break
      case SVGTransform.SVG_TRANSFORM_SCALE:
        parsedTransforms.push({
          type: 'scale',
          x: matrix.a,
          y: matrix.d,
        })
        break
      case SVGTransform.SVG_TRANSFORM_ROTATE:
        // Note: The matrix for rotate will be more complex,
        // but the SVGTransform object directly provides the angle.
        parsedTransforms.push({
          type: 'rotate',
          angle: transform.angle,
          x: transform.matrix.e, // Rotation center x (if specified)
          y: transform.matrix.f, // Rotation center y (if specified)
        })
        break
      case SVGTransform.SVG_TRANSFORM_SKEWX:
        parsedTransforms.push({
          type: 'skewX',
          angle: transform.angle,
        })
        break
      case SVGTransform.SVG_TRANSFORM_SKEWY:
        parsedTransforms.push({
          type: 'skewY',
          angle: transform.angle,
        })
        break
      default:
        // Handle other transform types or unknown types if necessary
        break
    }
  }
  return parsedTransforms
}
function getDataBlur() {
  let flag = false
  const divs = d3.selectAll('main').selectAll('div')
  const nodes = divs.nodes()
  for (let i = 0; i < nodes.length; i++) {
    const id = d3.select(nodes[i]).attr('id')
    if (id === 'main-family-page') {
      const blur = d3.select(nodes[i]).attr('data-blur')
      if (blur === 'true') {
        flag = true
      } else {
        flag = false
      }
    }
  }
  return flag
}

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
  .attr('id', 'mermaid-tooltip-body')
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
function getG(
  gId: string
): [string, d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown> | null] {
  const gs = d3.selectAll('g')
  const nodes = gs.nodes()
  let g
  for (let i = 0; i < nodes.length; i++) {
    const id = d3.select(nodes[i]).attr('id')
    if (id !== null && id === gId) {
      g = d3.select(nodes[i])
      break
    }
  }
  return [gId, g]
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
interface CellObj {
  group: string
  index: number
}
interface EdgeLabelObj {
  g: d3.Selection<SVGGElement, unknown, HTMLElement | null, unknown>
  transform: TypeTransform[]
  dataId: string
  from: string
  to: string
  parent: CellObj[]
  type: string
}
function d3HandleEdgeLabel(id, map) {
  const group = d3.selectAll('g')
  const M: EdgeLabelObj[] = []
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
        const g: d3.Selection<SVGGElement, unknown, HTMLElement | null, unknown> = d3.select<
          SVGGElement,
          unknown
        >(this as SVGGElement)
        const gg: d3.Selection<SVGGElement, unknown, HTMLElement | null, unknown> =
          g.select<SVGGElement>('g')
        const dataId: string = gg?.attr('data-id')
        const transform = parseSvgTransform(d3.select(this).attr('transform'))
        const span = d3.select(this).select('span').attr('class')
        if (span !== null && span === 'edgeLabel') {
          const p = d3.select(this).select('span').select('p')
          if (!p.empty()) {
            if (dataId) {
              const D = dataId?.split('_')
              if (D.length >= 3) {
                const O: EdgeLabelObj = {
                  g: gg,
                  transform: transform,
                  dataId: dataId,
                  from: D[1],
                  to: D[2],
                  parent: [],
                  type: 'EdgeLabelObj',
                }
                M.push(O)
              }
            }
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
  map.set('edgeLabels', M)
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
        if (getDataBlur() === false) {
          tooltip.html(tip).style('opacity', 1)
        }
      })
      .on('mousemove', function (event) {
        if (getDataBlur() === false) {
          tooltip.style('left', event.pageX + 10 + 'px').style('top', event.pageY - 10 + 'px')
        }
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
/*
 * Display Title
 */
function showTitle(id, md, theme) {
  const [w, h, svg] = getSVG(id)
  if (svg === null) return
  const text = svg.select('text')
  text?.attr('class', null)
  text?.attr('font-size', '24px')
  const color = theme === 'dark' ? 'white' : 'black'
  text?.attr('fill', '#777')
  text?.attr('id', 'title-' + id)
}
/*
 * add a reset button to reset re-sized svg to its origin
 */
function d3AppendResetSvg(id, map) {
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
      .on('dblclick', function (e, d) {
        e.preventDefault()
        e.stopPropagation()
        AnimationOne(id, map, null)
      })
      .on('mouseover', function (e, d) {
        d3.select(this).style('cursor', 'pointer')
        tooltip.html('Click<br/>OR<br/>Double Click').style('opacity', 1)
      })
      .on('mousemove', function (e, d) {
        tooltip.style('left', e.pageX + 10 + 'px').style('top', e.pageY - 10 + 'px')
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0)
      })
  }
}

/*
 *
 */
interface PathObj {
  path: d3.Selection<SVGPathElement, unknown, HTMLElement | null, unknown>
  pathCmd: Array<Array<string | number>>
  id: string
  from: string
  to: string
  child: CellObj[]
  parent: CellObj[]
  type: string
}
interface NodeObj {
  node: d3.Selection<SVGGElement, unknown, HTMLElement | null, unknown>
  transform: TypeTransform[]
  id: string
  name: string
  child: CellObj[]
  parent: CellObj[]
  type: string
}
function findRelations(svgId, map) {
  const [w, h, svg] = getSVG(svgId)
  if (svg === null) return
  const Ppaths: PathObj[] = []
  const Nnodes: NodeObj[] = []
  const group = svg.selectAll('g')
  group.each(function (d, i, nodes) {
    const cls = d3.select(this).attr('class')
    if (cls === 'edgePaths') {
      const paths = d3.select(this).selectAll('path')
      paths.each(function (d, i, nodes) {
        const path: d3.Selection<SVGPathElement, unknown, HTMLElement | null, unknown> = d3.select<
          SVGPathElement,
          unknown
        >(this as SVGPathElement)
        const id = d3.select(this).attr('id')
        if (id != null) {
          const s = id.split('_')
          if (s.length >= 3) {
            const d = d3.select(this).attr('d')
            const pathCommand = parse(d)
            const O: PathObj = {
              path: path,
              pathCmd: pathCommand,
              id: id,
              from: s[1],
              to: s[2],
              child: [],
              parent: [],
              type: 'PathObj',
            }
            Ppaths.push(O)
          }
        }
      })
    } else if (cls === 'nodes') {
      const gs = d3.select(this).selectAll('g')
      gs.each(function (d, i, nodes) {
        const id = d3.select(this).attr('id')
        if (id !== null) {
          const s = id.split('-')
          const n: d3.Selection<SVGGElement, unknown, HTMLElement | null, unknown> = d3.select<
            SVGGElement,
            unknown
          >(this as SVGGElement)
          const transform = parseSvgTransform(d3.select(this).attr('transform'))
          const O: NodeObj = {
            node: n,
            transform: transform,
            id: id,
            name: s[1],
            child: [],
            parent: [],
            type: 'NodeObj',
          }
          Nnodes.push(O)
        }
      })
    }
  })
  map.set('Nodes', Nnodes)
  map.set('edgePaths', Ppaths)
  /*
   * sort map
   */
  const nodes: NodeObj[] = map.get('Nodes')
  const paths: PathObj[] = map.get('edgePaths')
  const labels: EdgeLabelObj[] = map.get('edgeLabels')
  for (let i = 0; i < nodes.length; i++) {
    const nodeName = nodes[i].name
    for (let j = 0; j < paths.length; j++) {
      const Op: CellObj = {
        group: 'edgePaths',
        index: j,
      }
      const On: CellObj = {
        group: 'Nodes',
        index: i,
      }
      if (nodeName === paths[j].from) {
        nodes[i].child.push(Op)
        paths[j].parent.push(On)
      }
      if (nodeName === paths[j].to) {
        nodes[i].parent.push(Op)
        paths[j].child.push(On)
      }
    }
  }
  for (let i = 0; i < labels.length; i++) {
    const id = labels[i].dataId
    for (let j = 0; j < paths.length; j++) {
      const Op: CellObj = {
        group: 'edgePaths',
        index: j,
      }
      const Ol: CellObj = {
        group: 'edgeLabels',
        index: i,
      }
      if (id === paths[j].id) {
        paths[j].child.push(Ol)
        labels[i].parent.push(Op)
        break
      }
    }
  }
}
/*
 * use gsap to animate
 */
function gsapAnimate(id, map) {
  const [w, h, svg] = getSVG(id)
  if (svg === null) return
  gsap.set('#' + id, { opacity: 0 })
  gsap.to('#' + id, {
    duration: 3, // Animation duration in seconds
    opacity: 1,
    ease: 'sine.inOut',
  })

  gsap.to('#title-' + id, {
    x: -25,
    duration: 3, // Animation duration in seconds
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut', // Easing function
    onUpdate: function () {
      // console.log("onUpdate", this.progress())
    },
  })
}
/*
 * Animation One
 *
 */
function findRoot(id, map): Array<PathObj | NodeObj> {
  const [w, h, svg] = getSVG(id)
  const M: Array<PathObj | NodeObj> = []
  if (svg === null) {
    return M
  }
  if (id !== map.get('diagramId')) {
    return M
  }
  const N: NodeObj[] = map.get('Nodes')
  const P: PathObj[] = map.get('edgePaths')
  for (let i = 0; i < N.length; i++) {
    if (N[i].parent.length === 0) {
      M.push(N[i])
    }
  }
  for (let i = 0; i < P.length; i++) {
    if (P[i].parent.length === 0) {
      M.push(P[i])
    }
  }
  console.log('root obj ', M)
  return M
}
function AnimationOne(id, map, curRoots: Array<PathObj | NodeObj> | null) {
  const [w, h, svg] = getSVG(id)
  if (svg === null) return
  if (id !== map.get('diagramId')) return
  const N: NodeObj[] = map.get('Nodes')
  const P: PathObj[] = map.get('edgePaths')
  const L: EdgeLabelObj[] = map.get('edgelabels')
  if (N.length == 0) return
  if (P.length == 0) return
  if (curRoots === null) {
    curRoots = findRoot(id, map)
  }
  if (curRoots.length === 0) return
  let totalAnimations = 0
  let finished = 0

  function allComplete() {
    finished++
    if (finished === totalAnimations) {
      console.log('All animations are complete!')
      const M: Array<PathObj | NodeObj> = []
      if (curRoots != null) {
        for (let i = 0; i < curRoots.length; i++) {
          for (let j = 0; j < curRoots[i]?.child?.length; j++) {
            const cCell = curRoots[i].child[j]
            if (cCell.group === 'Nodes') {
              const n = N[cCell.index].child
              for (let k = 0; k < n.length; k++) {
                if (n[k].group === 'edgePaths') {
                  M.push(P[n[k].index])
                }
              }
            } else if (cCell.group === 'edgePaths') {
              const p = P[cCell.index].child
              for (let k = 0; k < p.length; k++) {
                if (p[k].group === 'Nodes') {
                  M.push(N[p[k].index])
                }
              }
            }
          }
        }
      }
      AnimationOne(id, map, M)
    }
  }
  for (let i = 0; i < curRoots.length; i++) {
    if (curRoots[i].type === 'NodeObj') {
      const Root = curRoots[i] as NodeObj
      totalAnimations = Root.child.length
      finished = 0
      for (let j = 0; j < Root.child.length; j++) {
        const cIdx = Root.child[j].index
        const circle = Root.node.append('circle')
        const path = P[cIdx].path.node()
        circle
          .attr('cx', 0) // X-coordinate of the center
          .attr('cy', 0) // Y-coordinate of the center
          .attr('r', 5) // Radius of the circle
          .attr('style', 'fill:#ff0000 !important') // Fill color
          .attr('stroke', 'black') // Border color
        if (path !== null) {
          gsap.to(circle.node(), {
            duration: 1,
            ease: 'power1.inOut',
            overwrite: 'auto',
            immediateRender: false,
            motionPath: {
              path: path,
              align: path,
              autoRotate: false,
              alignOrigin: [0.5, 0.5],
            },
            onStart: () => {},
            onComplete: () => {
              circle.remove()
              allComplete()
            },
            onUpdate: () => {
              // console.log('animating...')
            },
          })
        }
      }
    } else if (curRoots[i].type === 'PathObj') {
      const Root = curRoots[i] as PathObj
      console.log('Path without parent ', Root)
    }
  }
}
/*
 * main program to return a svg
 */
const Mermaid = ({ chart, mDevice }) => {
  const mermaidRef = useRef<HTMLDivElement | null>(null)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [map, setMap] = useState(new Map())
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
            map.set('diagramId', diagramId)
            mermaidRef.current.innerHTML = svg
            bindFunctions?.(mermaidRef.current)
            if (mDevice === false) {
              d3HandleZoom(diagramId)
            }
            d3HandleAnchor(diagramId, mDevice)
            d3HandleEdgeLabel(diagramId, map)
            if (mDevice === false) {
              d3AppendResetSvg(diagramId, map)
            }
            showTitle(diagramId, mDevice, resolvedTheme)
            findRelations(diagramId, map)
            // gsapAnimate(diagramId, map)
            gsap.registerPlugin(MotionPathPlugin)
            console.log(diagramId, 'map ', map)
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
  }, [chart, msg, mDevice, resolvedTheme, map]) // Re-render if the chart code changes

  return <div ref={mermaidRef}></div>
}

export default Mermaid
