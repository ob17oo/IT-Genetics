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
import { Clone, OrbitControls, RoundedBox, Stats, useTexture } from "@react-three/drei";
import { LobbyNPC } from "@/entities/characters/lobby-npc/lobby-npc";
import MissionHud from "@/widgets/game-hud/ui/mission-hud";
import { TableObject } from "@/entities/objects/ui/table-object";
import OfficeDoorObject from "@/entities/objects/ui/officeDoor-object";
import CurveWallObject from "@/entities/objects/ui/curve-wall-object";
import { Vector3 } from "three";
import { useCachedModel } from "@/hooks/useCachedModel";
import { InstancedWindow } from "@/entities/objects/ui/instanced-window";

import { TABLE_POSITIONS,WALL_POSITION,WINDOW_POSITIONS } from "@/shared/config/office-scene-config"
import OlegChulakovObject from "@/entities/objects/ui/OlegChulakov-object";
import CurvedCurtainObject from "@/entities/objects/ui/curve-curtains-object";

import MissionIndicator from "@/widgets/game-hud/ui/mission-indicator";

interface OfficeShelfProps{
  position?: [number,number,number],
  scale?: number | [number,number,number],
  rotation?: [number,number,number],
  itemName: string
}

const ItemRender = ({position, scale = 0.1, rotation, itemName}:OfficeShelfProps) => {
  const scene = useCachedModel(`/model/furniture/${itemName}.glb`) 
  return (
    <group position={position}>
      <Clone object={scene} scale={scale} rotation={rotation} />
    </group>
  );
}

interface WallStickerProps {
  position: [number,number,number],
  args: [number,number],
  stickerURL: string,
  rotation: [number,number,number],
  opacity: number
}

const WallSticker = ({position,rotation,stickerURL,args, opacity}: WallStickerProps) => {
  const texture = useTexture(stickerURL)
  return (
    <mesh position={position} rotation={rotation}>
        <planeGeometry args={args}/>
        <meshStandardMaterial 
          map={texture}
          opacity={opacity}
          transparent
        />
    </mesh>
  )
}

export function OfficeScene() {
  const [playerPosition , setPlayerPosition] = useState<Vector3 | null>(null)
  const [activeNPC, setActiveNPC] = useState<{id: number, name: string} | null>(null)
  const [activeMission, setActiveMission] = useState<{missionId: number} | null>(null)
  
  useEffect(() => {
    preloadOfficeModels()
  }, [])
  
   const walls = useMemo(() => (
        <RigidBody type="fixed">
            {WALL_POSITION.map((wall,i) => (
              <group key={i}>
                <WallObject 
                    rotation={wall.rotation}
                    color={wall.color || '#FFFFFF'}
                    widthSize={wall.size?.[0] || 1}
                    heightSize={wall.size?.[2] || 1}
                    depthSize={wall.size?.[1] || 1}
                    position={wall.position}
                    receiveShadow={true}
                />
              </group>
            ))}
        </RigidBody>
      ),[]
   );

  const tables = useMemo(() => (
    // <RigidBody type="fixed">
    <>
        {TABLE_POSITIONS.map((table,i) => (
          <group key={i}>
              <TableObject 
                position={table.position}
                rotation={table.rotation}
                scale={table.scale}
                />
              <CuboidCollider 
                args={[8,0.1,2]}
                position={[-5.2,0.8,2.5]}
                />
          </group>
        ))}
      </>
    // {/* </RigidBody> */}
  ),[])


  return (
    <section className="w-full h-screen relative">
      <SceneLoader />
      <Canvas shadows camera={{ position: [0, 1.7, 10], fov: 75 }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          alpha: false
        }}
        dpr={[1,1.5]}
        performance={{
          min: 0.5,
          max: 1,
          debounce: 200
        }}
        frameloop="demand"
      >
        <Stats />
        <Suspense fallback={null}>
          <Physics
          gravity={[0, -20, 0]}
          timeStep={1/60}
          maxCcdSubsteps={1}
          >
            <color attach="background" args={["#1E1E1E"]} />

            <ambientLight intensity={0.8} />

            <directionalLight
              position={[5, 7, 0]}
              intensity={1.5}
              shadow-mapSize={[2048,2048]}
              shadow-camera-far={50}
              shadow-camera-left={-30}
              shadow-camera-right={30}
              shadow-camera-top={30}
              shadow-camera-bottom={-30}
              shadow-bias={-0.0001}
              castShadow
            />

            {/* Пол (fixed + явный коллайдер) */}
            <RigidBody type="fixed">
              {/* <FloorTexture widthSize={30} heightSize={50} /> */}
              <mesh position={[0,-1,0]}>
                <boxGeometry args={[35,0.1,40]}/>
                <meshStandardMaterial color="#E7E2BA"/>
              </mesh>
            </RigidBody>

            <RigidBody type="fixed">
                <mesh position={[0,-1,-26.9]}>
                    <boxGeometry args={[43,0.1,13.8]}/>
                    <meshStandardMaterial color="#E7E2BA"/>
                </mesh>
            </RigidBody>

            {walls}
            {tables}

            <RigidBody type="fixed">
                <mesh position={[3.65,4.2,11.65]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[-18,4.2,-6.5]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[-18,4.2,11.65]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[3.65,4.2,-6.5]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFF"/>
                </mesh>
            </RigidBody>

            <RigidBody type="fixed">
                <mesh position={[3.65,4.2,-19]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[-18,4.2,-19]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFF"/>
                </mesh>
            </RigidBody>

            <RigidBody type="fixed">
                <mesh position={[3.65,4.2,-30]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFF"/>
                </mesh>
            </RigidBody>

            <RigidBody type="fixed">
                <mesh position={[3.65,4.2,-32]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[-18,4.2,-32]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFF"/>
                </mesh>
            </RigidBody>



            <RigidBody type="fixed">
                <mesh position={[17,4.2,2.02]}>
                    <boxGeometry args={[3,10.5,3]}/>
                    <meshStandardMaterial color="#FFFFFF"/>
                </mesh>
            </RigidBody>


            <RigidBody type="fixed">
                <mesh position={[26,4.2,-19]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[26,4.2,-32]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFF"/>
                </mesh>
            </RigidBody>
            
            <RigidBody type="fixed">
                <ItemRender itemName="Office-Shelf" scale={3.5} position={[3,-1,9.7]} rotation={[0,Math.PI / 2,0]}/>
            </RigidBody>


            <RigidBody type="fixed">
                <ItemRender itemName="trashBucket" scale={0.35} position={[3.4,-0.9,14]} rotation={[0,Math.PI / 2,0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="trashBucket" scale={0.35} position={[3.4,-0.9,1-8.8]} rotation={[0,Math.PI / 2,0]}/>
            </RigidBody>

            <ItemRender itemName="SurpriseGlassWall" scale={[7,8,8]} position={[-17.5, -1, 12.4]} rotation={[0,Math.PI / -2, 0]}/>
            <CuboidCollider args={[3.5,3,0.1]} position={[-17.5,2,15.9]} rotation={[0,Math.PI / 2, 0]}/>

  
            <ItemRender itemName="ShockGlassWall" scale={[8.1,8,8]} position={[-17.5, -1, 2.75]} rotation={[0,Math.PI / -2, 0]}/>
            <CuboidCollider args={[4.3,3,0.1]} position={[-17.5,2,7]} rotation={[0,Math.PI / 2, 0]}/>
            
            <WallSticker position={[-17.2,5.4,7]} rotation={[0,Math.PI / 2,0]} args={[8,8]} stickerURL="/textures/flashTexture.png" opacity={1}/>


            <ItemRender itemName="GlassWall" scale={[8.1,8,8]} position={[-17.5, -1, -5.75]} rotation={[0,Math.PI / -2, 0]}/>
            <CuboidCollider args={[4.3,3,0.1]} position={[-17.5,2,-2]} rotation={[0,Math.PI / 2, 0]}/>

            <WallSticker position={[-17.2,5.2,-2.5]} rotation={[Math.PI / -1.1,Math.PI / 2,0]} args={[8,8]} stickerURL="/textures/bubbleTexture.png" opacity={0.7}/>


            <ItemRender itemName="DinnerGlassWall" scale={[6.57,6.4,8]} position={[17.6, -1, 16]} rotation={[0,Math.PI / 2, 0]}/>
            <CuboidCollider args={[7.5,3,0.1]} position={[17.5,2,11.1]} rotation={[0,Math.PI / 2, 0]}/>

            {/* Переговорные */}

            <mesh position={[-21,-1,6.4]}>
                <boxGeometry args={[8, 0.1, 27.4]}/>
                <meshStandardMaterial color="#E7E2BA" />
            </mesh>
            <mesh position={[23,-1,6.6]}>
                <boxGeometry args={[11, 0.1, 27]}/>
                <meshStandardMaterial color="#E7E2BA" />
            </mesh>

            <mesh position={[30.25,-1,15.5]}>
                <boxGeometry args={[3.5, 0.1, 11]}/>
                <meshStandardMaterial color="#E7E2BA" />
            </mesh>

            <mesh position={[24.5,-1,20.5]}>
                <boxGeometry args={[6, 0.1, 1]}/>
                <meshStandardMaterial color="#E7E2BA" />
            </mesh>

            <OfficeDoorObject position={[-23.5,1,19.6]} rotation={[0,0,0]} scale={1}/>
            <ItemRender itemName="MeetingTable" scale={7} rotation={[0, Math.PI / 2,0]} position={[-24.5,-1,14]}/>
            <ItemRender itemName="MeetingTable" scale={[6,7.5,5]} rotation={[0, 0,0]} position={[-25,-1,8]}/>
            <ItemRender itemName="MeetingTable-Black" scale={[5,7.5,4]} rotation={[0, Math.PI / 2,0]} position={[-24.6,-1,4.4]}/>
            <ItemRender itemName="MeetingTable" scale={[5,7.5,5]} rotation={[0, Math.PI / 2,0]} position={[-24.5,-1,0]}/>
            <ItemRender itemName="MeetingTable-Black" scale={[5,7.5,4]} rotation={[0, 0,0]} position={[-24.6,-1,-6.5]}/>

            <group>
              <ItemRender itemName="MeetingChair" scale={2.5} rotation={[0,Math.PI / -2,0]} position={[-22.5,-0.9,9.5]}/>
              <ItemRender itemName="MeetingChair" scale={2.5} rotation={[0,Math.PI / 1,0]} position={[-23.4,-0.9,5]}/>
              <ItemRender itemName="MeetingChair" scale={2.5} rotation={[0,Math.PI / -7,0]} position={[-22.3,-0.9,-5.2]}/>
            </group>

              <ItemRender itemName="MeetingSofa" scale={[5,5,7.4]} rotation={[0,Math.PI / 2,0]} position={[-17.5, -1, 2.3]}/>


            {/* Кухня */}
            <ItemRender itemName="wallTV" scale={3.5} position={[17.1,8,-12]} rotation={[0,Math.PI / -2, 0]}/>
            <ItemRender itemName="FourFireCase" scale={[120,120,30]} position={[17.4,0,-3.5]} rotation={[0,Math.PI / -2, 0]}/>
            <ItemRender itemName="flower/flowerTall" scale={0.009} position={[16,-0.5,-0.3]} rotation={[0,0,0]}/>
            <ItemRender itemName="flower/flowerPalm" scale={2} position={[16.4,-0.92,5]} rotation={[0,0,0]}/>
            <ItemRender itemName="flower/flowerRhyzome" scale={1.5} position={[16,-0.9,7]} rotation={[0,0,0]}/>


            <ItemRender itemName="HangingLamp" scale={10} position={[22.7, 3, 17]} rotation={[0,Math.PI / -2, 0]}/>
            <ItemRender itemName="HangingLamp" scale={10} position={[23.8, 3, 17]} rotation={[0,Math.PI / -2, 0]}/>
            <ItemRender itemName="HangingLamp" scale={10} position={[24.9, 3, 17]} rotation={[0,Math.PI / -2, 0]}/>
            <ItemRender itemName="HangingLamp" scale={10} position={[26, 3, 17]} rotation={[0,Math.PI / -2, 0]}/>

            <ItemRender itemName="DinnerTable" scale={[4.5,4.5,4.5]} position={[22, -1, 18.2]} rotation={[0,Math.PI / 2,0]}/>

            <group>
              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[22.5,0.1,18.7]} rotation={[0,Math.PI / -1.6,0]}/>
              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[24.5,0.1,18.7]} rotation={[0,Math.PI / -1.6,0]}/>
              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[26.5,0.1,18.7]} rotation={[0,Math.PI / -1.6,0]}/>

              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[22.5,0.1,15]} rotation={[0,Math.PI / 2.4,0]}/>
              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[24.5,0.1,15]} rotation={[0,Math.PI / 2.4,0]}/>
              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[26.5,0.1,15]} rotation={[0,Math.PI / 2.4,0]}/>
              
              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[30,0.1,17]} rotation={[0, 0, 0]}/>
              <ItemRender itemName="DinnerChair" scale={[3.5,3.3,3.5]} position={[20.3,0.1,17]} rotation={[0, Math.PI / 1.15, 0]}/>

              <RoundedBox args={[1, 6.8, 0.15]} position={[31.6,1.5,15.5]} radius={0.1} smoothness={4} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#C19A6B"/>
              </RoundedBox>
              <ItemRender scale={[4,4.2,4.3]} itemName="DinnerWindow" position={[31.8, 1.5, 15.5]} rotation={[0, Math.PI / 1,0]}/>
              <ItemRender itemName="Radiator" scale={[2,2,2]} rotation={[0,Math.PI / -2,0]} position={[31.2,-0.6,15.5]}/>
              <ItemRender itemName="WaterStand" scale={[1.5,1.5,1.5]} rotation={[0,Math.PI / -1.5,0]} position={[31,-0.85,10.8]}/>
            </group>

            <group>
              <ItemRender itemName="Hexagon-Yellow" scale={[30,30,30]} position={[28.5,2,8.5]} rotation={[Math.PI / 2,0,Math.PI / 2]}/>
              <ItemRender itemName="Hexagon-Black" scale={[22,22,22]} position={[28.5,1.3,6.95]} rotation={[Math.PI / 2,0,Math.PI / 2]}/>
              <ItemRender itemName="Hexagon-Yellow" scale={[30,30,30]} position={[28.5,2,5.45]} rotation={[Math.PI / 2,0,Math.PI / 2]}/>
              <ItemRender itemName="Hexagon-Yellow" scale={[19,19,19]} position={[28.5, 4,6.95]} rotation={[Math.PI / 2,0,Math.PI / 2]}/>

              <ItemRender itemName="Hexagon-Yellow" scale={[30,30,30]} position={[26.2, 3, 21]} rotation={[Math.PI / -2,0,0]}/>
              <ItemRender itemName="Hexagon-Black" scale={[30,30,30]} position={[26.2, 1.2, 21]} rotation={[Math.PI / -2,0,0]}/>
              <ItemRender itemName="Hexagon-Yellow" scale={[30,30,30]} position={[24.4, 2.1, 21]} rotation={[Math.PI / -2,0,0]}/>
            </group>

            <ItemRender itemName="DinnerBarTable" scale={[7,6.5,7]} rotation={[0,0,0]} position={[24.2,-1,2]}/>
            <group>
                <ItemRender itemName="DinnerBarChair-Black" scale={[1.7,1.7,1.7]} rotation={[0,Math.PI / 2,0]} position={[23, 0.75, 8]}/>
                <ItemRender itemName="DinnerBarChair-Yellow" scale={[1.7,1.7,1.7]} rotation={[0,Math.PI / 2,0]} position={[23, 0.75, 6]}/>
                <ItemRender itemName="DinnerBarChair-Black" scale={[1.7,1.7,1.7]} rotation={[0,Math.PI / 1.5,0]} position={[23, 0.75, 4]}/>

                <ItemRender itemName="DinnerBarChair-Black" scale={[1.7,1.7,1.7]} rotation={[0,Math.PI / -2,0]} position={[26.5, 0.75, 8]}/>
                <ItemRender itemName="DinnerBarChair-Yellow" scale={[1.7,1.7,1.7]} rotation={[0,Math.PI / -2,0]} position={[26.5, 0.75, 6]}/>
                <ItemRender itemName="DinnerBarChair-Black" scale={[1.7,1.7,1.7]} rotation={[0,Math.PI / -2,0]} position={[26.5, 0.75, 4]}/>
            </group>


            <ItemRender itemName="Fridge" scale={[0.4,0.3,0.4]} rotation={[0,0,0]} position={[19,-1,-4.5]}/>
            <ItemRender itemName="KitchenCabinets" scale={[3.6,2.8,3]} rotation={[0,0,0]} position={[23.4,-1,-5]}/>

            {/* Задняя часть */}

            <ItemRender itemName="WhiteBoard" position={[-5,-0.8,-35]} scale={1.2} rotation={[0,Math.PI / 2,0]}/>

            <RigidBody type="fixed" position={[-19.5,-1,-9.8]}>
                <mesh>
                    <boxGeometry args={[4,0.1,20.4]}/>
                    <meshStandardMaterial color="#E7E2BA"/>
                </mesh>
            </RigidBody>

            <RigidBody type="fixed" position={[-22,-1,-25]}>
                <mesh>
                    <boxGeometry args={[1,0.1,9]}/>
                    <meshStandardMaterial color="#E7E2BA"/>
                </mesh>

            </RigidBody>
            <RigidBody type="fixed" position={[-8,-1,-36.3]}>
                <mesh>
                    <boxGeometry args={[22,0.1,5.2]}/>
                    <meshStandardMaterial color="#E7E2BA"/>
                </mesh>
            </RigidBody>

            <RigidBody type="fixed" position={[21.75,-1,-13.45]}>
                <mesh>
                    <boxGeometry args={[8.5,0.1,13.1]}/>
                    <meshStandardMaterial color="#E7E2BA"/>
                </mesh>
            </RigidBody>

            <RigidBody type="fixed" position={[23.75,-1,-26.9]}>
                <mesh>
                    <boxGeometry args={[4.5,0.1,13.8]}/>
                    <meshStandardMaterial color="#E7E2BA"/>
                </mesh>
            </RigidBody>

            <ItemRender itemName="WaterCooler" scale={0.3} position={[-17.5,-1,-17]} rotation={[0,Math.PI / -2,0]}/>

            <ItemRender itemName="armChair" scale={5} position={[-18,-1,-21]} rotation={[0,Math.PI / 1.5,0]}/>
            <ItemRender itemName="poengChair" scale={0.05} position={[-20,-0.5,-27]} rotation={[0,Math.PI / 0.55,0]}/>
            <ItemRender itemName="bagChair" scale={2.5} position={[-18,-1,-29.5]} rotation={[0,Math.PI / 2,0]}/>

             <CurveWallObject 
              radius={14}          // Глубина = 20 (узкий овал)
              depth={0}
              height={2.5}
              arcAngle={Math.PI / 1}
              startAngle={0}
              position={[-8.2, 0.3, -24.9]}
              rotation={[0, Math.PI / 1.4, 0]}
              color="#FFFFFF"
            />

            <CurvedCurtainObject
              radius={13}
              height={10}
              position={[-8.2,4.3,-24.9]}
              rotation={[0,Math.PI / 1.4, 0]}
              color="#FCD12A"
              segments={64}
              foldCount={6}
            />

            
            <InstancedWindow instances={WINDOW_POSITIONS.map((window) => ({
              position: window.position,
              rotation: window.rotation,
              scale: window.scale,
              color: window.color
            }))}/>

            <ItemRender itemName="Closet" scale={[2,3,2]} position={[25,2,-35]} rotation={[0,Math.PI / 1,0]}/>

            <RigidBody type="fixed" position={[18.7,-1,-36.8]}>
                  <mesh>
                      <boxGeometry args={[15,0.1,6]}/>
                      <meshStandardMaterial color="#E7E2BA"/>
                  </mesh>
            </RigidBody>

            {/* Коридор */}

            <RigidBody type="fixed" position={[46.5,-1,-11.5]}>
                <mesh>
                    <boxGeometry args={[42,0.1, 9.5]}/>
                    <meshStandardMaterial color="#E7E2BA"/>
                </mesh>
            </RigidBody>

            <RigidBody type="fixed" position={[42,-1, -4.7]}>
                <mesh>
                    <boxGeometry args={[27,0.1, 4.2]}/>
                    <meshStandardMaterial color="#E7E2BA"/>
                </mesh>
            </RigidBody>

            {/* Кабинет Олега */}

            <mesh position={[46,-1,-28]}>
                <boxGeometry args={[43,0.1,23.9]}/>
                <meshStandardMaterial color="#E7E2BA"/>
            </mesh>

            <ItemRender itemName="OlegGlassWall" scale={[11.2,11,10]} rotation={[0,Math.PI / 1,0]} position={[28.8, -1, -16.3]}/>
            <CuboidCollider args={[5,3,0.1]} position={[31.1,2,-16.3]} rotation={[0, 0, 0]}/>

            <ItemRender itemName="Office-Chair" scale={0.025} position={[27.5,-0.9,-25.7]} rotation={[0,Math.PI / 2,0]}/>
            <ItemRender itemName="Office-Gray-Chair" scale={2} position={[29.5,-0.9,-29.5]} rotation={[0,0,0]}/>
            <ItemRender itemName="Office-Gray-Chair" scale={2} position={[32,-0.9,-25.7]} rotation={[0,Math.PI / -2,0]}/>
            <ItemRender itemName="Office-Gray-Chair" scale={2} position={[29.5,-0.9,-22.5]} rotation={[0,Math.PI / -1,0]}/>
            <ItemRender itemName="Egg-Chair" scale={2.5} position={[35,-1.5,-18]} rotation={[0,Math.PI  / -1.5,0]}/>

            <ItemRender itemName="OlegTable" scale={4} position={[29,-0.9,-15]} rotation={[0,Math.PI / 2,0]}/>

            <OlegChulakovObject />

            <mesh position={[36.3, 4.2,-26.5]} rotation={[Math.PI / 1,0, Math.PI / 2]}>
                <boxGeometry args={[10.5, 0.1,12]}/>
                <meshPhysicalMaterial color="#F0F0F0" transmission={0.7} roughness={0.05} side={2}/>
            </mesh>


            {/*Большая переговорная*/}

            <ItemRender itemName="OrangeGlassWall" scale={[11,11,11]} rotation={[0,Math.PI / 1,0]} position={[38.4,-1,-16.3]}/>
            <CuboidCollider args={[9.5,3,0.1]} position={[46,2,-16.3]} rotation={[0, 0, 0]}/>            


            <ItemRender itemName="MainMeetingTable" scale={[3,4,4]} rotation={[0,0,0]} position={[44.8,-1,-26]}/>

            <ItemRender itemName="Office-Gray-Chair" scale={2} rotation={[0,Math.PI / 1,0]} position={[54,-0.9,-24]}/>
            <ItemRender itemName="Office-Gray-Chair" scale={2} rotation={[0,Math.PI / 1,0]} position={[52,-0.9,-24]}/>
            <ItemRender itemName="Office-Gray-Chair" scale={2} rotation={[0,Math.PI / 1,0]} position={[49.2,-0.9,-24]}/>
            <ItemRender itemName="Office-Gray-Chair" scale={2} rotation={[0,Math.PI / 1,0]} position={[46.5,-0.9,-24]}/>
            <ItemRender itemName="Office-Gray-Chair" scale={2} rotation={[0,Math.PI / 1,0]} position={[44.5,-0.9,-24]}/>

            <ItemRender itemName="Office-Gray-Chair" scale={2} rotation={[0,Math.PI / 2,0]} position={[42.4,-0.9,-25]}/>
            <ItemRender itemName="Office-Gray-Chair" scale={2} rotation={[0,Math.PI / 2,0]} position={[42.4,-0.9,-27]}/>
            <ItemRender itemName="Office-Gray-Chair" scale={2} rotation={[0,Math.PI / 2,0]} position={[42.4,-0.9,-29]}/>
            <ItemRender itemName="Office-Gray-Chair" scale={2} rotation={[0,Math.PI / 2,0]} position={[42.4,-0.9,-31]}/>
          
            <ItemRender itemName="Office-Gray-Chair" scale={2} rotation={[0,0,0]} position={[54,-0.9,-32]}/>
            <ItemRender itemName="Office-Gray-Chair" scale={2} rotation={[0,0,0]} position={[52,-0.9,-32]}/>
            <ItemRender itemName="Office-Gray-Chair" scale={2} rotation={[0,0,0]} position={[49.2,-0.9,-32]}/>
            <ItemRender itemName="Office-Gray-Chair" scale={2} rotation={[0,0,0]} position={[46.5,-0.9,-32]}/>
            <ItemRender itemName="Office-Gray-Chair" scale={2} rotation={[0,0,0]} position={[44.5,-0.9,-32]}/>

            <ItemRender itemName="wallTV" scale={[4.5,4.5,4.5]} rotation={[0,Math.PI / -2,0]} position={[55,7,-39.4]}/>

            {/* Игровая */}

            <ItemRender itemName="RageGlassWall" scale={[11,11,11]} rotation={[0, Math.PI / 2, 0]} position={[55.5, -1, -5.7]}/>
            <CuboidCollider args={[3,3,0.1]} position={[55.5,2,-12.7]} rotation={[0, Math.PI / 2, 0]}/>

            <ItemRender itemName="PingPongTable" scale={[3,2.5,3]} rotation={[0, Math.PI /2, 0]} position={[61.5,-1,-30]}/>

            {/* <LobbyNPC path="lobby-npc" scale={1.25} position={[13,-1,16]} rotation={[0,Math.PI / -1.5,0]} npcId={1} npcName="Никита" playerPosition={playerPosition} onInteract={(id,name) => setActiveNPC({id,name})}/> */}
            <CharacterController position={[10,0,15]} rotationY={Math.PI / 1} onPositionChange={setPlayerPosition} />
            <OrbitControls />
            <MissionIndicator key="mission-1" playerPosition={playerPosition} missionId={1} missionPosition={[10,1.5,15]} onInteract={(missionId) => setActiveMission({missionId})}/>
            <MissionIndicator key="mission-2" playerPosition={playerPosition} missionId={2} missionPosition={[10,1.5,10]} onInteract={(missionId) => setActiveMission({missionId})}/>
          </Physics>
        </Suspense>
      </Canvas>
      <GameHud />
      <MissionHud
        type="NPC-Mission"
        npcId={activeNPC?.id ?? 0} 
        npcName={activeNPC?.name ?? ''} 
        isOpen={!!activeNPC} 
        onClose={() => setActiveNPC(null)} 
      />
      <MissionHud
        type="Mission"
        missionId={activeMission?.missionId ?? 0}
        isOpen={!!activeMission} 
        onClose={() => setActiveMission(null)} 
      />
    </section>
  );
}
