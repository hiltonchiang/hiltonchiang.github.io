import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import * as THREE from 'three'
import { easing } from 'maath'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sky, Bvh } from '@react-three/drei'
import {
  EffectComposer,
  Selection,
  Outline,
  N8AO,
  TiltShift2,
  ToneMapping,
} from '@react-three/postprocessing'
import { useState, useCallback, useRef, useEffect } from 'react'
import { debounce } from 'lodash'
import { Select } from '@react-three/postprocessing'
import Scene from '@/components/Scene'
import mermaid from 'mermaid'

export const ThreeSvg = ({ chart }) => {
  const mermaidRef = useRef<HTMLDivElement | null>(null)
  const [group, setGroup] = useState(new THREE.Group())
  console.log('ThreeSvg IN')
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
            const loader = new SVGLoader()
            // Use the parse method to process the SVG string
            const svgData = loader.parse(svg)
            // Now you can use svgData to create shapes and geometries
            const paths = svgData.paths

            for (let i = 0; i < paths.length; i++) {
              const path = paths[i]
              const material = new THREE.MeshBasicMaterial({
                color: path.color,
                side: THREE.DoubleSide,
              })
              const shapes = SVGLoader.createShapes(path)
              for (let j = 0; j < shapes.length; j++) {
                const shape = shapes[j]
                const geometry = new THREE.ShapeGeometry(shape)
                const mesh = new THREE.Mesh(geometry, material)
                group.add(mesh)
              }
            }
            console.log('ThreeSvg', group)
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
  }, [chart, group]) // Re-render if the chart code changes

  console.log('ThreeSvg B4 return')
  return (
    <Canvas
      flat
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      camera={{ position: [0, 1, 6], fov: 25, near: 1, far: 20 }}
    >
      <ambientLight intensity={1.5 * Math.PI} />
      <Sky />
      <Bvh firstHitOnly>
        <Selection>
          <Effects />
          <Scene rotation={[0, Math.PI / 2, 0]} position={[0, -1, -0.85]} grp={group} />
        </Selection>
      </Bvh>
    </Canvas>
  )
}

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
export default ThreeSvg
