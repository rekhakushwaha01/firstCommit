import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type Props = {
  reduced: boolean
  active: boolean
  compact: boolean
}

export default function QuantumCanvas({ reduced, active, compact }: Props) {
  return (
    <Canvas
      dpr={compact ? [1, 1.15] : [1, 1.5]}
      camera={{ position: [0, 0.2, 6.2], fov: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      frameloop={active && !reduced ? 'always' : 'demand'}
      className="h-full w-full"
      aria-label="Simulated quantum circuit visualization"
    >
      <ambientLight intensity={0.9} />
      <pointLight position={[2, 2, 3]} intensity={0.5} color="#61C7D9" />
      <Circuit reduced={reduced} compact={compact} />
    </Canvas>
  )
}

function Circuit({ reduced, compact }: { reduced: boolean; compact: boolean }) {
  const group = useRef<THREE.Group>(null)
  const rows = compact ? 3 : 4
  const cols = compact ? 5 : 7
  const nodes = useMemo(() => {
    const items: THREE.Vector3[] = []
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        items.push(new THREE.Vector3((col - (cols - 1) / 2) * 0.85, (1.1 - row) * 0.7, 0))
      }
    }
    return items
  }, [cols, rows])

  const edges = useMemo(() => {
    const lines: Array<[THREE.Vector3, THREE.Vector3]> = []
    nodes.forEach((node, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      if (col < cols - 1) lines.push([node, nodes[index + 1]])
      if (row < rows - 1) lines.push([node, nodes[index + cols]])
    })
    return lines
  }, [cols, nodes, rows])

  useFrame(() => {
    if (!group.current || reduced) return
    group.current.rotation.y = Math.sin(performance.now() / 2400) * 0.12
    group.current.rotation.x = 0.18
    group.current.position.y = Math.sin(performance.now() / 1600) * 0.05
  })

  return (
    <group ref={group}>
      {edges.map((segment, index) => (
        <Line key={index} points={segment} color="#7EA8BE" lineWidth={1} transparent opacity={0.45} />
      ))}
      {nodes.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[index % 5 === 0 ? 0.09 : 0.07, 16, 16]} />
          <meshPhysicalMaterial
            color={index % 5 === 0 ? '#C4EF3D' : '#47738F'}
            roughness={0.25}
            emissive={index % 5 === 0 ? '#61C7D9' : '#15354D'}
            emissiveIntensity={0.12}
          />
        </mesh>
      ))}
    </group>
  )
}
