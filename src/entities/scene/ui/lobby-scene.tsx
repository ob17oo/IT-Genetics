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
import WallObject from "@/entities/objects/ui/wall-object";
import { LobbyNPC } from "@/entities/characters/lobby-npc/lobby-npc";
import SceneLoader from "@/shared/ui/Loader/scene-loader";
import GameHud from "@/widgets/game-hud/ui/game-hud";
import { preloadLobbyModels } from "@/shared/lib/preload-models";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useMemo, useState, useEffect } from "react";
import { Vector3 } from "three";
import MissionHud from "@/widgets/game-hud/ui/mission-hud";

interface defaultGLBProps{
  scale?: number | [number,number,number],
  position?: [number,number,number],
  rotation?: [number,number,number],
  name: string
}

function ItemRender({scale = 0.1, rotation, position, name}: defaultGLBProps){
  const { scene } = useGLTF(`/model/furniture/${name}.glb`) 
  return (
    <primitive object={scene} rotation={rotation} position={position} scale={scale} />
  )
}

const WALL_CONFIGS = [
  {
    position: [-7, 3, 7.5] as [number, number, number],
    size: [14, 8, 0.2], // [width, depth, height]
    color: '#F2F2F2' as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-20, 4, 0] as [number, number, number],
    size: [0.2, 10, 15], // [width, depth, height]
    color: '#F2F2F2' as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-10, 4, -7.5] as [number, number, number],
    size: [20, 10, 0.2], // [width, depth, height]
    color: '#F2F2F2' as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [14.5, 4, 7.5] as [number, number, number],
    size: [11, 10, 0.2], // [width, depth, height]
    color: '#F2F2F2' as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [14.5, 4, -7.5] as [number, number, number],
    size: [11, 10, 0.2], // [width, depth, height],
    color: '#F2F2F2' as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [20, 4, 0] as [number, number, number],
    size: [0.2, 10, 15], // [width, depth, height],
    color: '#F2F2F2' as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-20, 4, 8.5] as [number, number, number],
    size: [0.2, 10, 2.2], // [width, depth, height],
    color: '#F2F2F2' as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-14, 3, 8.5] as [number, number, number],
    size: [0.2, 8, 2.2], // [width, depth, height],
    color: '#F2F2F2' as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-10, 4, 9.7] as [number, number, number],
    size: [20, 10, 0.2], // [width, depth, height],
    color: '#F2F2F2' as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [0, 4, 12.05] as [number, number, number],
    size: [4.9, 10, 0.2], // [width, depth, height],
    color: '#F2F2F2' as string,
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },
  {
    position: [0, 3, 8.5] as [number, number, number],
    size: [2.2, 8, 0.2], // [width, depth, height],
    color: '#F2F2F2' as string,
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },
  {
    position: [9, 4, 11] as [number, number, number],
    size: [7.2, 10, 0.2], // [width, depth, height],
    color: '#F2F2F2' as string,
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },
  {
    position: [8.7, 4, 8.9] as [number, number, number],
    size: [3, 10, 0.4], // [width, depth, height],
    color: '#F2F2F2' as string,
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },
  {
    position: [4.5, 4, 14.5] as [number, number, number],
    size: [9.2, 10, 0.2], // [width, depth, height],
    color: '#F2F2F2' as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [4.5,4,-7.5] as [number,number,number],
    size: [9,10,0.2],
    color: '#0e1111',
    rotation: [0,0,0] as [number,number,number]
  }
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
  {
    position: [8.6,1,12] as [number,number,number],
    rotation: [0,Math.PI / 2,0] as [number,number,number]

  }
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
    position: [15.5, 1.5, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
  {
    position: [10.5, 1.5, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
];




export default function LobbyScene() {
  const [playerPosition, setPlayerPosition] = useState<Vector3 | null>(null);
  const [activeNPC, setActiveNPC] = useState<{ id: number; name: string } | null>(null);
  
  // Предзагружаем модели лобби ПОСЛЕ рендера (в useEffect, не в useMemo)
  useEffect(() => {
    preloadLobbyModels()
  }, [])
  const walls = useMemo(
    () =>
      WALL_CONFIGS.map((wall, index) => (
        <RigidBody key={`wall-${index}`} type="fixed" colliders={false}>
          <WallObject
            color={wall.color}
            widthSize={wall.size[0]}
            heightSize={wall.size[1]}
            depthSize={wall.size[2]}
            position={wall.position}
            rotation={wall.rotation}
            receiveShadow={true}
          />
          <CuboidCollider
            args={[wall.size[0] / 2, wall.size[2] / 2, wall.size[1] / 2]}
            position={wall.position}
            rotation={wall.rotation}
          />
        </RigidBody>
      )),
    []
  );
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
          <RigidBody type="fixed" colliders={false}>
            <mesh position={[0,-1,0]} receiveShadow>
              <boxGeometry args={[40,0.1,15]} />
              <meshStandardMaterial color="#E7E2BA" />
            </mesh>
            <mesh position={[-17, -1 , 8.5]} receiveShadow>
                <boxGeometry args={[6, 0.1, 2.5]}/>
                <meshStandardMaterial color="#E7E2BA"/>
            </mesh>
            <mesh position={[4.5,-1,11]} receiveShadow>
                <boxGeometry args={[9,0.1,7]}/>
                <meshStandardMaterial color="#E7E2BA"/>
            </mesh>
            {/* Коллайдеры полов */}
            <CuboidCollider args={[20, 0.05,7.5]} position={[0, -1.05, 0]} />
            <CuboidCollider args={[3, 0.05, 1.25]} position={[-17, -1.05, 8.5]}/>
            <CuboidCollider args={[4.5, 0.05, 3.5]} position={[4.5, -1.05, 11]}/>
          </RigidBody>

          <group>
            <RigidBody type="fixed" colliders={false}>
                <mesh position={[0, 9,0]}>
                  <boxGeometry args={[40,0.1,15]}/>
                  <meshStandardMaterial color="#FFFFFF"/>
                </mesh>
                <mesh position={[-17, 9,8.5]}>
                  <boxGeometry args={[6 ,0.1, 2.5]}/>
                  <meshStandardMaterial color="#FFFFFF"/>
                </mesh>
                <mesh position={[4.5, 9,11]}>
                  <boxGeometry args={[9,0.1,7]}/>
                  <meshStandardMaterial color="#FFFFFF"/>
                </mesh>
                {/* Коллайдеры потолка */}
                <CuboidCollider args={[20, 0.05, 7.5]} position={[0, 9, 0]} />
                <CuboidCollider args={[3, 0.05, 1.25]} position={[-17, 9, 8.5]} />
                <CuboidCollider args={[4.5, 0.05, 3.5]} position={[4.5, 9, 11]} />
            </RigidBody>
          </group>

          {walls}
          {diplomas}
          {doors}

          <RigidBody type="fixed" colliders={false}>
              <SofaObject position={[14,-0.8,-4]} scale={2}/>
              <SofaObject position={[14,-0.8,4]} scale={2} rotation={[0, Math.PI / 1, 0]}/>
              <CuboidCollider args={[1.5, 0.5, 0.8]} position={[14, 0.2, -4]} />
              <CuboidCollider args={[1.5, 0.5, 0.8]} position={[14, 0.2, 4]} />
          </RigidBody>

          <RigidBody type="fixed">
              <CoffeeTableObject scale={2.2} position={[16,-1,-1.2]} rotation={[0, Math.PI / 1, 0]}/>
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
              <ItemRender name="graySofa" scale={1.3} position={[-8, -1, 4.5]}/>
               <CuboidCollider args={[1.2, 0.5,0.8]} position={[-8, 0.25, 4.5]} />
          </RigidBody>

          <RigidBody type="fixed">
              <ChairObject scale={0.023} position={[-7, -0.95, -6]} rotation={[0, Math.PI / 4, 0]}/>
              <CuboidCollider args={[0.4, 0.5, 0.4]} position={[-7, 0.3, -6]} />
          </RigidBody>
          <RigidBody type="fixed">
              <ComputerObject scale={0.0025} position={[-7.5, 1.9, -4.9]} rotation={[0, Math.PI / 1, 0]}/>
          </RigidBody>

          <ItemRender name="InterCome" scale={0.03} position={[-7,2,-7.25]}/>
          <ItemRender name="PaperStack" scale={0.025} position={[-10,0.5,-4.5]} rotation={[0,Math.PI / -4.5,0]}/>
          <ItemRender name="magazineStack" scale={3.5} position={[15,0.35,0]} rotation={[0,Math.PI / -4.5,0]}/>
          <ItemRender name="penaplastLogotype" scale={0.7} position={[-10.8,1.35,-3.6]} rotation={[0,Math.PI / 6,0]}/>
          <ItemRender name="candyBowl" scale={0.0003} position={[-4.8,1.68,-3.6]} rotation={[0,Math.PI / 6,0]}/>
          <ItemRender name="grassCarpet" scale={9} position={[-16,-1,-0.5]}/>
          <RigidBody type="fixed" position={[-16,-0.9,1.5]}>
            <ItemRender name="purpleSofa" scale={5}/>
          </RigidBody>
          <RigidBody type="fixed" position={[-16.5,-0.9,2]}>
            <ItemRender name="yellowSofa" scale={5}/>
          </RigidBody>
          <RigidBody type="fixed">
              <ItemRender name="fireCase" position={[16.5,-2,7.2]} scale={7} rotation={[0,Math.PI / 1,0]}/>
          </RigidBody>
          <RigidBody type="fixed"  position={[-19.5,-1,5]}>
              <ItemRender name="LobbyBanner" scale={1.5} rotation={[0,Math.PI / -20,0]}/>
          </RigidBody>

          <LobbyNPC
            scale={1}
            path="lobby-npc"
            position={[-2.5, -1, -3.5]}
            rotation={[0, Math.PI / -4, 0]}
            npcId={0}
            npcName="Артем"
            playerPosition={playerPosition}
            onInteract={(id, name) => setActiveNPC({ id, name })}
          />
          <OrbitControls />
          <CharacterController
            position={[-16, 0, 7]}
            rotationY={Math.PI / 2}
            onPositionChange={setPlayerPosition}
          />
          </Physics>
        </Suspense>
      </Canvas>
      <GameHud />
      <MissionHud 
        typeOfNPC="Start"
        npcId={activeNPC?.id ?? 0} 
        npcName={activeNPC?.name ?? ''} 
        isOpen={!!activeNPC} 
        onClose={() => setActiveNPC(null)} 
      />
    </section>
  );
}
