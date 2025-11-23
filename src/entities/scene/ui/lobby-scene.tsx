"use client";

import { CharacterController } from "@/entities/characters/third-person-character/character-controller";
import { AdminTableObject } from "@/entities/objects/ui/adminTable-object";
import { ChairObject } from "@/entities/objects/ui/chair-object";
import { CoffeeTableObject } from "@/entities/objects/ui/coffeeTable-object";
import { ComputerObject } from "@/entities/objects/ui/computer-object";
import { DiplomaStand } from "@/entities/objects/ui/diploma-object";
import { LogotypeObject } from "@/entities/objects/ui/logotype-object";
import OfficeDoorObject from "@/entities/objects/ui/officeDoor-object";
import { SofaObject } from "@/entities/objects/ui/sofa-object";
import WalletObject from "@/entities/objects/ui/wall-object";
import SceneLoader from "@/shared/ui/Loader/scene-loader";
import GameHud from "@/widgets/game-hud/ui/game-hud";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { ImageConfigContext } from "next/dist/shared/lib/image-config-context.shared-runtime";
import { Suspense, useMemo } from "react";

interface LobbySofaProps{
  scale?: number | [number,number,number],
  position?: [number,number,number],
  rotation?: [number,number,number]
}
function LobbySofa({scale = 0.1, position, rotation}: LobbySofaProps){
  const {scene} = useGLTF('/model/furniture/lobbySofa.glb')
  return (
    <primitive object={scene} scale={scale} position={position} rotation={rotation} />
  )
}

const WALL_CONFIGS = [
  {
    position: [-7, 4, 7.5] as [number, number, number],
    size: [14, 0.2, 10],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-20, 4, 0] as [number, number, number],
    size: [0.2, 15, 10],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-10, 4, -7.5] as [number, number, number],
    size: [20, 0.2, 10],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [14.5, 4, 7.5] as [number, number, number],
    size: [11, 0.2, 10],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [14.5, 4, -7.5] as [number, number, number],
    size: [11, 0.2, 10],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [20, 4, 0] as [number, number, number],
    size: [0.2, 15, 10],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-20, 4, 8.5] as [number, number, number],
    size: [0.2, 2.2, 10],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-14, 4, 8.5] as [number, number, number],
    size: [0.2, 2.2, 10],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-17, 4, 9.7] as [number, number, number],
    size: [6.2, 0.2, 10],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [0, 4, 11] as [number, number, number],
    size: [7.2, 0.2, 10],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },
  {
    position: [9, 4, 11] as [number, number, number],
    size: [7.2, 0.2, 10],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },
  {
    position: [4.5, 4, 14.5] as [number, number, number],
    size: [9.2, 0.2, 10],
    rotation: [0, 0, 0] as [number, number, number],
  },
];

const DOOR_CONFIGS = [
  {
    position: [-17, 1, -7.7] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-17, 1, 9.3] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-11, 1, 7.1] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-3, 1, 7.1] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [18, 1, 7.1] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [19.6, 1, 0] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },
];

const DIPLOMA_CONFIGS = [
  {
    position: [16.9, 4.5, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
  {
    position: [13.7, 4.5, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
  {
    position: [10.5, 4.5, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
  {
    position: [14, 3, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
  {
    position: [10.8, 3, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
  {
    position: [15, 1.5, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
  {
    position: [11.8, 1.5, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
];



export default function LobbyScene() {
  const walls = useMemo(() => (
      WALL_CONFIGS.map((wall, index) => (
        <RigidBody key={`wall-${index}`} type="fixed">
            <WalletObject color="#F2F2F2"
              widthSize={wall.size[0]}
              heightSize={wall.size[1]}
              depthSize={wall.size[2]}
              position={wall.position}
              rotation={wall.rotation}
              receiveShadow={true}
            />
            <CuboidCollider args={[wall.size[0] / 2, wall.size[1] / 2, wall.size[2] /2]} position={wall.position} rotation={wall.rotation}/>
        </RigidBody>
      ))
    ),[])

  const doors = useMemo(() => (
      DOOR_CONFIGS.map((door,index) => (
        <OfficeDoorObject 
          key={`door-${index}`}
          position={door.position}
          scale={1}
          rotation={door.rotation}
        />
      ))
  ),[])
 
  const diplomas = useMemo(() => (
      DIPLOMA_CONFIGS.map((diploma, index) => (
        <RigidBody type="fixed" key={`diploma-${index}`} >
            <DiplomaStand
              rotation={diploma.rotation}
              scale={diploma.scale}
              position={diploma.position}
            />
        </RigidBody>
      ))
  ),[])
  return (
    <section className="w-full h-screen relative">
      <SceneLoader />
      <Canvas shadows camera={{ position: [0, 1.7, 10], fov: 75 }}>
        <Suspense fallback={null}>
          <Physics gravity={[0, -20, 0]}>
          <color attach="background" args={["#1E1E1E"]} />
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />

          {/*Основной пол*/}
          <group>
            <RigidBody type="fixed">
              <mesh position={[0,-1,0]} receiveShadow>
                <boxGeometry args={[40,0.1,15]} />
                <meshStandardMaterial color="#E7E2BA" />
              </mesh>
              <CuboidCollider args={[20, 0.05,7.5]} position={[0, -1.05, 0]} />
            </RigidBody>
            {/*Пол входа*/}
            <RigidBody type="fixed">
              <mesh position={[-17, -1 , 8.5]} receiveShadow>
                  <boxGeometry args={[6, 0.1, 2.5]}/>
                  <meshStandardMaterial color="#E7E2BA"/>
              </mesh>
              <CuboidCollider args={[3, 0.05, 1.25]} position={[-17, -1.05, 8.5]}/>
            </RigidBody>
            {/*Пол входа у лифта*/}
            <RigidBody type="fixed">
              <mesh position={[4.5,-1,11]} receiveShadow>
                  <boxGeometry args={[9,0.1,7]}/>
                  <meshStandardMaterial color="#E7E2BA"/>
              </mesh>
              <CuboidCollider args={[4.5, 0.05, 3.5]} position={[4.5, -1.05, 11]}/>
            </RigidBody>
          </group>

          {walls}
          {diplomas}
          {doors}

          <group>
              <RigidBody type="fixed">
                  <SofaObject position={[14,-0.8,-4]} scale={2}/>
                  <CuboidCollider args={[1.5, 0.5, 0.8]} position={[14, 0.2, -4]} />
              </RigidBody>
              <RigidBody type="fixed">
                   <SofaObject position={[14,-0.8,4]} scale={2} rotation={[0, Math.PI / 1, 0]}/>
                    <CuboidCollider args={[1.5, 0.5, 0.8]} position={[14, 0.2, 4]} />
              </RigidBody>
          </group>

          <RigidBody type="fixed">
              <CoffeeTableObject scale={0.3} position={[15,-1,-0.5]} rotation={[0, Math.PI / 2, 0]}/>
              <CuboidCollider args={[0.8, 0.3, 0.8]} position={[15, 0.3, -0.5]} />
          </RigidBody>

          <RigidBody type="fixed">
              <LogotypeObject scale={20} position={[-7.5, 3.2, -7.3]}/>
          </RigidBody>

          <RigidBody type="fixed">
              <AdminTableObject scale={7} position={[-11, -1, -4]}/>
              <CuboidCollider args={[1.2, 0.8, 0.6]} position={[-11, 0.4, -4]} />
          </RigidBody>

          <RigidBody type="fixed">
              <LobbySofa scale={7} position={[-8, -1, 4.5]}/>
               <CuboidCollider args={[1.2, 0.5, 0.8]} position={[-8, 0.25, 4.5]} />
          </RigidBody>

          <RigidBody type="fixed">
              <ChairObject scale={0.023} position={[-7, -0.95, -6]} rotation={[0, Math.PI / 4, 0]}/>
              <CuboidCollider args={[0.4, 0.5, 0.4]} position={[-7, 0.3, -6]} />
          </RigidBody>
          <RigidBody type="fixed">
              <ComputerObject scale={0.0025} position={[-7.5, 1.9, -4.9]} rotation={[0, Math.PI / 1, 0]}/>
          </RigidBody>
          <OrbitControls />
          <CharacterController position={[0,0,0]} />
          </Physics>
        </Suspense>
      </Canvas>
      <GameHud />
    </section>
  );
}
