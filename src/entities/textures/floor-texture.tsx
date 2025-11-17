import { useTexture } from "@react-three/drei"
import { RepeatWrapping } from 'three'
import { useMemo } from "react"

interface FloorProps {
  widthSize: number,
  heightSize: number,
}

export default function FloorTexture({widthSize, heightSize,}: FloorProps) {
    const baseTexture = useTexture('/textures/floorTexture.jpg')
    const floorTexture = useMemo(() => {
    const tex = baseTexture.clone()
    tex.wrapS = tex.wrapT = RepeatWrapping
    tex.repeat.set(8, 16)
    tex.needsUpdate = true
    return tex
  }, [baseTexture])
    return (
      <mesh 
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
      receiveShadow
      userData={{ isFloor: true }}>
        <planeGeometry args={[widthSize, heightSize]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>
    )
  }