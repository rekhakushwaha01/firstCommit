import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

type SceneProps = {
  reduced: boolean
  compact: boolean
}

const BODY = '#8FB4C8'
const NODE = '#47738F'
const CYAN = '#61C7D9'
const LIME = '#C4EF3D'

export function MedicalNetwork({ reduced, compact }: SceneProps) {
  const particleCount = compact ? 18 : 42

  return (
    <group position={[0, -0.15, 0]}>
      <AnatomicalFigure reduced={reduced} />
      <MolecularHalo reduced={reduced} />
      <QuantumRings reduced={reduced} />
      <DataGraph compact={compact} />
      <BacteriaField count={particleCount} reduced={reduced} />
      <FlowSignals reduced={reduced} />
    </group>
  )
}

function AnatomicalFigure({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!group.current || reduced) return
    group.current.rotation.y += delta * 0.07
  })

  return (
    <group ref={group}>
      <mesh position={[0, 1.48, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <BodyMaterial />
      </mesh>
      <mesh position={[0, 1.22, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.16, 16]} />
        <BodyMaterial />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <capsuleGeometry args={[0.26, 0.62, 8, 16]} />
        <BodyMaterial />
      </mesh>
      <mesh position={[-0.34, 1.08, 0]} rotation={[0, 0, 0.55]}>
        <capsuleGeometry args={[0.07, 0.52, 6, 12]} />
        <BodyMaterial />
      </mesh>
      <mesh position={[0.34, 1.08, 0]} rotation={[0, 0, -0.55]}>
        <capsuleGeometry args={[0.07, 0.52, 6, 12]} />
        <BodyMaterial />
      </mesh>
      <mesh position={[-0.14, -0.12, 0]}>
        <capsuleGeometry args={[0.09, 0.7, 6, 12]} />
        <BodyMaterial />
      </mesh>
      <mesh position={[0.14, -0.12, 0]}>
        <capsuleGeometry args={[0.09, 0.7, 6, 12]} />
        <BodyMaterial />
      </mesh>
    </group>
  )
}

function BodyMaterial() {
  return (
    <meshPhysicalMaterial
      color={BODY}
      roughness={0.32}
      metalness={0.06}
      clearcoat={0.55}
      clearcoatRoughness={0.3}
      transparent
      opacity={0.92}
    />
  )
}

function MolecularHalo({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  const atoms = useMemo(() => {
    return Array.from({ length: 6 }, (_, index) => {
      const angle = (index / 6) * Math.PI * 2
      return [Math.cos(angle) * 0.58, 0.86 + Math.sin(angle) * 0.18, Math.sin(angle) * 0.58] as [
        number,
        number,
        number,
      ]
    })
  }, [])

  useFrame((_, delta) => {
    if (!group.current || reduced) return
    group.current.rotation.y -= delta * 0.15
  })

  return (
    <group ref={group}>
      {atoms.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshPhysicalMaterial color={index === 0 ? LIME : CYAN} roughness={0.2} />
        </mesh>
      ))}
      {atoms.map((start, index) => {
        const end = atoms[(index + 1) % atoms.length]
        return <Bond key={`bond-${index}`} start={start} end={end} />
      })}
    </group>
  )
}

function Bond({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...start)
    const b = new THREE.Vector3(...end)
    const direction = new THREE.Vector3().subVectors(b, a)
    const lengthValue = direction.length()
    const midpoint = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5)
    const quaternionValue = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize(),
    )
    return { position: midpoint, quaternion: quaternionValue, length: lengthValue }
  }, [start, end])

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.012, 0.012, length, 8]} />
      <meshBasicMaterial color="#7EA8BE" transparent opacity={0.55} />
    </mesh>
  )
}

function QuantumRings({ reduced }: { reduced: boolean }) {
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (reduced) return
    if (ringA.current) ringA.current.rotation.z += delta * 0.12
    if (ringB.current) ringB.current.rotation.x -= delta * 0.09
  })

  return (
    <group>
      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[1.35, 0.012, 12, 80]} />
        <meshBasicMaterial color="#7EA8BE" transparent opacity={0.45} />
      </mesh>
      <mesh ref={ringB} rotation={[0.5, 0.8, 0.2]}>
        <torusGeometry args={[1.62, 0.01, 12, 90]} />
        <meshBasicMaterial color="#61C7D9" transparent opacity={0.32} />
      </mesh>
    </group>
  )
}

function DataGraph({ compact }: { compact: boolean }) {
  const { points, segments } = useMemo(() => {
    const count = compact ? 10 : 16
    const generated: THREE.Vector3[] = []
    const phi = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < count; i += 1) {
      const y = 1 - (i / (count - 1)) * 2
      const radius = Math.sqrt(1 - y * y)
      const theta = phi * i
      generated.push(new THREE.Vector3(Math.cos(theta) * radius * 1.9, y * 1.55, Math.sin(theta) * radius * 1.9))
    }
    const lines: Array<[THREE.Vector3, THREE.Vector3]> = []
    generated.forEach((point, index) => {
      const nearest = generated
        .map((candidate, candidateIndex) => ({ candidate, candidateIndex, distance: point.distanceTo(candidate) }))
        .filter((entry) => entry.candidateIndex !== index)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2)
      nearest.forEach((entry) => {
        if (index < entry.candidateIndex) {
          lines.push([point, entry.candidate])
        }
      })
    })
    return { points: generated, segments: lines }
  }, [compact])

  return (
    <group>
      {points.map((point, index) => (
        <mesh key={index} position={point}>
          <octahedronGeometry args={[0.035, 0]} />
          <meshPhysicalMaterial color={NODE} roughness={0.25} />
        </mesh>
      ))}
      {segments.map((segment, index) => (
        <Line
          key={index}
          points={segment}
          color="#7EA8BE"
          lineWidth={1}
          transparent
          opacity={0.28}
        />
      ))}
    </group>
  )
}

function BacteriaField({ count, reduced }: { count: number; reduced: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        radius: 1.7 + (index % 5) * 0.12,
        speed: 0.08 + (index % 7) * 0.01,
        offset: index * 0.47,
        y: ((index % 9) - 4) * 0.18,
      })),
    [count],
  )

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const time = reduced ? 0.4 : clock.elapsedTime
    seeds.forEach((seed, index) => {
      const angle = seed.offset + time * seed.speed
      dummy.position.set(Math.cos(angle) * seed.radius, seed.y, Math.sin(angle) * seed.radius)
      dummy.rotation.set(angle, angle * 0.4, 0.3)
      dummy.scale.setScalar(0.7 + (index % 3) * 0.15)
      dummy.updateMatrix()
      mesh.current?.setMatrixAt(index, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <capsuleGeometry args={[0.03, 0.08, 4, 8]} />
      <meshPhysicalMaterial color="#47738F" roughness={0.45} transparent opacity={0.7} />
    </instancedMesh>
  )
}

function FlowSignals({ reduced }: { reduced: boolean }) {
  const a = useRef<THREE.Mesh>(null)
  const b = useRef<THREE.Mesh>(null)
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.8, -0.8, 0.4),
        new THREE.Vector3(-0.6, 0.3, 1.1),
        new THREE.Vector3(0.2, 1.1, 0.2),
        new THREE.Vector3(1.4, 0.4, -0.6),
        new THREE.Vector3(1.8, -0.5, 0.2),
      ]),
    [],
  )

  useFrame(({ clock }) => {
    if (reduced) return
    const t = (clock.elapsedTime * 0.07) % 1
    a.current?.position.copy(curve.getPointAt(t))
    b.current?.position.copy(curve.getPointAt((t + 0.42) % 1))
  })

  return (
    <group>
      <mesh ref={a}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color={CYAN} />
      </mesh>
      <mesh ref={b}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color={LIME} />
      </mesh>
    </group>
  )
}
