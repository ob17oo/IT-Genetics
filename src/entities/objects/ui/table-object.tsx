import { Clone, useGLTF } from "@react-three/drei";
import { ChairObject } from "./chair-object";
import { ComputerObject } from "./computer-object";
import { FlowerObject } from "./flower-object";

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
      <ComputerObject scale={0.0025} position={[2.5,3.25,1.5]} rotation={[0,0,0]}/>
      <ComputerObject scale={0.0025} position={[2.5,3.25,-1.5]} rotation={[0,Math.PI / 1,0]}/>
      <ComputerObject scale={0.0025} position={[6,3.25,1.5]} rotation={[0,0,0]}/>
      <ComputerObject scale={0.0025} position={[6,3.25,-1.5]} rotation={[0,Math.PI / 1,0]}/>
      <ComputerObject scale={0.0025} position={[9.5,3.25,1.5]} rotation={[0,0,0]}/>
      <ComputerObject scale={0.0025} position={[9.5,3.25,-1.5]} rotation={[0,Math.PI / 1,0]}/>
      <group>
        <FlowerObject modelName="flowerFicus" scale={0.0004} position={[2.2,2,0]}/>
        <FlowerObject modelName="flowerPalm" scale={1} position={[3.2,2,0]}/>

        <FlowerObject modelName="flowerFicus" scale={0.0004} position={[4.2,2,0]}/>
        <FlowerObject modelName="flowerRhyzome" scale={0.6} position={[4.8,2,0]}/>
        <FlowerObject modelName="flowerPalm" scale={1} position={[5.3,2,0]}/>

        <FlowerObject modelName="flowerRhyzome" scale={0.6} position={[6.8,2,0]}/>

        <FlowerObject modelName="flowerPalm" scale={1} position={[8.3,2,0]}/>
        <FlowerObject modelName="flowerRhyzome" scale={0.6} position={[9,2,0]}/>
      </group>
    </mesh>
  );
}