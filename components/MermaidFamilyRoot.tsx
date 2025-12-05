'use client'
import { Sky, Bvh, OrbitControls, DragControls, OrthographicCamera } from '@react-three/drei'
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/solid'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { createRoot, Root } from 'react-dom/client'
import { SVGLoader } from '@/components/SVGLoader'
import { useSearchParams } from 'next/navigation'
import ReactDOMServer from 'react-dom/server'
import parseSvgPath from 'parse-svg-path'
import { useTheme } from 'next-themes'
import {
  EffectComposer,
  Selection,
  Outline,
  N8AO,
  TiltShift2,
  ToneMapping,
} from '@react-three/postprocessing'
import parse from 'parse-svg-path'
import { debounce } from 'lodash'
import * as THREE from 'three'
import { easing } from 'maath'
import mermaid from 'mermaid'
import * as d3 from 'd3'
/**
 *
 */
interface UserData {
  node
  style
}
interface ShapePathX {
  shape: THREE.ShapePath
  userData: UserData
}
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
/**
 *
 */
const fixedScreenPos = {
  pOut: new THREE.Vector3(-500, 400, 0),
  pIn: new THREE.Vector3(-500, 400, 0),
  camera: new THREE.Vector3(0, 0, 120),
}
/*
 *
 */
const getPathPointsV2 = (path) => {
  const points: THREE.Vector2[] = []
  if (path) {
    const pathLength = path.getTotalLength()
    const numSegments = 100 // Number of points to sample along the path
    for (let i = 0; i <= numSegments; i++) {
      const length = (i / numSegments) * pathLength
      const point = path.getPointAtLength(length)
      points.push(new THREE.Vector2(point.x, point.y))
    }
  }
  return points
}

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
/**
 *
 */
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
/**
 *
 */
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
  label: string
  color: string
}
/**
 *
 */
function findRelations(svgId, map) {
  const [w, h, svg] = getSVG(svgId)
  if (svg === null) return
  const Ppaths: PathObj[] = []
  const Nnodes: NodeObj[] = []
  const group = svg.selectAll('g')
  const svgLoader = new SVGLoader(THREE.DefaultLoadingManager)
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
            n = d3.select(parentE)
          }
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
            label: '',
            color: '',
          }
          const span = d3.select(this).select('span').attr('class')
          if (span !== null && span === 'nodeLabel') {
            const p = d3.select(this).select('span').select('p')
            if (!p.empty()) {
              O.label = p.html()
              // console.log('nodeLable', O.label)
            }
          }
          const circle = d3.select(this).select('circle').attr('style')
          let color = ''
          if (circle !== null) {
            const styles = circle.split(' ')
            // console.log('circle style', O.name, styles)
            if (styles.length > 0) {
              const fills = styles[0].split(':')
              if (fills.length == 2) color = fills[1]
              else color = '#cde498'
            } else {
              color = '#cde498'
            }
          } else {
            color = '#cde498'
          }
          O.color = color
          // console.log(O.name, color)
          Nnodes.push(O)
          //if (n !== null) {
          //  const D = svgLoader.parse(n.html())
          //  const paths: ShapePathX[] = D.paths as ShapePathX[]
          //  console.log('Node: pathShape', paths)
          //}
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
 * main program to return a svg
 */
interface MeshRootProp {
  inited: boolean
  root: Root | null
  pOut: THREE.Mesh | null
  pIn: THREE.Mesh | null
}
/**
 *
 */
function Effects() {
  const { size } = useThree()
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.pointer.x, 1 + state.pointer.y / 2, 8 + Math.atan(state.pointer.x * 2)],
      0.3,
      delta
    )
    state.camera.lookAt(state.camera.position.x * 0.9, 0, -4)
  })
  return (
    <EffectComposer stencilBuffer enableNormalPass autoClear={false} multisampling={4}>
      <N8AO halfRes aoSamples={5} aoRadius={0.4} distanceFalloff={0.75} intensity={1} />
      <Outline
        visibleEdgeColor={'white' as unknown as number}
        hiddenEdgeColor={'white' as unknown as number}
        blur
        width={size.width * 1.25}
        edgeStrength={10}
      />
      <TiltShift2 samples={5} blur={0.1} />
      <ToneMapping />
    </EffectComposer>
  )
}
/**
 *
 */
interface CanProps {
  grp: THREE.Group
  pOut: THREE.Mesh | null
  pIn: THREE.Mesh | null
}
/**
 *
 */
interface SceneProps {
  rotation: number[]
  position: number[]
  grp: THREE.Group<THREE.Object3DEventMap>
  pOut: THREE.Mesh | null
  pIn: THREE.Mesh | null
}
interface ButtonProps {
  expand: boolean
}
function Scene({ rotation, position, grp, pOut, pIn }: SceneProps) {
  const [hovered, hover] = useState(null)
  const [buttonToggle, setButtonToggle] = useState<ButtonProps>({ expand: true })
  const debouncedHover = useCallback(debounce(hover, 30), [])
  const over = (name) => (e) => (e.stopPropagation(), debouncedHover(name))
  const mesh: THREE.Mesh[] = grp.children as THREE.Mesh[]
  // for (let i = 0; i < mesh.length; i++) console.log('Scene', mesh[i].name)

  const handlePointerOver = (e) => {
    const mesh = e.object
    //console.log('PointerOver', mesh)
  }
  const handlePointerOut = (e) => {
    const mesh = e.object
    // console.log('PointerOut', mesh.name)
  }
  const pOutRef = useRef<THREE.Mesh>(pOut)
  const pInRef = useRef<THREE.Mesh>(pIn)
  const groupRef = useRef()
  useEffect(() => {
    globalThis.updatePoutRef = (camera) => {
      if (pOutRef.current) {
        const pos = new THREE.Vector3()
        camera.getWorldPosition(pos)
        console.log('updatePoutRef', pos)
      }
    }
  }, [])
  return (
    <>
      <group ref={groupRef} {...rotation}>
        {mesh.map((m) => (
          <mesh
            key={m.uuid}
            geometry={m.geometry}
            material={m.material}
            name={m.name}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          />
        ))}
        <mesh
          ref={pOutRef}
          key={pOut?.uuid}
          geometry={pOut?.geometry}
          material={pOut?.material}
          name={pOut?.name}
          visible={pOut?.visible}
          position={pOut?.position}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
        <mesh
          ref={pInRef}
          key={pIn?.uuid}
          geometry={pIn?.geometry}
          material={pIn?.material}
          name={pIn?.name}
          visible={pIn?.visible}
          position={pIn?.position}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      </group>
    </>
  )
}

/**
 *
 */
function CanvasContent({ grp, pOut, pIn }: CanProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const cameraRef = useRef<HTMLCanvasElement | null>(null)
  /**
   *
   */
  function CameraControl() {
    const { camera, invalidate } = useThree()
    useEffect(() => {
      if (canvasRef.current) {
        const handleWheel = (event) => {
          console.log('CameraControl:', event.deltaY)
          event.preventDefault()
          const cameraPos = camera.position
          const zoom = event.deltaY < 0 ? 'in' : 'out'
          console.log('CameraControl zoom', zoom)
          if (zoom == 'out') {
            camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z + 1)
          } else {
            camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z - 1)
          }
          globalThis.updatePoutRef(camera)
        }
        canvasRef.current.addEventListener('wheel', handleWheel)
      }
    }, [])
    return null
  }
  /**
   *
   */
  function OrbitControlsWrapper() {
    const { camera, invalidate } = useThree()
    return (
      <OrbitControls
        enableDamping // Smooths out camera movements
        dampingFactor={0.05} // Control damping intensity
        maxPolarAngle={Math.PI / 2} // Limit vertical rotation
        enableZoom={true}
        enablePan={true}
        onChange={(e) => {
          const cameraDirection = new THREE.Vector3()
          camera.getWorldDirection(cameraDirection)
          const dx = fixedScreenPos.pOut.x - fixedScreenPos.camera.x
          const dy = fixedScreenPos.pOut.y - fixedScreenPos.camera.y
          const dz = fixedScreenPos.pOut.z - fixedScreenPos.camera.z
          const D = Math.sqrt(dx * dx + dy * dy + dz * dz)
          // console.log('onChange pos, dir, distance', camera.position, cameraDirection, D)
          // console.log('onChange camera pOut', camera.position, pOut?.position)
          // pOut?.position.copy(camera.position).addScaledVector(cameraDirection, D)
          const N = new THREE.Vector3()
          N.copy(camera.position).addScaledVector(cameraDirection, D)
          console.log('onChange', camera.position, N)
          globalThis.updatePoutRef(N, camera)
        }}
        onEnd={(e) => {
          // console.log('onEnd pOut', pOut?.position)
          // invalidate()
        }}
      />
    )
  }
  /**
   *
   */
  return (
    <div className="h-857 border-2 border-blue-300">
      <Canvas
        ref={canvasRef}
        flat
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
        camera={{
          position: [fixedScreenPos.camera.x, fixedScreenPos.camera.y, fixedScreenPos.camera.z],
          fov: 150,
          near: 1,
          far: 200,
        }}
        style={{ width: '100%', height: '856px' }}
      >
        <ambientLight intensity={1.5 * Math.PI} />
        <Sky />
        <DragControls>
          <Scene rotation={[0, 0, 0]} position={[100, 0, -0.85]} grp={grp} pOut={pOut} pIn={pIn} />
        </DragControls>
        <CameraControl />
      </Canvas>
    </div>
  )
}
interface UserData {
  node
  style
}
interface ShapePathX {
  shape: THREE.ShapePath
  userData: UserData
}
/**
 *
 */
function openFullScreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.webkitRequestFullscreen) {
    /* Safari */
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) {
    /* IE11 */
    element.msRequestFullscreen()
  }
}
/**
 *
 */
function hasNaNValuesInShape(shape: THREE.Shape): boolean {
  let hasNaN = false
  // Check main curves
  shape.curves.forEach((curve) => {
    const points = curve.getPoints()
    for (const point of points) {
      if (Number.isNaN(point.x) || Number.isNaN(point.y)) {
        console.warn('NaN found in a curve point:', point)
        hasNaN = true
        return // Exit forEach early if NaN is found
      }
    }
  })
  if (hasNaN) return true
  // Check holes (which are also arrays of curves)
  shape.holes.forEach((hole) => {
    const points = hole.getPoints()
    for (const point of points) {
      if (Number.isNaN(point.x) || Number.isNaN(point.y)) {
        console.warn('NaN found in a hole point:', point)
        hasNaN = true
        return // Exit forEach early if NaN is found
      }
    }
  })
  return hasNaN
}
/**
 * Draws text along an arc path in a canvas context.
 * @param {CanvasRenderingContext2D} context The canvas rendering context.
 * @param {string} str The text to draw.
 * @param {number} centerX The x-coordinate of the circle's center.
 * @param {number} centerY The y-coordinate of the circle's center.
 * @param {number} radius The radius of the circle.
 * @param {number} angle The total angle in radians that the text should span (e.g., Math.PI for a semi-circle).
 */
function drawTextAlongArc(context, str, centerX, centerY, radius, angle) {
  const len = str.length
  context.save()
  context.translate(centerX, centerY)
  // Initial rotation to center the text along the angle provided
  context.rotate((-1 * angle) / 2)
  // Optional: adjust starting position slightly
  context.rotate((-1 * (angle / len)) / 2)

  for (let n = 0; n < len; n++) {
    // Rotate for each character
    context.rotate(angle / len)
    context.save()
    // Move to the position on the circumference
    context.translate(0, -1 * radius)
    const C = str[n]
    // Draw the character
    context.fillText(C, 0, 0)
    context.restore()
  }
  context.restore()
}
/**
 *
 */
function resizeText(ctx, text, maxWidth, startFontSize, fontFamily) {
  let fontSize = startFontSize
  ctx.font = `${fontSize}px ${fontFamily}`
  let textWidth = ctx.measureText(text).width

  while (textWidth > maxWidth && fontSize > 1) {
    fontSize -= 1
    ctx.font = `${fontSize}px ${fontFamily}`
    textWidth = ctx.measureText(text).width
  }
  return {
    fontSize: fontSize,
    width: textWidth,
  }
}
/**
 *
 */
function measureTextHeight(ctx, text) {
  const metrics = ctx.measureText(text)
  const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
  return height
}
/**
 *
 */
function createTextCanvas(text, radius, color) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (context !== null) {
    canvas.width = radius * 2 // 1.414
    canvas.height = radius * 2 // 1.414
    canvas.style.display = 'block'
    const T = text.split('<br>')
    const desiredCanvasWidth = canvas.width
    const initialFont = 50
    const fontStyle = 'Arial'
    const w = desiredCanvasWidth
    const h = desiredCanvasWidth
    context.beginPath()
    context.arc(radius, radius, radius, 0, 2 * Math.PI, false) // Define the circle
    context.fillStyle = color
    context.fill()
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    let finalFontSize = initialFont
    for (let i = 0; i < T.length; i++) {
      const txt = T[i]
      const F = resizeText(context, txt, desiredCanvasWidth * 0.8, initialFont, fontStyle)
      if (F.fontSize < finalFontSize) finalFontSize = F.fontSize
    }
    context.font = `${finalFontSize}px ${fontStyle}`
    context.fillStyle = 'black'
    const textHeight = measureTextHeight(context, T[0])
    const totalHeight = (textHeight + 1) * T.length
    const startY = (h - totalHeight) / 2 + textHeight / 2
    for (let i = 0; i < T.length; i++) {
      const txt = T[i]
      context.fillText(txt, w / 2, startY + (textHeight + 1) * i)
    }
  }
  return canvas
}
/**
 *
 */
function createTextLabel(text, position, radius, color) {
  const canvas = createTextCanvas(text, radius, color)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  // console.log('createTextlabel color', color)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: color,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
  })
  const beta = 1
  const planeWidth = canvas.width / beta // Scale factor
  const planeHeight = canvas.height / beta
  const geometry = new THREE.CircleGeometry(radius + 2, 32, 0, Math.PI * 2)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.geometry.computeBoundingBox()
  if (mesh.geometry.boundingBox) {
    mesh.geometry.translate(position.x, position.y + 0.01, position.z)
    mesh.geometry.computeBoundingBox()
    mesh.geometry.computeBoundingSphere()
  }
  return mesh
}
/**
 * Decal function
 */
function addDecal(mesh, point, texture) {
  const position = point.clone()
  const orientation = new THREE.Euler()
  orientation.setFromQuaternion(
    new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 1, 0)
    )
  )
  const size = new THREE.Vector3(60, 60, 60) // Decal dimensions
  const decalGeometry = new DecalGeometry(
    mesh, // The target mesh for the decal projection
    position,
    orientation,
    size
  )
  const decalMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xff0000,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4,
  })
  const decalMesh = new THREE.Mesh(decalGeometry, decalMaterial)
  return decalMesh
}

/**
 *  main line of codes
 */

const Mermaid = ({ chart, mDevice }) => {
  const mermaidRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState(new Map())
  const [meshRoot, setMeshRoot] = useState<MeshRootProp>({
    inited: false,
    root: null,
    pOut: null,
    pIn: null,
  })
  const loader = new SVGLoader(THREE.DefaultLoadingManager)
  const group = new THREE.Group()
  /**
   * add a button to toggle fullScreen
   */
  function createButton(): [THREE.Mesh | null, THREE.Mesh | null] {
    const iconOut = ReactDOMServer.renderToString(
      <ArrowsPointingOutIcon className="h-6 w-6 text-blue-500" />
    )
    const iconIn = ReactDOMServer.renderToString(
      <ArrowsPointingInIcon className="h-6 w-6 text-blue-500" />
    )
    const makeMesh = (iconString) => {
      const S = loader.parse(iconString)
      const paths: ShapePathX[] = S.paths as ShapePathX[]
      const O: THREE.ShapeGeometry[] = [] as THREE.ShapeGeometry[]
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i].shape
        const material = new THREE.MeshBasicMaterial({
          color: 'red', // 'white', //path.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 1,
        })
        material.needsUpdate = true
        const shapes: THREE.Shape[] = SVGLoader.createShapes(path)
        for (let j = 0; j < shapes.length; j++) {
          console.log('createButton makeMesh', shapes)
          const shape = shapes[j]
          if (hasNaNValuesInShape(shape)) {
            console.log('makeMesh:hasNanValuesInShape')
            continue
          }
          const geometry = new THREE.ShapeGeometry(shape)
          // const mesh = new THREE.Mesh(geometry, material)
          // mesh.position.set(-500, 400, 0)
          O.push(geometry)
        }
        const mergedG = mergeGeometries(O)
        const mesh = new THREE.Mesh(mergedG, material)
        return mesh
      }
    }
    const pOut = makeMesh(iconOut)
    const pIn = makeMesh(iconIn)
    if (pOut && pIn) {
      pOut.name = 'ArrowsOut'
      pIn.name = 'ArrowsIn'
      pOut.visible = true
      pIn.visible = false
      pOut.position.copy(fixedScreenPos.pOut)
      pIn.position.copy(fixedScreenPos.pIn)
      pOut.scale.set(2, 2, 2)
      pIn.scale.set(2, 2, 2)
      return [pOut, pIn]
    } else {
      return [null, null]
    }
  }
  /**
   * handle Nodes
   */
  const handleNodes = (xnodes) => {
    for (let k = 0; k < xnodes.length; k++) {
      const X = xnodes[k]?.node?.node()
      if (X !== null) {
        const aString = '<a xlink:href'
        const nString = '<a href'
        let htmlString = X.outerHTML
        if (X.outerHTML.startsWith(aString)) {
          htmlString = X.outerHTML.replace(aString, nString)
        }
        const D = loader.parse(htmlString)
        const paths: ShapePathX[] = D.paths as ShapePathX[]
        for (let i = 0; i < paths.length; i++) {
          const path = paths[i].shape
          const material = new THREE.MeshBasicMaterial({
            color: xnodes[k].color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1,
          })
          material.needsUpdate = true
          const shapes: THREE.Shape[] = SVGLoader.createShapes(path)
          for (let j = 0; j < shapes.length; j++) {
            const shape = shapes[j]
            if (hasNaNValuesInShape(shape)) {
              console.log('xnodes:hasNanValuesInShape')
              continue
            }
            const geometry = new THREE.ShapeGeometry(shape)
            const mesh = new THREE.Mesh(geometry, material)
            mesh.name = xnodes[k].name
            mesh.geometry.computeBoundingBox()
            if (mesh.geometry.boundingBox) {
              const C = new THREE.Vector3()
              mesh.geometry.boundingBox.getCenter(C)
              console.log('boundingBox Center', mesh.name, C)
              const scaleMatrix = new THREE.Matrix4()
              scaleMatrix.makeScale(1, -1, 1)
              mesh.geometry.translate(-500, -400, 0)
              mesh.geometry.applyMatrix4(scaleMatrix)
              mesh.geometry.computeBoundingBox()
              mesh.geometry.computeBoundingSphere()
            }
            mesh.material.color.setRGB(1, 0, 0)
            if (mesh.geometry !== null && mesh.geometry.boundingSphere !== null) {
              const C = new THREE.Vector3()
              if (mesh.geometry.boundingBox) mesh.geometry.boundingBox.getCenter(C)
              if (mesh.geometry.boundingSphere) {
                const r = mesh.geometry.boundingSphere.radius
                const tMesh = createTextLabel(xnodes[k].label, C, r, xnodes[k].color)
                tMesh.name = mesh.name
                group.add(tMesh)
              }
            }
          }
        }
      }
    }
  }
  /**
   * handle edgePaths
   */
  const handleEdgePaths = (xpaths) => {
    for (let k = 0; k < xpaths.length; k++) {
      //for (let k = 2; k <= 2; k++) {
      const X = xpaths[k]?.path?.node()
      if (X !== null) {
        const aString = '<a xlink:href'
        const nString = '<a href'
        let htmlString = X.outerHTML
        if (X.outerHTML.startsWith(aString)) {
          htmlString = X.outerHTML.replace(aString, nString)
        }
        const D = loader.parse(htmlString)
        const paths: ShapePathX[] = D.paths as ShapePathX[]
        for (let i = 0; i < paths.length; i++) {
          const path = paths[i].shape
          const material = new THREE.MeshBasicMaterial({
            color: path.color,
            side: THREE.DoubleSide,
          })
          const shapes: THREE.Shape[] = SVGLoader.createShapes(path)
          for (let j = 0; j < shapes.length; j++) {
            const shape = shapes[j]
            if (hasNaNValuesInShape(shape)) {
              console.log('xpaths.hasNanValuesInShape')
              continue
            }
            function collinearCheck(p1, p2, p3) {
              // Handle vertical lines
              if (p1.x === p2.x && p2.x === p3.x) {
                return true // All points are on a vertical line
              }

              // Calculate slopes
              const slope12 = (p2.y - p1.y) / (p2.x - p1.x)
              const slope23 = (p3.y - p2.y) / (p3.x - p2.x)

              // Compare slopes (using a small epsilon for floating-point comparisons if necessary)
              return slope12 === slope23
            }
            const shapeX = new THREE.Shape()
            const points = getPathPointsV2(xpaths[k].path.node())
            const len = Math.trunc(points.length / 3) * 3
            let flag = false
            for (let i = 0; i < len; i += 3) {
              flag = collinearCheck(points[i], points[i + 1], points[i + 2])
              if (!flag) break
            }
            if (flag) {
              // modify points a little bit
              console.log('modify points', xpaths[k].pathCmd)
              const x1 = xpaths[k].pathCmd[0][1] as number
              const y1 = xpaths[k].pathCmd[0][2] as number
              const x2 = xpaths[k].pathCmd[xpaths[k].pathCmd.length - 1][1] as number
              const y2 = xpaths[k].pathCmd[xpaths[k].pathCmd.length - 1][2] as number
              const r = ((x2 - x1) / 2) * 2
              const cx = (x1 + x2) / 2
              const cy = y1 + ((x2 - x1) / 2) * Math.sqrt(3)
              /**
               * (y - cy)^2 + (x - cx)^2 = r^2
               */
              for (let i = 0; i < xpaths[k].pathCmd.length; i++) {
                const cmd: Array<string | number> = xpaths[k].pathCmd[i] as Array<string | number>
                switch (cmd[0]) {
                  case 'M': {
                    const x = cmd[1] as number
                    const y = cmd[2] as number
                    shapeX.moveTo(x, y)
                    console.log('M', x, y, cx, cy)
                    break
                  }
                  case 'L': {
                    const x = cmd[1] as number
                    const y = cmd[2] as number
                    shapeX.lineTo(x, y)
                    console.log('L', x, y, cx, cy)
                    break
                  }
                  case 'C': {
                    const xa = cmd[1] as number
                    const xb = cmd[3] as number
                    const xc = cmd[5] as number
                    const ya = -Math.sqrt(r * r - (xa - cx) * (xa - cx)) + cy
                    const yb = -Math.sqrt(r * r - (xb - cx) * (xb - cx)) + cy
                    const yc = -Math.sqrt(r * r - (xc - cx) * (xc - cx)) + cy
                    shapeX.bezierCurveTo(xa, ya, xb, yb, xc, yc)
                    console.log('C a', xa, ya, cx, cy)
                    console.log('C b', xb, yb, cx, cy)
                    console.log('C c', xc, yc, cx, cy)
                    break
                  }
                }
              }
            } else {
              shapeX.setFromPoints(points)
            }
            /*
            const geometryX = new MeshLineGeometry()
            geometryX.setPoints(points)
            const materialX = new MeshLineMaterial({
              color: path.color,
              resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
            })
            const mesh = new THREE.Mesh(geometryX, materialX)
            */
            //const geometry = new THREE.ShapeGeometry(shape)
            const geometry = new THREE.ShapeGeometry(shapeX)
            const mesh = new THREE.Mesh(geometry, material)
            mesh.geometry.computeBoundingBox()
            if (mesh.geometry.boundingBox) {
              const C = new THREE.Vector3()
              mesh.geometry.boundingBox.getCenter(C)
              const scaleMatrix = new THREE.Matrix4()
              scaleMatrix.makeScale(1, -1, 1)
              mesh.geometry.translate(-500, -400, 0)
              mesh.geometry.applyMatrix4(scaleMatrix)
              mesh.geometry.computeBoundingBox()
              mesh.geometry.computeBoundingSphere()
            }
            mesh.material.color.setRGB(1, 0, 0)
            mesh.name = xpaths[k].id
            group.add(mesh)
          }
        }
      }
    }
  }
  useEffect(() => {
    const threeSVG = (svg) => {
      const xnodes: NodeObj[] = map.get('Nodes')
      const xpaths: PathObj[] = map.get('edgePaths')
      handleNodes(xnodes)
      handleEdgePaths(xpaths)
      group.children.forEach((O) => {
        const worldPosition = new THREE.Vector3()
        O.getWorldPosition(worldPosition)
      })
      const container = document.getElementById('ThreeCanvas')
      if (meshRoot.inited === false && container) {
        const [pOut, pIn] = createButton()
        const root = createRoot(container) // createRoot(container!) if you use TypeScript
        root.render(<CanvasContent grp={group} pOut={pOut} pIn={pIn} />)
        meshRoot.inited = true
        meshRoot.root = root
        meshRoot.pOut = pOut
        meshRoot.pIn = pIn
        // openFullScreen(container)
      } else if (meshRoot.inited) {
        meshRoot.root.render(<CanvasContent grp={group} pOut={meshRoot.pOut} pIn={meshRoot.pIn} />)
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
            d3HandleEdgeLabel(diagramId, map)
            findRelations(diagramId, map)
            threeSVG(svg)
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
  }, [chart, mDevice, map, meshRoot]) // Re-render if the chart code changes

  return <div ref={mermaidRef}></div>
}

export default Mermaid
