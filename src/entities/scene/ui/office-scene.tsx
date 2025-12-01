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
import { Clone, OrbitControls, RoundedBox, useGLTF } from "@react-three/drei";
import { LobbyNPC } from "@/entities/characters/lobby-npc/lobby-npc";
import { Vector3 } from "three";
import MissionHud from "@/widgets/game-hud/ui/mission-hud";
import { TableObject } from "@/entities/objects/ui/table-object";
import OfficeDoorObject from "@/entities/objects/ui/officeDoor-object";
import { WindowFrameObject } from "@/entities/objects/ui/windowFrame-object";



interface WallPosition{
  position: [number, number, number];
  size: [number, number, number];
  collider?: [number, number, number];
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
    position: [-11, -1, 13] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-11, -1, 2.5] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-11, -1, -7.5] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-11, -1, -17.5] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
];

const WALL_POSITION: WallPosition[] = [
  { position: [0, 4, -20], size: [30, 0.3, 10], collider: [20, 4, 0.15], color: '#FFFFFF'},
  { position: [-5.15, 4, 20], size: [20, 0.3, 10], collider: [12.5, 4, 0.15], color: '#FFFFFF'},
  {position: [10, 4, 20], size: [10,0.3,10], collider: [0,0,0], color: '#000000'},
  {position: [-15, 4 ,19.7], size: [0.5, 0.3, 10], collider: [0,0,0], color: '#FFFFFF', rotation: [0,Math.PI / 2,0]},
  {position: [15, 4 ,19.4], size: [1.4, 0.3, 10], collider: [0,0,0], color: '#FFFFFF', rotation: [0,Math.PI / 2,0]},
  {position: [-15, 7.2 , 7], size: [3.6, 0.3, 26], collider: [0,0,0], color: '#FFFFFF', rotation: [Math.PI / 2,Math.PI / 2,0]},
  {position: [15, 7.2 , 9.8], size: [3.6, 0.3, 18.52], collider: [0,0,0], color: '#FFFFFF', rotation: [Math.PI / 2,Math.PI / 2,0]},
  {position: [-19, 4, 20], size: [8, 0.3, 10], color: '#FFFFFF', rotation: [0, 0, 0] },
  {position: [23, 4, 20], size: [16, 0.3, 10], color: '#EFB100', rotation: [0, 0, 0] },

  {position: [30.8, 4, 18.9], size: [2.5, 0.5, 10], color: '#EFB100', rotation: [0, Math.PI / 2, 0] },
  {position: [30.8, 4, 10.1], size: [2.5, 0.5, 10], color: '#EFB100', rotation: [0, Math.PI / 2, 0] },
  {position: [30.8, 0.3, 14.5], size: [2.5, 0.5, 6.5], color: '#EFB100', rotation: [Math.PI / 2, Math.PI / 2, 0] },
  {position: [30.8,7.5,14.5], size: [3,0.5,6.5], color: '#EFB100', rotation: [Math.PI / 2,Math.PI /2, 0]},

  {position: [28.5, 4, 9], size: [5, 0.3, 10], color: '#EFB100', rotation: [0, 0, 0] },
  {position: [26, 4, 1.15], size: [16, 0.3, 10], color: '#EFB100', rotation: [0, Math.PI / 2, 0] },
  {position: [20.95, 4, -7], size: [10.35, 0.3, 10], color: '#EFB100', rotation: [0, 0, 0] },
  {position: [15.7, 4, -3.15], size: [8, 0.15, 10], color: '#FFFFFF', rotation: [0, Math.PI / 2, 0] },
  {position: [15.83, 4, -1.7], size: [10.5, 0.15, 10], color: '#EFB100', rotation: [0, Math.PI / 2, 0] },
  
  
  // Переговорные

  // Стенки между переговорными
  {position: [-19.6, 4, -6.95], size: [6.5, 0.2, 10], collider: [0,0,0], color: '#72de8b', rotation: [0,0,0]},
  {position: [-18.85, 4, -7.15], size: [8, 0.2, 10], collider: [0,0,0], color: '#FFFFFF', rotation: [0,0,0]},

  {position: [-19.6, 4 ,11.69], size: [6.5, 0.175, 10], collider: [0,0,0], color: '#FFFFFF', rotation: [0,0,0]},
  {position: [-19.6, 4 ,11.5], size: [6.5, 0.175, 10], collider: [0,0,0], color: '#193CB8', rotation: [0,0,0]},

  {position: [-19, 4 ,2.68], size: [7.8, 0.2, 10], collider: [0,0,0], color: '#193CB8', rotation: [0,0,0]},
  {position: [-19, 4 ,2.49], size: [7.8, 0.2, 10], collider: [0,0,0], color: '#72de8b', rotation: [0,0,0]},
  {position: [-14.95, 4 ,2.59], size: [0.4, 0.2, 10], collider: [0,0,0], color: '#FFFFFF', rotation: [0,Math.PI / 2,0]},
  
  //Стенки с окнами
  {position: [-22.8, 0.3, 15.8], size: [8.7, 0.3, 2.5], color: '#FFFFFF', rotation: [0, Math.PI / 2, 0] },
  {position: [-22.8, 0.3, 7], size: [9, 0.3, 2.5], color: '#193cb8', rotation: [0, Math.PI / 2, 0] },
  {position: [-22.8, 0.3, -2.26], size: [10, 0.3, 2.5], color: '#72de8b', rotation: [0, Math.PI / 2, 0] },

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
                <mesh position={[3.65,4,11.65]}>
                    <boxGeometry args={[1.5,10,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[-15.6,4,-6.5]}>
                    <boxGeometry args={[1.5,10,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[-15.6,4,11.65]}>
                    <boxGeometry args={[1.5,10,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[3.65,4,-6.5]}>
                    <boxGeometry args={[1.5,10,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[14.4,4,2.02]}>
                    <boxGeometry args={[3,10,3]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="Office-Shelf" scale={3.5} position={[3,-1,9.7]} rotation={[0,Math.PI / 2,0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="trashBucket" scale={0.35} position={[3.4,-0.9,14]} rotation={[0,Math.PI / 2,0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                {/* <ItemRender itemName="trashBucket" scale={0.35} position={[3.4,-0.9,1-6.7]} rotation={[0,Math.PI / 2,0]}/> */}
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="SurpriseGlassWall" scale={[7,8,8]} position={[-15.05, -1, 12.4]} rotation={[0,Math.PI / -2, 0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="ShockGlassWall" scale={[8.1,8,8]} position={[-15.05, -1, 2.75]} rotation={[0,Math.PI / -2, 0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="GlassWall" scale={[8.1,8,8]} position={[-15.05, -1, -5.75]} rotation={[0,Math.PI / -2, 0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="DinerGlassWall" scale={[6.57,6.4,8]} position={[15.05, -1, 16]} rotation={[0,Math.PI / 2, 0]}/>
            </RigidBody>

            {/* Переговорные */}

            <mesh position={[-19,-1,6.4]}>
                <boxGeometry args={[8, 0.1, 27.4]}/>
                <meshStandardMaterial color="#E7E2BA" />
            </mesh>
            <mesh position={[20.5,-1,6.6]}>
                <boxGeometry args={[11, 0.1, 27]}/>
                <meshStandardMaterial color="#E7E2BA" />
            </mesh>

            <mesh position={[28.5,-1,14.5]}>
                <boxGeometry args={[5, 0.1, 11]}/>
                <meshStandardMaterial color="#E7E2BA" />
            </mesh>

            <OfficeDoorObject position={[-21.5,1,19.5]} rotation={[0,0,0]} scale={1}/>
            <ItemRender itemName="MeetingTable" scale={7} rotation={[0, Math.PI / 2,0]} position={[-22,-1,14]}/>
            <ItemRender itemName="MeetingTable" scale={[6,7.5,5]} rotation={[0, 0,0]} position={[-22.5,-1,8]}/>
            <ItemRender itemName="MeetingTable-Black" scale={[5,7.5,4]} rotation={[0, Math.PI / 2,0]} position={[-22.5,-1,4.4]}/>
            <ItemRender itemName="MeetingTable" scale={[5,7.5,5]} rotation={[0, Math.PI / 2,0]} position={[-22.5,-1,0]}/>
            <ItemRender itemName="MeetingTable-Black" scale={[5,7.5,4]} rotation={[0, 0,0]} position={[-22.5,-1,-6.5]}/>

            <group>
              <ItemRender itemName="MeetingChair" scale={2.5} rotation={[0,Math.PI / -2,0]} position={[-20,-0.9,9.5]}/>
              <ItemRender itemName="MeetingChair" scale={2.5} rotation={[0,Math.PI / 1,0]} position={[-21.2,-0.9,5]}/>
              <ItemRender itemName="MeetingChair" scale={2.5} rotation={[0,Math.PI / -7,0]} position={[-20,-0.9,-5.2]}/>
            </group>

              <ItemRender itemName="MeetingSofa" scale={[5,5,7.4]} rotation={[0,Math.PI / 2,0]} position={[-15.1, -1, 2.3]}/>

            <group>
                <WindowFrameObject scale={[20,25,19]} position={[-22.8,1.6,18.8]}/>
                <WindowFrameObject scale={[20,25,19]} position={[-22.8,1.6,16.8]}/>
                <WindowFrameObject scale={[20,25,19]} position={[-22.8,1.6,14.8]}/>
                <WindowFrameObject scale={[20,25,19]} position={[-22.8,1.6,12.8]}/>
                <WindowFrameObject scale={[20,25,19]} position={[-22.75,5.65,18.8]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,25,19]} position={[-22.75,5.65,16.8]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,25,19]} position={[-22.75,5.65,14.8]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,25,19]} position={[-22.75,5.65,12.8]} rotation={[0,0,Math.PI / -5]}/>

                <WindowFrameObject scale={[20,25,20.5]} position={[-22.8,1.6,10.3]}/>
                <WindowFrameObject scale={[20,25,20.5]} position={[-22.8,1.6,8.15]}/>
                <WindowFrameObject scale={[20,25,20.5]} position={[-22.8,1.6,6]}/>
                <WindowFrameObject scale={[20,25,20.5]} position={[-22.8,1.6,3.85]}/>
                <WindowFrameObject scale={[20,25,20.5]} position={[-22.75,5.65,10.3]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,25,20.6]} position={[-22.75,5.65,8.15]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,25,20.5]} position={[-22.75,5.65,6]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,25,20.5]} position={[-22.75,5.65,3.85]} rotation={[0,0,Math.PI / -5]}/>
    
                <WindowFrameObject scale={[20,25,21.5]} position={[-22.8,1.6,1.2]}/>
                <WindowFrameObject scale={[20,25,21.5]} position={[-22.8,1.6,-1.05]}/>
                <WindowFrameObject scale={[20,25,21.5]} position={[-22.8,1.6,-3.3]}/>
                <WindowFrameObject scale={[20,25,21.5]} position={[-22.8,1.6, -5.55]}/>
                <WindowFrameObject scale={[20,25,21.5]} position={[-22.75,5.65,1.2]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,25,21.5]} position={[-22.75,5.65,-1.05]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,25,21.5]} position={[-22.75,5.65,-3.3]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,25,21.5]} position={[-22.75,5.65,-5.55]} rotation={[0,0,Math.PI / -5]}/>
            </group>

            {/* Кухня */}

            <ItemRender itemName="wallTV" scale={3.5} position={[15.5,8,-12.3]} rotation={[0,Math.PI / -2, 0]}/>
            <ItemRender itemName="FourFirecase" scale={[120,120,30]} position={[15.6,0,-3.5]} rotation={[0,Math.PI / -2, 0]}/>

            <ItemRender itemName="HangingLamp" scale={10} position={[21.4, 3, 17]} rotation={[0,Math.PI / -2, 0]}/>
            <ItemRender itemName="HangingLamp" scale={10} position={[22.5, 3, 17]} rotation={[0,Math.PI / -2, 0]}/>
            <ItemRender itemName="HangingLamp" scale={10} position={[23.6, 3, 17]} rotation={[0,Math.PI / -2, 0]}/>
            <ItemRender itemName="HangingLamp" scale={10} position={[24.6, 3, 17]} rotation={[0,Math.PI / -2, 0]}/>

            <ItemRender itemName="DinnerTable" scale={[4.5,4.5,5]} position={[20, -1, 18.2]} rotation={[0,Math.PI / 2,0]}/>

            <group>
              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[21,0.1,18.7]} rotation={[0,Math.PI / -1.6,0]}/>
              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[23,0.1,18.7]} rotation={[0,Math.PI / -1.6,0]}/>
              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[25,0.1,18.7]} rotation={[0,Math.PI / -1.6,0]}/>

              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[21,0.1,15]} rotation={[0,Math.PI / 2.4,0]}/>
              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[23,0.1,15]} rotation={[0,Math.PI / 2.4,0]}/>
              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[25,0.1,15]} rotation={[0,Math.PI / 2.4,0]}/>
              
              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[29,0.1,17]} rotation={[0, 0, 0]}/>
              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[17.5,0.1,17]} rotation={[0, Math.PI / 1.15, 0]}/>

              <RoundedBox args={[1, 6.5, 0.15]} position={[30.6,1.5,14.5]} radius={0.1} smoothness={4} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#C19A6B"/>
              </RoundedBox>
              <ItemRender scale={[4,4,4.15]} itemName="DinnerWindow" position={[31, 1.5, 14.55]} rotation={[0, Math.PI / 1,0]}/>
            </group>

            <ItemRender itemName="DinnerBarTable" scale={[6,5,6.5]} rotation={[0,0,0]} position={[22.5,-1,1]}/>

            <LobbyNPC path="lobby-npc" scale={1.15} position={[13,-1,16]} rotation={[0,Math.PI / -1.5,0]} npcId={1} npcName="Никита" playerPosition={playerPosition} onInteract={(id,name) => setActiveNPC({id,name})}/>
            {/* <CharacterController position={[0,0,0]} rotationY={0} onPositionChange={setPlayerPosition} /> */}
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
