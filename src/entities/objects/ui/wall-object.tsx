"use client";
interface WallProps {
  rotation?: [number, number, number];
  position?: [number, number, number];
  widthSize: number;
  heightSize: number;
  depthSize: number;
  color: string;
  receiveShadow: boolean;
}

export default function WallObject({
  widthSize,
  heightSize,
  depthSize,
  rotation,
  position,
  color,
  receiveShadow,
}: WallProps) {
  return (
    <mesh rotation={rotation} position={position} receiveShadow={receiveShadow} castShadow>
      <boxGeometry args={[widthSize, heightSize, depthSize]} />
      <meshStandardMaterial 
        color={color}
        roughness={0.60}
        metalness={0.02}
        emissive={0x0d0d0d}
        emissiveIntensity={0.12}
        envMapIntensity={0.9}
      />
    </mesh>
  );
}
