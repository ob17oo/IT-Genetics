import { Clone, useGLTF } from "@react-three/drei";
import { ChairObject } from "./chair-object";

interface TableProps{
    position?: [number,number,number],
    scale?: number | [number,number,number],
    rotation?: [number,number,number]
}

export function TableObject({position, scale, rotation}: TableProps){
  const gltf = useGLTF('/model/furniture/Office-Table.glb')
  if(gltf){
  }
  if (!gltf?.scene) {
    return null;
  }
  
  return (
    <mesh position={position}>
      <Clone object={gltf.scene} scale={scale} rotation={rotation} />
      
      <group>
        <ChairObject position={[-1, 0.1, -2.5]} scale={0.025} />
        <ChairObject position={[2.5, 0.1, -2.5]} scale={0.025} />
        <ChairObject position={[6, 0.1, -2.5]} scale={0.025} />
        <ChairObject position={[9, 0.1, -2.5]} scale={0.025} />
        <ChairObject position={[12.5, 0.1, -2.5]} scale={0.025} />
      </group>
      <group>
        <ChairObject rotation={[0,Math.PI / 1, 0]} position={[-1, 0.1, 2.5]} scale={0.025} />
        <ChairObject rotation={[0,Math.PI / 1, 0]} position={[2.5, 0.1, 2.5]} scale={0.025} />
        <ChairObject rotation={[0,Math.PI / 1, 0]} position={[6, 0.1, 2.5]} scale={0.025} />
        <ChairObject rotation={[0,Math.PI / 1, 0]} position={[9, 0.1, 2.5]} scale={0.025} />
        <ChairObject rotation={[0,Math.PI / 1, 0]} position={[12.5, 0.1, 2.5]} scale={0.025} />
      </group>
    </mesh>
  );
}