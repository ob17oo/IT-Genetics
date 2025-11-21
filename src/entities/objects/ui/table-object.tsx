import { ComputerObject } from "./computer-object";
import { ChairObject } from "./chair-object"
import { ShelfObject } from "./shelf-object"
import { CuboidCollider } from "@react-three/rapier";

interface TableProps{
    position?: [number,number,number]
}

export function TableObject({position}: TableProps){
    return (
      <group position={position}>
        <CuboidCollider args={[3, 1.5, 1.75]} position={[0,0,0]} />
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[6, 0.1, 3.5]} />
          <meshStandardMaterial color="#DED1B6" />
        </mesh>

        {/* Ножки */}
        <mesh position={[-2.5, -0.3, 1]} castShadow>
          <boxGeometry args={[0.2, 2.5, 0.2]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[2.5, -0.3, 1]} castShadow>
          <boxGeometry args={[0.2, 2.5, 0.2]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Левая горизонтальная опора*/}
        <mesh rotation={[1.56, 0, 0]} position={[-2.5, -0.5, 0]}>
          <boxGeometry args={[0.2, 2, 0.2]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        <mesh position={[-2.5, -0.3, -1]} castShadow>
          <boxGeometry args={[0.2, 2.5, 0.2]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[2.5, -0.3, -1]} castShadow>
          <boxGeometry args={[0.2, 2.5, 0.2]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Правая горизонтальная опора*/}
        <mesh rotation={[1.56, 0, 0]} position={[2.5, -0.5, 0]}>
          <boxGeometry args={[0.2, 2, 0.2]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/*Центральная горизонтальная опора */}
        <mesh rotation={[1.57, 0, 4.7]} position={[0, -0.5, 0]}>
          <boxGeometry args={[0.2, 5, 0.2]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <group position={[0,0.7,0]}>
          <ComputerObject position={[0,1.7,1.5]} scale={0.0025} />
          <ComputerObject rotation={[0,Math.PI / 1, 0]} position={[0,1.7,-1.5]} scale={0.0025} />
        
        </group>
        <group>
          <ChairObject scale={0.03} position={[0,-1,-2.5]} />
          <ChairObject scale={0.03} position={[0,-1,2.5]} rotation={[0, Math.PI / 1 , 0]}  />
        </group>

        <ShelfObject />
        
      </group>
    );
}