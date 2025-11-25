'use client'
import { useState, useRef, useEffect } from 'react'
import mermaid from 'mermaid'
import { useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import parse from 'parse-svg-path'
import * as d3 from 'd3'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from '@heroicons/react/24/solid'

const DropDownMenuString = `
  <div className="fixed top-24 w-52 text-right" id="DropDownMenu">
    <Menu __demoMode>
      <MenuButton className="focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-700 data-open:bg-gray-700 inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10">
        <ChevronDownIcon className="size-4 fill-white/60" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="data-closed:scale-95 data-closed:opacity-0 w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none"
      >
        <MenuItem>
          <button className="data-focus:bg-white/10 group flex w-full items-center gap-2 rounded-lg px-3 py-1.5">
            <PencilIcon className="size-4 fill-white/30" />
            Edit
            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘E</kbd>
          </button>
        </MenuItem>
        <MenuItem>
          <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
            <Square2StackIcon className="size-4 fill-white/30" />
            Duplicate
            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘D</kbd>
          </button>
        </MenuItem>
        <div className="my-1 h-px bg-white/5" />
        <MenuItem>
          <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
            <ArchiveBoxXMarkIcon className="size-4 fill-white/30" />
            Archive
            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘A</kbd>
          </button>
        </MenuItem>
        <MenuItem>
          <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
            <TrashIcon className="size-4 fill-white/30" />
            Delete
            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘D</kbd>
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  </div>
`

/*
 * transform return types
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
    /*
     * [ a, c, e ] [x]
     * [ b, d, f ] [y]
     * [ 0, 0, 1 ] [1]
     */
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
interface PositionObj {
  x: number
  y: number
  dx: number
  dy: number
}
interface CircleObj {
  cx: number
  cy: number
  r: number
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
                  g: g,
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
interface MenuTitle {
  title: string
  action: (a, b, c) => void
  actable: boolean
}
interface MenuDivider {
  divider: boolean
}
type TypeMenuItem = MenuTitle | MenuDivider
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
  curPos: PositionObj
}
interface NodeObj {
  node: d3.Selection<SVGGElement, unknown, HTMLElement | null, unknown>
  transform: TypeTransform[]
  id: string
  name: string
  child: CellObj[]
  parent: CellObj[]
  type: string
  curPos: PositionObj
  circle: CircleObj
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
              curPos: { x: -1, y: -1, dx: 0, dy: 0 },
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
          let n: d3.Selection<SVGGElement, unknown, HTMLElement | null, unknown> = d3.select<
            SVGGElement,
            unknown
          >(this as SVGGElement)
          let transform = parseSvgTransform(d3.select(this).attr('transform'))
          if (transform.length == 0) {
            const parentE = n?.node()?.parentNode as SVGGElement
            transform = parseSvgTransform(d3.select(parentE)?.attr('transform'))
            // console.log('tran', transform)
            n = d3.select(parentE)
          }
          //const C = d3.select(this).select('circle')
          //const r = C?.attr('r')
          //const cx = C?.attr('cx')
          //const cy = C?.attr('cy')
          const O: NodeObj = {
            node: n,
            transform: transform,
            id: id,
            name: s[1],
            child: [],
            parent: [],
            type: 'NodeObj',
            curPos: { x: -1, y: -1, dx: 0, dy: 0 },
            circle: { cx: 0, cy: 0, r: 0 },
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
  // console.log('paths', paths)
  // console.log('labels', labels)
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
  function angleBetweenVectors(v1, v2): [number, number] {
    // Calculate the dot product
    const dotProduct = v1.x * v2.x + v1.y * v2.y

    // Calculate the magnitudes
    const magnitudeV1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y)
    const magnitudeV2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y)
    const scale = magnitudeV1 / magnitudeV1
    // Calculate the cosine of the angle
    const cosTheta = dotProduct / (magnitudeV1 * magnitudeV2)

    // Handle potential floating-point inaccuracies
    // Ensure cosTheta is within the valid range for acos [-1, 1]
    const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta))

    // Calculate the angle in radians
    const angleRad = Math.acos(clampedCosTheta)

    return [angleRad, scale] // Returns the angle in radians
  }

  const N = d3.select('g#flowchart-蔣以懋-0')
  const P = d3.select('g.edgePaths').select('path#L_蔣以懋_G4_0')
  const NM: TypeTranslateScale[] = parseSvgTransform(N.attr('transform')) as TypeTranslateScale[]
  const PM = parse(P.attr('d'))
  const lx = PM[4][1]
  const ly = PM[4][2]
  let cx = NM[0].x
  let cy = NM[0].y
  let curV = { x: cx - lx, y: cy - ly }
  gsap.to(N.node(), {
    y: '-=50',
    duration: 3, // Animation duration in seconds
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut', // Easing function
    onUpdate: function () {
      /*
       *
       *       o
       *       | \
       *       |  \
       *     dy|   \
       *       |    \
       *       |     \
       *  <----x------X (lx,ly) it may change later for moving all elements
       *    dx
       */
      const M: TypeMatrix[] = parseSvgTransform(N.attr('transform')) as TypeMatrix[]
      const newV = { x: M[0].e - lx, y: M[0].f - ly }
      const [angle, scale] = angleBetweenVectors(curV, newV)
      curV = newV
      let dx = M[0].e - cx
      let dy = M[0].f - cy
      if (Math.abs(dy) > 1.0) console.log('dy', dy)
      if (dx >= 1.0 || dy >= 1.0) {
        dx = 0.0
        dy = 0.0
      }
      cx = M[0].e
      cy = M[0].f
      const MM = parse(P.attr('d'))
      const beta = 7
      MM[0][1] = cx // M
      MM[0][2] += dy / beta
      MM[1][2] += ((dy / beta) * Math.abs(MM[1][1] - lx)) / Math.abs(MM[0][1] - lx)
      MM[2][2] += ((dy / beta) * Math.abs(MM[2][1] - lx)) / Math.abs(MM[0][1] - lx)
      MM[2][4] += ((dy / beta) * Math.abs(MM[2][3] - lx)) / Math.abs(MM[0][1] - lx)
      MM[2][6] += ((dy / beta) * Math.abs(MM[2][5] - lx)) / Math.abs(MM[0][1] - lx)
      MM[3][2] += ((dy / beta) * Math.abs(MM[3][1] - lx)) / Math.abs(MM[0][1] - lx)
      MM[3][4] += ((dy / beta) * Math.abs(MM[3][3] - lx)) / Math.abs(MM[0][1] - lx)
      MM[3][6] += ((dy / beta) * Math.abs(MM[3][5] - lx)) / Math.abs(MM[0][1] - lx)

      let newString = ''
      for (let i = 0; i < MM.length; i++) {
        for (let j = 0; j < MM[i].length; j++) {
          if (j === 0 || j === 1) {
            newString += MM[i][j]
          } else {
            newString = newString + ' ' + MM[i][j]
          }
        }
      }
      P.attr('d', newString)
    },
  })
}
/*
 * Animation One
 *
 */
function findRoot(svg, map): Array<PathObj | NodeObj> {
  // const [w, h, svg] = getSVG(id)
  const M: Array<PathObj | NodeObj> = []
  if (svg === null) {
    console.log('findRoot svg is null !!!')
    return M
  }
  // if (id !== map.get('diagramId')) {
  //  return M
  //}
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
interface TweenProp {
  tween: gsap.core.Tween
  index: number
}
interface MenuProp {
  on: boolean
  selected: string
}
/*
 * main program to return a svg
 */
const Mermaid = ({ chart, mDevice }) => {
  const mermaidRef = useRef<HTMLDivElement | null>(null)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [map, setMap] = useState(new Map())
  const [tweens, setTweens] = useState<TweenProp[]>([])
  const [menuState, setMenuState] = useState<MenuProp>({ on: false, selected: '' })
  const [resetGraph, setResetGraph] = useState(0)
  const searchParams = useSearchParams()
  const msg = searchParams.get('msg')
  useEffect(() => {
    /*
     * Animate #1
     */
    const AnimationOne = (svg, map, curRoots: Array<PathObj | NodeObj> | null) => {
      console.log('AnimationOne IN')
      if (svg === null) return
      const N: NodeObj[] = map.get('Nodes')
      const P: PathObj[] = map.get('edgePaths')
      const L: EdgeLabelObj[] = map.get('edgelabels')
      if (N.length == 0) return
      if (P.length == 0) return
      if (curRoots === null) {
        curRoots = findRoot(svg, map)
      }
      console.log('curRoots.length', curRoots.length)
      if (curRoots.length === 0) return
      let totalAnimations = 0
      let finished = 0
      interface OperationProp {
        Nindex: number
        Pindex: number
      }
      const Operations: OperationProp[] = []
      function allComplete() {
        finished++
        // if (finished === totalAnimations) {
        if (Operations.length == 0) {
          console.log('All animations are complete!')
          tweens.length = 0
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
          AnimationOne(svg, map, M)
        }
      }
      for (let i = 0; i < curRoots.length; i++) {
        if (curRoots[i].type === 'NodeObj') {
          const Root = curRoots[i] as NodeObj
          totalAnimations = Root.child.length
          finished = 0
          // console.log('Root.child.length', Root.child.length)
          // if (Root.child.length === 0) console.log(Root)
          for (let j = 0; j < Root.child.length; j++) {
            const cIdx = Root.child[j].index
            const circle = Root.node.append('circle')
            const path = P[cIdx].path.node()
            // console.log('path', path)
            circle
              .attr('cx', 0) // X-coordinate of the center
              .attr('cy', 0) // Y-coordinate of the center
              .attr('r', 5) // Radius of the circle
              .attr('style', 'fill:#ff0000 !important') // Fill color
              .attr('stroke', 'black') // Border color
            if (path !== null) {
              Operations.push({ Nindex: i, Pindex: j })
              const myTween = gsap.to(circle.node(), {
                duration: 3,
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
                  // console.log('AnimationOne onComplete!', i, j)
                  circle.remove()
                  for (let k = 0; k < Operations.length; k++) {
                    const O = Operations[k]
                    if (O.Nindex === i && O.Pindex === j) {
                      Operations.splice(k, 1)
                      break
                    }
                  }
                  allComplete()
                },
                onUpdate: () => {
                  // console.log('animating...')
                },
              })
              const T: TweenProp = { tween: myTween, index: j }
              tweens.push(T)
            } else {
              console.log('path is null')
            }
          }
        } else if (curRoots[i].type === 'PathObj') {
          const Root = curRoots[i] as PathObj
          console.log('Path without parent ', Root)
        } else {
          console.log('What is this', curRoots[i])
        }
      }
      if (Operations.length === 0) {
        console.log('No more nodes to pass path')
        AnimationOne(svg, map, null)
      }
    }
    /*
     * Animate # 2
     */
    const AnimationTwo = (svg, map, curRoots: Array<PathObj | NodeObj> | null) => {
      if (svg === null) return
      const N: NodeObj[] = map.get('Nodes')
      const P: PathObj[] = map.get('edgePaths')
      const L: EdgeLabelObj[] = map.get('edgeLabels')
      if (N.length == 0) return
      if (P.length == 0) return
      for (let i = 0; i < N.length; i++) {
        let dir: string = Math.random() > 0.5 ? '-=50' : '+=50'
        const M: TypeTranslateScale[] = parseSvgTransform(
          N[i].node.attr('transform')
        ) as TypeTranslateScale[]
        N[i].curPos = { x: -1, y: -1, dx: 0, dy: 0 }
        if (M.length > 0) {
          N[i].curPos.x = M[0].x
          N[i].curPos.y = M[0].y
        }
        const myTween = gsap.to(N[i].node.node(), {
          y: () => dir,
          duration: 2, // Animation duration in seconds
          yoyo: true,
          repeat: -1,
          repeatRefresh: true,
          ease: 'sine.inOut',
          onRepeat: () => {
            dir = Math.random() > 0.5 ? '-=50' : '+=50'
          },
          onStart: () => {},
          onUpdate: () => {
            const NM: TypeMatrix[] = parseSvgTransform(N[i].node.attr('transform')) as TypeMatrix[]
            if (N[i].curPos.x === -1 && N[i].curPos.y === -1) {
              N[i].curPos.x = NM[0].e
              N[i].curPos.y = NM[0].f
            }
            const dx = NM[0].e - N[i].curPos.x
            const dy = NM[0].f - N[i].curPos.y
            N[i].curPos.x = NM[0].e
            N[i].curPos.y = NM[0].f
            N[i].curPos.dx = dx
            N[i].curPos.dy = dy
            for (let j = 0; j < N[i].child.length; j++) {
              try {
                const cidx = N[i].child[j].index
                const PM = parse(P[cidx].path.attr('d'))
                const beta = 1
                PM[0][1] = NM[0].e // M
                PM[0][2] += dy / beta
                const PChild: CellObj[] = P[cidx].child
                if (PChild.length > 0) {
                  // console.log('PChild', PChild)
                  for (let k = 0; k < PChild.length; k++) {
                    if (PChild[k].group === 'Nodes') {
                      const nidx = PChild[k].index
                      const NChild = N[nidx]
                      if (NChild.curPos.x === -1 && NChild.curPos.y === -1) {
                        const NChildM: TypeMatrix[] = parseSvgTransform(
                          NChild.node.attr('transform')
                        ) as TypeMatrix[]
                        if (NChildM.length > 0) {
                          NChild.curPos.x = NChildM[0].e
                          NChild.curPos.y = NChildM[0].f
                        }
                      }
                      PM[4][1] += NChild.curPos.dx
                      PM[4][2] += NChild.curPos.dy
                      interface Pos {
                        x: number
                        y: number
                      }
                      const x0 = PM[0][1]
                      const y0 = PM[0][2]
                      const x1 = PM[4][1]
                      const y1 = PM[4][2]
                      const lineData = [
                        { x: x0, y: y0 },
                        { x: (x0 + x1) / 2, y: y0 },
                        { x: x1, y: y1 },
                      ]
                      const LineFunction = d3
                        .line<Pos>()
                        .x((d: Pos) => d.x)
                        .y((d: Pos) => d.y)
                        .curve(d3.curveBasis)

                      const out = LineFunction(lineData)
                      P[cidx].path.attr('d', out)
                      /* handle edgeLabel */
                      if (PChild.length >= 2 && PChild[k + 1].group === 'edgeLabels') {
                        const label = L[PChild[k + 1].index]
                        const LM: TypeTranslateScale[] = parseSvgTransform(
                          label.g.attr('transform')
                        ) as TypeTranslateScale[]
                        LM[0].x = (x0 + x1) / 2
                        LM[0].y = (y0 + y1) / 2
                        label.g.attr('transform', 'translate(' + LM[0].x + ',' + LM[0].y + ')')
                        /*
                        const path = P[cidx].path.node()
                        if (path !== null) {
                          gsap.to(label.g.node(), {
                            duration: 1, // Set duration as needed
                            motionPath: {
                              path: path,
                              align: path,
                              alignOrigin: [0.5, 0.5],
                              autoRotate: false,
                              end: 0.5,
                            },
                          })
                        }*/
                      }
                      break
                    }
                  }
                }
              } catch (error) {
                console.log(error)
              }
            }
            /** check if nodes are intersecting 
            const lC = N[i].node.select('circle')
            const lCm: TypeMatrix[] = parseSvgTransform(N[i].node.attr('transform')) as TypeMatrix[]
            const lr = lC?.attr('r')
            const lcx = lC?.attr('cx')
            const lcy = lC?.attr('cy')
            const lgx = Number(lcx) + Number(lCm[0].e)
            const lgy = Number(lcy) + Number(lCm[0].f)
            for (let m = 0; m < N.length; m++) {
              if (i !== m) {
                const mC = N[m].node.select('circle')
                const mCm: TypeMatrix[] = parseSvgTransform(N[m].node.attr('transform')) as TypeMatrix[]
                const mr = mC?.attr('r')
                const mcx = mC?.attr('cx')
                const mcy = mC?.attr('cy')
                const mgx = Number(mcx) + Number(mCm[0].e)
                const mgy = Number(mcy) + Number(mCm[0].f)
                const D = Math.hypot(mgx - lgx, mgy - lgy)
                if (D < Number(lr) + Number(mr)) {
                  if (dir === '+=50') {
                    dir = '-=50'
                  } else {
                    dir = '+=50'
                  }
                  break
                }
              }
            }*/
          },
        })
        tweens.push({ tween: myTween, index: i })
      }
    }
    const menuItems: TypeMenuItem[] = [
      {
        title: 'AnimateOne',
        action: function (svg, map, root) {
          menuState.selected = 'AnimateOne'
          AnimationOne(svg, map, null)
        },
        actable: true,
      },
      {
        title: 'AnimateTwo',
        action: function (svg, map, root) {
          menuState.selected = 'AnimateTwo'
          AnimationTwo(svg, map, null)
        },
        actable: true,
      },
      {
        divider: true,
      }, // Optional divider
      {
        title: 'Stop Animate',
        action: function (a, b, c) {
          for (let i = 0; i < tweens.length; i++) {
            tweens[i].tween.kill()
          }
          tweens.length = 0
          menuState.selected = ''
          setResetGraph((prevResetGraph) => prevResetGraph + 1) // just re-render
        },
        actable: false,
      },
      {
        divider: true,
      }, // Optional divider
      {
        title: 'Reset Graph',
        action: function (w, h, svg) {
          setResetGraph((prevResetGraph) => prevResetGraph + 1) // just re-render
        },
        actable: false,
      },
    ]

    /*
     * add a main menu
     */
    const d3AddMenu = (id, map) => {
      const [w, h, svg] = getSVG(id)
      if (svg === null) {
        console.log('d3AddMenu svg is null')
        return
      }
      console.log('d3AddMenu IN', w, h, svg)
      /*
       *
       */
      const createContextMenu = (data, x, y) => {
        console.log('createContextMenu', data, x, y)
        d3.select('.context-menu').remove()
        const clsMenu: string =
          'absolute bg-stone-900 text-base text-stone-300 dark:text-lime-300 border-2 shadow-[2px_2px_5px_rgba(0,0,0,0.2)] z-[1000] px-0 py-[5px] border-solid border-[#ccc]'
        const clsLiEnable: string =
          'cursor-pointer px-2.5 py-[5px] hover:bg-[#f0f0f0] dark:hover:bg-blue-700 m-0 p-0'
        const clsLiDisable: string = 'cursor-not-allowed px-2.5 py-[5px] bg-stone-500 m-0 p-0'
        const clsDivider: string =
          'px-2.5 py-[5px] mx-0 my-[5px] p-0 border-t-[#eee] border-t border-solid'
        const menu = d3
          .select('body')
          .append('div')
          .attr('class', clsMenu)
          .style('left', x + 20 + 'px')
          .style('top', y - 10 + 'px')
          .style('position', 'absolute')
          .style('display', 'block') // Show the menu
        menu
          .append('ul')
          .selectAll('li')
          .data(menuItems)
          .enter()
          .append('li')
          .attr('class', (f: TypeMenuItem): string => {
            const d: MenuDivider = f as MenuDivider
            if (d.divider) {
              return clsDivider
            } else {
              const l: MenuTitle = f as MenuTitle
              if (menuState.selected !== '') {
                switch (l.title) {
                  case 'AnimateOne':
                    return clsLiDisable
                  case 'AnimateTwo':
                    return clsLiDisable
                  default:
                    return clsLiEnable
                }
              }
              return clsLiEnable
            }
          })
          .text((d: MenuTitle) => d.title)
          .on('click', function (event, d: MenuTitle) {
            event.preventDefault()
            if (d.action) {
              switch (d.title) {
                case 'AnimateOne':
                  if (menuState.selected === '') d.action(svg, map, null)
                  break
                case 'AnimateTwo':
                  if (menuState.selected === '') d.action(svg, map, null)
                  break
                case 'Stop Animate':
                  d.action(null, null, null)
                  break
                case 'Reset Graph':
                  d.action(w, h, svg)
                  break
              }
            }
            menu.remove() // Hide the menu after clicking an option
            menuState.on = false
          })
        // Hide the menu when clicking outside of it
        d3.select('body').on('click.context-menu', function (event) {
          if (!menu?.node()?.contains(event.target)) {
            menu.remove()
            d3.select('body').on('click.context-menu', null) // Remove the event listener
            menuState.on = false
          }
        })
        menuState.on = true
      }

      if (svg !== null) {
        const resetSVG = svg
          .append('svg')
          .attr('id', 'mainMenuIcon')
          .attr('viewBox', '0 0 24 24') // Set width of the inner SVG
          .attr('width', 36) // Set height of the inner SVG
          .attr('height', 36) // Set height of the inner SVG
          .attr('x', 10) // Position the inner SVG within the parent SVG
          .attr('y', 10)
          .attr('fill', 'none')
          .attr('stroke-width', '1.5')
          .attr('stroke', 'currentColor')
          .attr('class', 'cursor-context-menu size-6')
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
          /*
          .on('mouseover', function (e, d) {
            if (menuState.on) return
            d3.select(this).style('cursor', 'pointer')
            tooltip.html('Right Click').style('opacity', 1)
          })
          .on('mousemove', function (e, d) {
            if (menuState.on) return
            tooltip.style('left', e.pageX + 10 + 'px').style('top', e.pageY - 10 + 'px')
          })
          .on('mouseout', function () {
            tooltip.style('opacity', 0)
          })
          */
          .on('contextmenu', function (e, d) {
            tooltip.style('opacity', 0)
            e.preventDefault() // Prevent the browser's default context menu
            createContextMenu(d, e.pageX, e.pageY)
          })
      }
    }
    /*
     * generate svg chart
     */
    if (mermaidRef.current) {
      const renderChart = async () => {
        //mermaid.initialize({
        //  logLevel: 'trace', // or 'debug', 'info', 'warn', 'fatal', or their corresponding numeric values (1-5)
        //})
        // Generate a unique ID for the diagram
        const diagramId = `mermaid-diagram-${Math.random().toString(36).substring(7)}`
        console.log('rerendering', diagramId)
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
            // if (mDevice === false) {
            d3AddMenu(diagramId, map)
            // }
            showTitle(diagramId, mDevice, resolvedTheme)
            findRelations(diagramId, map)
            gsap.registerPlugin(MotionPathPlugin)
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
  }, [chart, msg, mDevice, resolvedTheme, menuState, map, tweens, resetGraph]) // Re-render if the chart code changes

  return <div ref={mermaidRef}></div>
}

export default Mermaid
