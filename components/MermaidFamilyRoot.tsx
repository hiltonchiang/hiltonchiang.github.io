'use client'
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/solid'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { createRoot, Root } from 'react-dom/client'
import { SVGLoader } from '@/components/SVGLoader'
import { useSearchParams } from 'next/navigation'
import ReactDOMServer from 'react-dom/server'
import HeroLogo from '@/components/HeroLogo'
import parseSvgPath from 'parse-svg-path'
import WVertX from '@/components/WVertX'
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
import dynamic from 'next/dynamic'
import { debounce } from 'lodash'
import * as THREE from 'three'
import { easing } from 'maath'
import mermaid from 'mermaid'
import {
  OrthographicCamera,
  OrbitControls,
  DragControls,
  useCursor,
  Html,
  Text,
  Bvh,
  Sky,
} from '@react-three/drei'
import * as d3 from 'd3'

const DialogFamily = dynamic(() => import('@/components/DialogFamily'), {
  ssr: false,
})

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
  aString: string
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
            aString: '',
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
  map: Map<string, number>
  container: HTMLElement | null
}
/**
 *
 */
interface SceneProps {
  rotation: number[]
  position: number[]
  grp: THREE.Group<THREE.Object3DEventMap>
}
interface ButtonProps {
  expand: boolean
}
function getAstring(name, map) {
  const xnodes: NodeObj[] = map.get('Nodes')
  let retString = ''
  for (let k = 0; k < xnodes.length; k++) {
    if (xnodes[k].name === name) {
      retString = xnodes[k].aString
      break
    }
  }
  function getStringBetween(fullString, startDelimiter, endDelimiter) {
    const startIndex = fullString.indexOf(startDelimiter)
    if (startIndex === -1) {
      return null // Start delimiter not found
    }
    const actualStartIndex = startIndex + startDelimiter.length
    const endIndex = fullString.indexOf(endDelimiter, actualStartIndex)
    if (endIndex === -1) {
      return null // End delimiter not found after the start delimiter
    }
    return fullString.substring(actualStartIndex, endIndex)
  }
  const bStr = getStringBetween(retString, '<a href="', '"')
  if (bStr !== null) {
    const cStr = bStr.replace(/&lt;br \/&gt;/g, '<br/>')
    //const dStr = d3.select('three-wvertx-tooltips').html(cStr)
    return cStr
  } else {
    return null
  }
}

/**
 * CanvasContent
 * This is the container for rendering all contents.
 */
function CanvasContent({ grp, map, container }: CanProps) {
  const [fullScreenState, setFullScreenState] = useState({ exited: false })
  const [buttonToggle, setButtonToggle] = useState({ f: true })
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const cameraRef = useRef<HTMLCanvasElement | null>(null)
  const meshRef = useRef<HTMLCanvasElement | null>(null)
  const [textStrings, setTextStrings] = useState<string[]>([
    '重慶潼南雙江蔣氏家族',
    ' ',
    '先父蔣文彬（譜名必兵）、︁祖籍重慶潼南雙江鎮老鸛嘴、︁房系列爲蔣氏入川第八代、︁先祖蔣超元於年五十有二時方生先父。︁先父弱冠離鄉投身軍旅、︁於民國三十八年（1949年）攜母劉文筠（譜名祖貞）隨政府入臺、︁定居於臺北。︁在臺發枝散葉、︁子息頗豐、︁育有二子五女。︁歿於民國73年（1984年）、︁享年六十有三、︁葬於臺北近郊觀音山、︁隔海遙望大陸。︁先父生逢戰亂、︁少小離家、︁因兩岸隔閡︁︁、︁終未能於有生之年回鄉探親；今吾等有幸、︁能回先父故里尋根問祖、︁無憾矣！吾等後輩子孫當牢記吾家發源之地、︁並恪遵祖傳字輩起名、︁以綿延吾蔣氏三千年宗脈。︁先父入臺之時、︁舉目無親、︁惟靠與母勤樸持家、︁育子成人。︁今吾後輩子孫當牢記先人安身立命艱辛、︁並力行勤樸家訓、︁奮發向上、︁振興家業、︁今將雙江蔣氏入臺支脈子孫姓名列於後、︁永誌不忘。︁',
    ' ',
    '潼南雙江蔣氏字輩',
    ' ',
    '蔣氏源起於周公姬旦三子伯齡之後、︁天下蔣氏源於一家、︁吾潼南雙江蔣氏於明末清初自湖南入川。︁爲承先啓後、︁世代子孫應依循蔣氏祖傳字輩起名、︁以利於尋根溯祖、︁今將祖傳字輩列於後、︁世代相傳。︁',
    ' ',
    '潼南雙江 蔣氏宗族祖傳字輩譜 入川字輩',
    ' ',
    '宗祖基德遠 以仁必愈昌 有能弘繼子 光先啓嗣芳',
    '清賢謀尚策 安邦建樂堂 秉政定毅璽 擁軍獻榮春',
    '寰宇結朋愛 九州同睦康 崇謹培後代 輝穎龍鳳生',
  ])
  console.log('CanvasContent re-render buttonToggle.f', buttonToggle.f)
  /**
   *
   */
  function Scene({ rotation, position, grp }: SceneProps) {
    const [hovered, setHovered] = useState(false)
    const debouncedHover = useCallback(debounce(setHovered, 30), [])
    const over = (name) => (e) => (e.stopPropagation(), debouncedHover(name))
    const mesh: THREE.Mesh[] = grp.children as THREE.Mesh[]
    // for (let i = 0; i < mesh.length; i++) console.log('Scene', mesh[i].name)
    const handlePointerOver = (e) => {
      setHovered(true)
      const mesh = e.object
      const name = mesh.name
      const aString = getAstring(name, map)
      if (aString === null) {
        setTextStrings([])
      } else {
        const B = aString.split('<br/>')
        console.log('handlePointerOver mesh.name', name, B)
        setTextStrings(B)
      }
    }
    const handlePointerOut = (e) => {
      setHovered(false)
    }
    const handleClick = (e) => {
      console.log('handleClick', e)
    }
    const groupRef = useRef()
    useCursor(hovered)
    /**
     *
     */
    return (
      <>
        <group ref={groupRef} {...rotation}>
          <DragControls>
            {mesh.map((m) => (
              <mesh
                ref={meshRef}
                key={m.uuid}
                geometry={m.geometry}
                material={m.material}
                name={m.name}
                onDoubleClick={handlePointerOver}
                onPointerOut={handlePointerOut}
              />
            ))}
          </DragControls>
        </group>
      </>
    )
  } // end of Scene component
  /**
   *
   */
  function CameraControl() {
    const { camera, gl, size } = useThree()
    useEffect(() => {
      if (canvasRef.current) {
        const handleWheel = (event) => {
          //console.log('CameraControl:', event.deltaY)
          event.preventDefault()
          const cameraPos = camera.position
          const zoom = event.deltaY < 0 ? 'in' : 'out'
          //console.log('CameraControl zoom', zoom)
          const oldPos = new THREE.Vector3()
          oldPos.copy(camera.position)
          if (zoom == 'out') {
            camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z + 1)
          } else {
            camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z - 1)
          }
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
        onChange={(e) => {}}
        onEnd={(e) => {}}
      />
    )
  }
  /**
   *
   */
  function CSSNodes(map) {
    const xnodes: NodeObj[] = map.get('Nodes')
  } // end of CSSNodes comonent
  /**
   *
   */
  function CSSPaths(map) {
    const xpaths: PathObj[] = map.get('edgePaths')
  } // end of CSSPaths component
  /**
   *
   */
  function ButtonScreen() {
    //const [fullScreenState, setFullScreenState] = useState({ exited: false })
    //const [buttonToggle, setButtonToggle] = useState({ f: true })
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const opacityFlag = getDataBlur() ? 'opacity-0' : 'opacity-100'
    console.log('ButtonScreen rendering, buttonToggle.f', buttonToggle.f)
    console.log('ButtonScreen rendering, fullScreenState.exited', fullScreenState.exited)
    useEffect(() => {
      if (buttonRef.current) {
        /**
         * Full Screen may exit by pressing Esc key
         * We need to handle exitScreen as normal button clicking as well
         */
        document.addEventListener('fullscreenchange', (event) => {
          if (document.fullscreenElement === null) {
            //console.log('fullscreenchange:fullScreenStatea.exited', fullScreenState.exited)
            console.log('fullscreenchange:buttonToggle.f', buttonToggle.f)
            if (!fullScreenState.exited) {
              // buttonToggle.f = !buttonToggle.f
              fullScreenState.exited = true
              setButtonToggle({ f: !buttonToggle.f })
              console.log('fullscreenchange:buttonToggle.f out', buttonToggle.f)
            }
          } else {
            console.log('Entered fullscreen!', fullScreenState)
          }
        })
      }
    }, [buttonToggle])
    return (
      <>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 10, // Ensure it's on top of the canvas
          }}
          className={opacityFlag}
        >
          <button
            ref={buttonRef}
            className="flex items-center space-x-2 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={(e) => {
              console.log('Button Clicked!', e)
              if (buttonToggle.f) {
                openFullScreen(container)
                fullScreenState.exited = false
              } else {
                exitFullScreen()
                fullScreenState.exited = true
              }
              console.log('onClick buttonToggle.f 1', buttonToggle.f)
              // buttonToggle.f = !buttonToggle.f
              console.log('onClick buttonToggle.f 2', buttonToggle.f)
              setButtonToggle({ f: !buttonToggle.f })
              //console.log('onClick fullScreenStatea.exited', fullScreenState.exited)
              console.log('onClick buttonToggle.f 3', buttonToggle.f)
            }}
          >
            {buttonToggle.f ? (
              <ArrowsPointingOutIcon className="h-10 w-10" />
            ) : (
              <ArrowsPointingInIcon className="h-10 w-10" />
            )}
          </button>
        </div>
      </>
    )
  } // end of ButtonScreen component
  /**
   *
   */
  function TextTooltips() {
    const opacityFlag = getDataBlur() ? 'opacity-0' : 'opacity-100'
    return (
      <>
        <div
          style={{
            position: 'absolute',
            top: '-400px',
            left: '-500px',
            zIndex: 15, // Ensure it's on top of the canvas
          }}
          className={opacityFlag}
        >
          {textStrings.map((s, index) => (
            <div className="w-full text-2xl text-stone-500 dark:text-lime-500" key={index}>
              {s}<br/>
            </div>
          ))}
        </div>
      </>
    )
  } // end of TextTooltips component

  /**
   *
   */
  return (
    <div className="w-full border-2 border-blue-300">
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
        style={{ width: '100%', height: '1400px' }}
      >
        <ambientLight intensity={1.5 * Math.PI} />
        <Scene rotation={[0, 0, 0]} position={[100, 0, -0.85]} grp={grp} />
        <Html style={{ width: '800px' }}>
          <TextTooltips />
        </Html>
        <CameraControl />
      </Canvas>
      {/* Try to put CSS rendering componets to go with  Canvas */}
      <ButtonScreen />
    </div>
  )
} // end of CanvasContent
//
//
//
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
function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.fullscreenElement) {
    document.exitFullscreen()
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
  /*  
  const parser = new DOMParser()
  const htmlString = '<div id="myElement">Hello from a string!</div>'
  const doc = parser.parseFromString(htmlString, 'text/html') // a HTMLElement
  */
  if (context !== null) {
    canvas.width = radius * 2 * 4
    canvas.height = radius * 2 * 4
    canvas.style.display = 'block'
    const T = text.split('<br>')
    const desiredCanvasWidth = canvas.width
    const initialFont = 50
    const fontStyle = 'Arial'
    const w = desiredCanvasWidth
    const h = desiredCanvasWidth
    context.beginPath()
    context.arc(
      canvas.width / 2, // radius,
      canvas.height / 2, // radius,
      canvas.width, // radius,
      0,
      2 * Math.PI,
      false
    ) // Define the circle
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
  const sCanvas = document.createElement('canvas')
  const sContext = sCanvas.getContext('2d')
  if (sContext !== null) {
    sCanvas.width = radius * 2 // 1.414
    sCanvas.height = radius * 2 // 1.414
    sContext.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      sCanvas.width,
      sCanvas.height
    )
  }
  return sCanvas
}
/**
 *
 */
function createTextLabel(text, position, radius, color) {
  const canvas = createTextCanvas(text, radius, color)
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.needsUpdate = true
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: color,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
  })
  const beta = 1
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
  })
  const loader = new SVGLoader(THREE.DefaultLoadingManager)
  const group = new THREE.Group()
  /**
   * handle Nodes
   * generate meshes based on SVG nodes
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
        xnodes[k].aString = htmlString
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
              // console.log('boundingBox Center', mesh.name, C)
              const scaleMatrix = new THREE.Matrix4()
              scaleMatrix.makeScale(1, -1, 1)
              mesh.geometry.translate(-500, -700, 0)
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
  } // end of handleNodes
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
          const shapes: THREE.Shape[] = SVGLoader.createShapes(path)
          for (let j = 0; j < shapes.length; j++) {
            const shape = shapes[j]
            if (hasNaNValuesInShape(shape)) {
              console.log('xpaths.hasNanValuesInShape')
              continue
            }
            /**
             *
             */
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
            /**
             *
             */
            const formMeshShape = (shape) => {
              const material = new THREE.MeshBasicMaterial({
                color: path.color,
                side: THREE.DoubleSide,
              })
              const geometry = new THREE.ShapeGeometry(shape)
              const mesh = new THREE.Mesh(geometry, material)
              mesh.material.color.setRGB(1, 0, 0)
              return mesh
            }
            /**
             *
             */
            const formMeshShapeX = (points): THREE.Mesh => {
              const shapeX = new THREE.Shape()
              const len = Math.trunc(points.length / 3) * 3
              let flag = false
              for (let i = 0; i < len; i += 3) {
                flag = collinearCheck(points[i], points[i + 1], points[i + 2])
                if (!flag) break
              }
              if (flag) {
                // modify points a little bit
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
                      // console.log('M', x, y, cx, cy)
                      break
                    }
                    case 'L': {
                      const x = cmd[1] as number
                      const y = cmd[2] as number
                      shapeX.lineTo(x, y)
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
                      break
                    }
                  }
                }
              } else {
                shapeX.setFromPoints(points)
              }
              const material = new THREE.MeshBasicMaterial({
                color: path.color,
                side: THREE.DoubleSide,
              })
              const geometry = new THREE.ShapeGeometry(shapeX)
              const mesh = new THREE.Mesh(geometry, material)
              mesh.material.color.setRGB(1, 0, 0)
              return mesh
            } // end of formMeshShapeX
            /**
             *
             */
            const formMeshLine = (points: THREE.Vector2[]): THREE.Mesh => {
              const points3D: THREE.Vector3[] = [] as THREE.Vector3[]
              const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
              const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
              const line = new THREE.Line(lineGeometry, lineMaterial)
              const linePoints = line.geometry.attributes.position.array
              const f = true
              if (f) {
                for (let i = 0; i < points.length; i++) {
                  points3D.push(
                    new THREE.Vector3(points[i].x || points[i][0], points[i].y || points[i][1], 0)
                  )
                }
              } else {
                for (let i = 0; i < linePoints.length; i += 3) {
                  const x = linePoints[i]
                  const y = linePoints[i + 1]
                  const z = linePoints[i + 2]
                  points3D.push(new THREE.Vector3(x, y, z))
                }
              }
              const meshLineGeometry = new MeshLineGeometry()
              const meshLineMaterial = new MeshLineMaterial({
                color: new THREE.Color(0xff0000), // Red color
                lineWidth: 2,
                resolution: new THREE.Vector2(window.innerWidth, window.innerHeight), // Required for correct width calculation
              })
              meshLineGeometry.setPoints(points3D)
              const mesh = new THREE.Mesh(meshLineGeometry, meshLineMaterial)
              return mesh
            } // end of formMeshLine
            const points = getPathPointsV2(xpaths[k].path.node())
            if (xpaths[k].id === 'L_G2_S0_0') console.log(points)
            // const mesh = formMeshShapeX(points)
            const mesh = formMeshLine(points)
            mesh.geometry.computeBoundingBox()
            if (mesh.geometry.boundingBox) {
              const C = new THREE.Vector3()
              mesh.geometry.boundingBox.getCenter(C)
              const scaleMatrix = new THREE.Matrix4()
              scaleMatrix.makeScale(1, -1, 1)
              mesh.geometry.translate(-500, -700, 0)
              mesh.geometry.applyMatrix4(scaleMatrix)
              mesh.geometry.computeBoundingBox()
              mesh.geometry.computeBoundingSphere()
            }
            mesh.name = xpaths[k].id
            group.add(mesh)
          }
        }
      }
    }
  } // end of handleEdgePaths
  useEffect(() => {
    /**
     * threeSVG
     * main function to handle THREE
     */
    const threeSVG = (svg, map) => {
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
        const root = createRoot(container) // createRoot(container!) if you use TypeScript
        root.render(<CanvasContent grp={group} map={map} container={container} />)
        meshRoot.inited = true
        meshRoot.root = root
        // openFullScreen(container)
      } else if (meshRoot.inited) {
        meshRoot.root.render(<CanvasContent grp={group} map={map} container={container} />)
      }
    } // end of threeSVG function
    /*
     * generate svg chart
     */
    if (mermaidRef.current) {
      /**
       * Entry point for generating SVG and rendering it
       */
      const renderChart = async () => {
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
            threeSVG(svg, map)
          }
        } catch (error) {
          console.error('Mermaid render error:', error)
          if (mermaidRef.current !== null) {
            mermaidRef.current.innerHTML = `<div style="color: red">Error rendering diagram.</div>`
          }
        }
      } // end of renderChrt function
      renderChart()
    }
  }, [chart, mDevice, map, meshRoot]) // Re-render if the chart code changes
  /**
   * To wait for DialogFamily closing and re-render Canvas
   */
  function handleDialogClosed(data: string) {
    console.log('handleDialogClosed', data)
    if (data === 'DialogRadio Closed') {
      console.log('meshRoot to rerender Canvas')
      const container = document.getElementById('ThreeCanvas')
      meshRoot.root.render(<CanvasContent grp={group} map={map} container={container} />)
    }
  }
  /**
   * return the entire contents
   * DiaglogFamily floats on top of Canvas and blur underneath Canvas while a user logs in
   * and plays Q&A
   */
  return (
    <>
      <div ref={mermaidRef}></div>
      <DialogFamily onDialogClosed={handleDialogClosed} />
    </>
  )
}

export default Mermaid
