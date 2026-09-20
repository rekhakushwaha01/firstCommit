import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { MedicalNetwork } from './MedicalNetwork'

type HeroCanvasProps = {
  reduced: boolean
  active: boolean
  compact: boolean
}

export default function HeroCanvas({ reduced, active, compact }: HeroCanvasProps) {
  const animate = active && !reduced

  return (
    <Canvas
      dpr={compact ? [1, 1.2] : [1, 1.6]}
      camera={{ position: [2.35, 0.85, 4.6], fov: compact ? 42 : 36 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      frameloop={animate ? 'always' : 'demand'}
      className="absolute inset-0 h-full w-full"
      aria-label="Stylized medical network visualization"
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 2]} intensity={1.15} color="#f7fbfd" />
      <directionalLight position={[-3, 1, -2]} intensity={0.45} color="#7EA8BE" />
      <pointLight position={[0.4, 1.6, 1.2]} intensity={0.55} color="#61C7D9" />
      <MedicalNetwork reduced={reduced} compact={compact} />
      <ContactShadows
        position={[0, -1.55, 0]}
        opacity={0.28}
        scale={8}
        blur={2.6}
        far={4}
        color="#15354D"
      />
    </Canvas>
  )
}
