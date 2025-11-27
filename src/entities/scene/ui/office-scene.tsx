"use client";
import { Canvas } from "@react-three/fiber";
import { preloadOfficeModels } from "@/shared/lib/preload-models";
import GameHud from "@/widgets/game-hud/ui/game-hud";
import { CharacterController } from "@/entities/characters/third-person-character/character-controller";
import {
  Physics,
  RigidBody,
  CuboidCollider,
} from "@react-three/rapier";
import { Suspense, useState, useEffect, useMemo } from "react";
import SceneLoader from "@/shared/ui/Loader/scene-loader";
import WallObject from "@/entities/objects/ui/wall-object";
import { Clone, OrbitControls, useGLTF } from "@react-three/drei";
import { LobbyNPC } from "@/entities/characters/lobby-npc/lobby-npc";
import { Vector3 } from "three";
import MissionHud from "@/widgets/game-hud/ui/mission-hud";
import { TableObject } from "@/entities/objects/ui/table-object";


interface WallPosition{
  position: [number, number, number];
  size: [number, number, number];
  collider: [number, number, number];
  color: string,
  rotation?: [number,number,number]
}

interface TablePosition {
  position: [number,number,number],
  scale: number | [number,number,number],
  rotation?: [number,number,number]
}

const TABLE_POSITIONS: TablePosition[] = [
  {
    position: [-11, -1, 14] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-11, -1, 4] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-11, -1, -6] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-11, -1, -16] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
];

const WALL_POSITION: WallPosition[] = [
  // { position: [15, 4, 0], size: [0.3, 40, 10], collider: [0.15, 4, 5], color: '#FFFFFF'},
  // { position: [-15, 4, 0], size: [0.3, 40, 10], collider: [0.15, 4, 5], color: '#FFFFFF'},
  { position: [0, 4, -20], size: [30, 0.3, 10], collider: [20, 4, 0.15], color: '#FFFFFF'},
  { position: [-5.15, 4, 20], size: [20, 0.3, 10], collider: [12.5, 4, 0.15], color: '#FFFFFF'},
  {position: [10, 4, 20], size: [10,0.3,10], collider: [0,0,0], color: '#000000'},
  {position: [-15, 4 ,19.7], size: [0.5, 0.3, 10], collider: [0,0,0], color: '#FFFFFF', rotation: [0,Math.PI / 2,0]},
  {position: [15, 4 ,19.4], size: [1.4, 0.3, 10], collider: [0,0,0], color: '#FFFFFF', rotation: [0,Math.PI / 2,0]},
  {position: [-15.4, 4 ,4.5], size: [1, 0.3, 10], collider: [0,0,0], color: '#FFFFFF', rotation: [0,0,0]},
  {position: [-15, 7.2 , 8.8], size: [3.6, 0.3, 22.5], collider: [0,0,0], color: '#FFFFFF', rotation: [Math.PI / 2,Math.PI / 2,0]},
  {position: [15, 7.2 , 9.8], size: [3.6, 0.3, 18.52], collider: [0,0,0], color: '#FFFFFF', rotation: [Math.PI / 2,Math.PI / 2,0]},
]

interface OfficeShelfProps{
  position?: [number,number,number],
  scale?: number | [number,number,number],
  rotation?: [number,number,number],
  itemName: string
}

const ItemRender = ({position, scale = 0.1, rotation, itemName}:OfficeShelfProps) => {
  const { scene } = useGLTF(`/model/furniture/${itemName}.glb`) 
  return (
    <group position={position}>
      <Clone object={scene} scale={scale} rotation={rotation} />
    </group>
  );
}

export function OfficeScene() {
  const [playerPosition , setPlayerPosition] = useState<Vector3 | null>(null)
  const [activeNPC, setActiveNPC] = useState<{id: number, name: string} | null>(null)
  
  useEffect(() => {
    preloadOfficeModels()
  }, [])
  
  const tables = useMemo(
    () =>
      TABLE_POSITIONS.map((table, i) => (
        <RigidBody key={i} type="fixed">
          <TableObject
            scale={table.scale}
            rotation={table.rotation}
            position={table.position}
          />
        </RigidBody>
      )),
    []
  );

  const walls = useMemo(() => 
      WALL_POSITION.map((wall, i) => (
            <RigidBody type="fixed" key={i}>
                    <WallObject 
                      rotation={wall.rotation}
                      color={wall.color}
                      widthSize={wall.size[0]}
                      heightSize={wall.size[2]}
                      depthSize={wall.size[1]}
                      position={wall.position}
                      receiveShadow={true}
                    />
          </RigidBody>
      )),
    []
  )

  return (
    <section className="w-full h-screen relative">
      <SceneLoader />
      <Canvas shadows camera={{ position: [0, 1.7, 10], fov: 75 }}>
        <Suspense fallback={null}>
          <Physics gravity={[0, -20, 0]}>
            <color attach="background" args={["#1E1E1E"]} />

            <ambientLight intensity={1} />

            <directionalLight
              position={[10, 10, 5]}
              intensity={1.5}
              castShadow
            />

            {/* Пол (fixed + явный коллайдер) */}
            <RigidBody type="fixed">
              {/* <FloorTexture widthSize={30} heightSize={50} /> */}
              <mesh position={[0,-1,0]}>
                <boxGeometry args={[30,0.1,40]}/>
                <meshStandardMaterial color="#E7E2BA"/>
              </mesh>
              <CuboidCollider args={[15, 0.5, 20]} position={[0, -1.05, 0]} />
            </RigidBody>

            {walls}
            {tables}

            <RigidBody type="fixed">
                <mesh position={[3.65,4,12]}>
                    <boxGeometry args={[1.5,10,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[-15.6,4,-3]}>
                    <boxGeometry args={[1.5,10,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[-15.6,4,12]}>
                    <boxGeometry args={[1.5,10,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[3.65,4,-3]}>
                    <boxGeometry args={[1.5,10,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[14.3,4,2.02]}>
                    <boxGeometry args={[1.5,10,3]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="Office-Shelf" scale={3.5} position={[3,-1,10.05]} rotation={[0,Math.PI / 2,0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="trashBucket" scale={0.35} position={[3.4,-0.9,14.5]} rotation={[0,Math.PI / 2,0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="trashBucket" scale={0.35} position={[3.4,-0.9,1-6]} rotation={[0,Math.PI / 2,0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="SurpriseGlassWall" scale={[6.65,8,8]} position={[-15.05, -1, 12.75]} rotation={[0,Math.PI / -2, 0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="ShockGlassWall" scale={[6.57,8,8]} position={[-15.05, -1, 4.6]} rotation={[0,Math.PI / -2, 0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="GlassWall" scale={[6.57,8,8]} position={[-15.05, -1, -2.27]} rotation={[0,Math.PI / -2, 0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="DinerGlassWall" scale={[6.57,6.4,8]} position={[15.05, -1, 16]} rotation={[0,Math.PI / 2, 0]}/>
            </RigidBody>
            <LobbyNPC path="lobby-npc" scale={1.15} position={[13,-1,16]} rotation={[0,Math.PI / -1.5,0]} npcId={1} npcName="Никита" playerPosition={playerPosition} onInteract={(id,name) => setActiveNPC({id,name})}/>
            <CharacterController position={[0,0,0]} rotationY={0} onPositionChange={setPlayerPosition} />
            <OrbitControls />
          </Physics>
        </Suspense>
      </Canvas>
      <GameHud />
      <MissionHud
        typeOfNPC="Mission"
        npcId={activeNPC?.id ?? 0} 
        npcName={activeNPC?.name ?? ''} 
        isOpen={!!activeNPC} 
        onClose={() => setActiveNPC(null)} 
      />
    </section>
  );
}
