'use client'
interface WallProps {
  rotation?: [number, number, number];
  position?: [number, number, number];
  widthSize: number;
  heightSize: number;
  depthSize: number;
  color: string;
  receiveShadow: boolean;
}

export default function WallObject({widthSize,heightSize,depthSize, rotation, position, color, receiveShadow}: WallProps){
    return (
        <mesh rotation={rotation} position={position} receiveShadow={receiveShadow}>
            <boxGeometry args={[widthSize,depthSize,heightSize]} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}