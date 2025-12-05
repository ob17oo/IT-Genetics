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
import CurveWallObject from "@/entities/objects/ui/curve-wall-object";



interface MapItemProps {
  position: [number, number, number];
  size?: [number, number, number];
  collider?: [number, number, number];
  color?: string,
  rotation?: [number,number,number]
  scale?: number | [number,number,number]
}

const TABLE_POSITIONS: MapItemProps[] = [
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
    position: [-11, -1, -19] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [6.8, -1, -19] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-11, -1, -29] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [6.8, -1, -29] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
];

const WALL_POSITION: MapItemProps[] = [
  { position: [-4.35, 4.2, 20], size: [21.5, 0.3, 10.5], collider: [12.5, 4, 0.15], color: '#FFFFFF'},
  {position: [11.88, 4.2, 20], size: [10.95,0.3,10.5], collider: [0,0,0], color: '#000000'},
  {position: [-17.4, 4.2 ,19.7], size: [0.5, 0.3, 10.5], collider: [0,0,0], color: '#FFFFFF', rotation: [0,Math.PI / 2,0]},
  {position: [17.5, 4.2 ,19.4], size: [1.4, 0.3, 10.5], collider: [0,0,0], color: '#FFFFFF', rotation: [0,Math.PI / 2,0]},
  {position: [-17.4, 7.45 , 7], size: [4.05, 0.3, 26], collider: [0,0,0], color: '#FFFFFF', rotation: [Math.PI / 2,Math.PI / 2,0]},
  {position: [17.5, 7.4 , 9.8], size: [4.1, 0.3, 18.52], collider: [0,0,0], color: '#FFFFFF', rotation: [Math.PI / 2,Math.PI / 2,0]},
  {position: [-20.15, 4.2, 20], size: [10.3, 0.3, 10.5], color: '#FFFFFF', rotation: [0, 0, 0] },

  {position: [19.4, 4.2, 20], size: [4, 0.3, 10.5], color: '#EFB100', rotation: [0, 0, 0] },
  {position: [24.5, 4.2, 20.9], size: [6, 0.3, 10.5], color: '#EFB100', rotation: [0, 0, 0] },
  {position: [21.5, 4.2, 20.45], size: [1.2, 0.3, 10.5], color: '#EFB100', rotation: [0, Math.PI / 2, 0] },
  {position: [27.5, 4.2, 20.45], size: [1.2, 0.3, 10.5], color: '#EFB100', rotation: [0, Math.PI / 2, 0] },
  {position: [28.4, 4.2, 20], size: [1.5, 0.3, 10.5], color: '#EFB100', rotation: [0,0, 0] },
  {position: [29, 4.2, 20.45], size: [1.2, 0.3, 10.5], color: '#EFB100', rotation: [0, Math.PI / 2, 0] },
  {position: [30.5, 4.2, 20.9], size: [3, 0.3, 10.5], color: '#EFB100', rotation: [0,0, 0] },

  {position: [31.75 , 4.2, 19.7], size: [2.2, 0.5, 10.5], color: '#EFB100', rotation: [0, Math.PI / 2, 0] },
  {position: [31.75, 4.2, 11.2], size: [2, 0.5, 10.5], color: '#EFB100', rotation: [0, Math.PI / 2, 0] },
  {position: [31.75, 0.3, 15.4], size: [2.5, 0.5, 6.5], color: '#EFB100', rotation: [Math.PI / 2, Math.PI / 2, 0] },
  {position: [31.75,7.85,15.4], size: [3.2,0.5,6.5], color: '#EFB100', rotation: [Math.PI / 2,Math.PI /2, 0]},

  {position: [30.3, 4.2, 10.1], size: [3.4, 0.3, 10.5], color: '#EFB100', rotation: [0, 0, 0] },

  {position: [28.5, 4.2, 2], size: [16.5, 0.3, 10.5], color: '#EFB100', rotation: [0, Math.PI / 2, 0] },

  {position: [23.05, 4.2, -6.3], size: [11.2, 0.3, 10.5], color: '#EFB100', rotation: [0, 0, 0] },
  {position: [17.58, 4.2, -2.95], size: [7, 0.15, 10.5], color: '#EFB100', rotation: [0, Math.PI / 2, 0] },
  {position: [17.428, 4.2, -2.95], size: [7, 0.15, 10.5], color: '#FFFFFF', rotation: [0, Math.PI / 2, 0] },
  
  
  // Переговорные

  // Стенки между переговорными
  {position: [-22, 4.2, -6.95], size: [6.5, 0.2, 10.5], collider: [0,0,0], color: '#72de8b', rotation: [0,0,0]},
  {position: [-21.25, 4.2, -7.15], size: [8, 0.2, 10.5], collider: [0,0,0], color: '#FFFFFF', rotation: [0,0,0]},

  {position: [-22, 4.2 ,11.69], size: [6.5, 0.175, 10.5], collider: [0,0,0], color: '#FFFFFF', rotation: [0,0,0]},
  {position: [-22, 4.2 ,11.5], size: [6.5, 0.175, 10.5], collider: [0,0,0], color: '#193CB8', rotation: [0,0,0]},

  {position: [-21.35, 4.2 ,2.68], size: [7.8, 0.2, 10.5], collider: [0,0,0], color: '#193CB8', rotation: [0,0,0]},
  {position: [-21.35, 4.2,2.49], size: [7.8, 0.2, 10.5], collider: [0,0,0], color: '#72de8b', rotation: [0,0,0]},
  {position: [-17.4, 4.2 ,2.59], size: [0.4, 0.2, 10.5], collider: [0,0,0], color: '#FFFFFF', rotation: [0,Math.PI / 2,0]},
  
  //Стенки с окнами
  {position: [-25.1, 0.3, 15.8], size: [8.7, 0.3, 2.5], color: '#FFFFFF', rotation: [0, Math.PI / 2, 0] },
  {position: [-25.1, 0.3, 7], size: [9, 0.3, 2.5], color: '#193cb8', rotation: [0, Math.PI / 2, 0] },
  {position: [-25.1, 0.3, -2.26], size: [10, 0.3, 2.5], color: '#72de8b', rotation: [0, Math.PI / 2, 0] },

  //Задняяя часть

  {position: [-19, 0.3, -11.7], size: [9,0.3, 2.5], color: '#FFFFFF', rotation: [0,Math.PI / 2, 0]},
  {position: [-19, 5.5, -15.77], size: [0.85, 0.3, 7.9], color: '#FFFFFF', rotation: [0, Math.PI / 2, 0]},
  {position: [3, 5.5, -33.8], size: [0.85, 0.3, 7.9], color: '#FFFFFF', rotation: [0, 0, 0]},

  {position: [7, 0.3, -33.8], size: [9,0.3, 2.5], color: '#FFFFFF', rotation: [0,0, 0]},
  
  {position: [11.4, 0.3, -36.65], size: [6,0.3, 2.5], color: '#FFFFFF', rotation: [0,Math.PI / 2, 0]},
  {position: [18.7, 0.3, -39.75], size: [14.9,0.3, 2.5], color: '#FFFFFF', rotation: [0,0, 0]},
  {position: [26, 0.3, -36.65], size: [6,0.3, 2.5], color: '#FFFFFF', rotation: [0,Math.PI / 2, 0]},



  {position: [26, 4.2, -25.05], size: [17.8,0.3, 10.5], color: '#FFFFFF', rotation: [0,Math.PI / 2, 0]},

]

const WINDOW_POSITIONS: MapItemProps[] = [
  {
    position: [-19.8, 1.6, -17],
    rotation: [0, 0.6, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-20.84, 1.6, -18.8],
    rotation: [0, 0.45, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-21.61, 1.6, -20.75],
    rotation: [0, 0.30, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-22.07, 1.6, -22.79],
    rotation: [0, 0.15, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-22.23, 1.6, -24.87],
    rotation: [0, 0, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-22.08, 1.6, -26.95],
    rotation: [0, -0.15, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-21.62, 1.6, -28.99],
    rotation: [0, -0.3, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-20.85, 1.6, -30.94],
    rotation: [0, -0.45, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-19.8, 1.6, -32.75],
    rotation: [0, -0.6, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-18.5, 1.6, -34.38],
    rotation: [0, -0.75, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-16.98, 1.6, -35.79],
    rotation: [0, -0.9, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-15.26, 1.6, -36.97],
    rotation: [0, -1.05, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-13.37, 1.6, -37.87],
    rotation: [0, -1.2, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-11.37, 1.6, -38.48],
    rotation: [0, -1.35, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-9.31, 1.6, -38.79],
    rotation: [0, -1.5, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-7.23, 1.6, -38.8],
    rotation: [0, -1.65, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-5.17, 1.6, -38.48],
    rotation: [0, -1.8, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-3.17, 1.6, -37.85],
    rotation: [0, -1.95, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-1.29, 1.6, -36.93],
    rotation: [0, -2.1, 0],
    scale: [20, 25, 19]
  },
  {
    position: [0.44, 1.6, -35.75],
    rotation: [0, -2.25, 0],
    scale: [20, 25, 19]
  },
  {
    position: [1.9, 1.6, -34.4],
    rotation: [0, -2.4, 0],
    scale: [20, 25, 18.5]
  },
  
  //Верхняя часть

  {
    position: [-19.8, 5.5, -17],
    rotation: [0, 0.6, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-20.84, 5.5, -18.8],
    rotation: [0, 0.45, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-21.61, 5.5, -20.75],
    rotation: [0, 0.30, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-22.07, 5.5, -22.79],
    rotation: [0, 0.15, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-22.23, 5.5, -24.87],
    rotation: [0, 0, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-22.08, 5.5, -26.95],
    rotation: [0, -0.15, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-21.62, 5.5, -28.99],
    rotation: [0, -0.3, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-20.85, 5.5, -30.94],
    rotation: [0, -0.45, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-19.8, 5.5, -32.75],
    rotation: [0, -0.6, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-18.5, 5.5, -34.38],
    rotation: [0, -0.75, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-16.98, 5.5, -35.79],
    rotation: [0, -0.9, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-15.26, 5.5, -36.97],
    rotation: [0, -1.05, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-13.37, 5.5, -37.87],
    rotation: [0, -1.2, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-11.37, 5.5, -38.48],
    rotation: [0, -1.35, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-9.31, 5.5, -38.79],
    rotation: [0, -1.5, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-7.23, 5.5, -38.8],
    rotation: [0, -1.65, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-5.17, 5.5, -38.48],
    rotation: [0, -1.8, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-3.17, 5.5, -37.85],
    rotation: [0, -1.95, 0],
    scale: [20, 25, 19]
  },
  {
    position: [-1.29, 5.5, -36.93],
    rotation: [0, -2.1, 0],
    scale: [20, 25, 19]
  },
  {
    position: [0.44, 5.5, -35.75],
    rotation: [0, -2.25, 0],
    scale: [20, 25, 19]
  },
  {
    position: [1.9, 5.5, -34.4],
    rotation: [0, -2.4, 0],
    scale: [20, 25, 18.5]
  }
];

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
                      color={wall.color || '#FFFFFF'}
                      widthSize={wall.size?.[0] || 1}
                      heightSize={wall.size?.[2] || 1}
                      depthSize={wall.size?.[1] || 1}
                      position={wall.position}
                      receiveShadow={true}
                    />
          </RigidBody>
      )),
    []
  )


  const windowCircle = useMemo(
    () =>
      WINDOW_POSITIONS.map((window, i) => (
        <RigidBody key={i} type="fixed">
          <WindowFrameObject
            rotation={window.rotation}
            scale={window.scale}
            position={window.position}
          />
        </RigidBody>
      )),
    []
  );

  return (
    <section className="w-full h-screen relative">
      <SceneLoader />
      <Canvas shadows camera={{ position: [0, 1.7, 10], fov: 75 }}>
        <Suspense fallback={null}>
          <Physics gravity={[0, -20, 0]}>
            <color attach="background" args={["#1E1E1E"]} />

            <ambientLight intensity={0.8} />

            <directionalLight
              position={[5, 7, 0]}
              intensity={1.5}
              shadow-mapSize={[512,512]}
              shadow-camera-far={50}
              castShadow
            />

            {/* Пол (fixed + явный коллайдер) */}
            <RigidBody type="fixed">
              {/* <FloorTexture widthSize={30} heightSize={50} /> */}
              <mesh position={[0,-1,0]}>
                <boxGeometry args={[35,0.1,40]}/>
                <meshStandardMaterial color="#E7E2BA"/>
              </mesh>
              <CuboidCollider args={[15, 0.5, 20]} position={[0, -1.05, 0]} />
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
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[-18,4.2,-6.5]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[-18,4.2,11.65]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[3.65,4.2,-6.5]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>

            <RigidBody type="fixed">
                <mesh position={[3.65,4.2,-19]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[-18,4.2,-19]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>

            <RigidBody type="fixed">
                <mesh position={[3.65,4.2,-30]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>

            <RigidBody type="fixed">
                <mesh position={[3.65,4.2,-32]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[-18,4.2,-32]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>



            <RigidBody type="fixed">
                <mesh position={[17,4.2,2.02]}>
                    <boxGeometry args={[3,10.5,3]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>


            <RigidBody type="fixed">
                <mesh position={[26,4.2,-19]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
                    <meshStandardMaterial color="#FFFFFFF"/>
                </mesh>
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[26,4.2,-32]}>
                    <boxGeometry args={[1.5,10.5,1.5]}/>
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
                <ItemRender itemName="SurpriseGlassWall" scale={[7,8,8]} position={[-17.5, -1, 12.4]} rotation={[0,Math.PI / -2, 0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="ShockGlassWall" scale={[8.1,8,8]} position={[-17.5, -1, 2.75]} rotation={[0,Math.PI / -2, 0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="GlassWall" scale={[8.1,8,8]} position={[-17.5, -1, -5.75]} rotation={[0,Math.PI / -2, 0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <ItemRender itemName="DinnerGlassWall" scale={[6.57,6.4,8]} position={[17.6, -1, 16]} rotation={[0,Math.PI / 2, 0]}/>
            </RigidBody>

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

            <group>
                <WindowFrameObject color="Black" scale={[20,28,19]} position={[-25.1,1.6,18.8]}/>
                <WindowFrameObject scale={[20,28,19]} position={[-25.1,1.6,16.8]}/>
                <WindowFrameObject scale={[20,28,19]} position={[-25.1,1.6,14.8]}/>
                <WindowFrameObject scale={[20,28,19]} position={[-25.1,1.6,12.8]}/>
                <WindowFrameObject color="Black" scale={[20,27.5,19]} position={[-25.05,6,18.8]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,27.5,19]} position={[-25.05,6,16.8]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,27.5,19]} position={[-25.05,6,14.8]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,27.5,19]} position={[-25.05,6,12.8]} rotation={[0,0,Math.PI / -5]}/>

                <WindowFrameObject color="Black" scale={[20,28,20.5]} position={[-25.1,1.6,10.3]}/>
                <WindowFrameObject scale={[20,28,20.5]} position={[-25.1,1.6,8.15]}/>
                <WindowFrameObject scale={[20,28,20.5]} position={[-25.1,1.6,6]}/>
                <WindowFrameObject scale={[20,28,20.5]} position={[-25.1,1.6,3.85]}/>
                <WindowFrameObject color="Black" scale={[20,27.5,20.5]} position={[-25.05,6,10.3]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,27.5,20.6]} position={[-25.05,6,8.15]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,27.5,20.5]} position={[-25.05,6,6]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,27.5,20.5]} position={[-25.05,6,3.85]} rotation={[0,0,Math.PI / -5]}/>
    
                <WindowFrameObject color="Black" scale={[20,28,21.5]} position={[-25.1,1.6,1.2]}/>
                <WindowFrameObject scale={[20,28,21.5]} position={[-25.1,1.6,-1.05]}/>
                <WindowFrameObject scale={[20,28,21.5]} position={[-25.1,1.6,-3.3]}/>
                <WindowFrameObject color="Black" scale={[20,28,21.5]} position={[-25.1,1.6, -5.55]}/>
                <WindowFrameObject color="Black" scale={[20,27.5,21.5]} position={[-25.05,6,1.2]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,27.5,21.5]} position={[-25.05,6,-1.05]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject scale={[20,27.5,21.5]} position={[-25.05,6,-3.3]} rotation={[0,0,Math.PI / -5]}/>
                <WindowFrameObject color="Black" scale={[20,27.5,21.5]} position={[-25.05,6,-5.55]} rotation={[0,0,Math.PI / -5]}/>
            </group>

            {/* Кухня */}

            <ItemRender itemName="wallTV" scale={3.5} position={[17.1,8,-12.3]} rotation={[0,Math.PI / -2, 0]}/>
            <ItemRender itemName="FourFirecase" scale={[120,120,30]} position={[17.4,0,-3.5]} rotation={[0,Math.PI / -2, 0]}/>

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


            <ItemRender itemName="Fridge" scale={[0.3,0.3,0.3]} rotation={[0,0,0]} position={[18.7,-1,-5]}/>

            {/* Задняя часть */}

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
                    <boxGeometry args={[22,0.1,5]}/>
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

            <group>
                <WindowFrameObject color="Black" scale={[20,25, 19]} position={[-19,1.6,-8.3]}/>
                <WindowFrameObject color="Black" scale={[20,25, 19]} position={[-19,1.6,-10.3]}/>
                <WindowFrameObject color="Black" scale={[20,25, 19]} position={[-19,1.6,-12.3]}/>
                <WindowFrameObject color="Black" scale={[20,25, 19]} position={[-19,1.6,-14.3]}/>

                <WindowFrameObject color="Black" scale={[20,25, 19]} position={[-19,5.5,-8.3]}/>
                <WindowFrameObject color="Black" scale={[20,25, 19]} position={[-19,5.5,-10.3]}/>
                <WindowFrameObject color="Black" scale={[20,25, 19]} position={[-19,5.5,-12.3]}/>
                <WindowFrameObject color="Black" scale={[20,25, 19]} position={[-19,5.5,-14.3]}/>
            </group>
            
            {windowCircle}

            <group>
              <WindowFrameObject color="Black" scale={[20,25,19]} position={[4.5,1.6,-33.8]} rotation={[0, Math.PI / 2, 0]}/>
              <WindowFrameObject color="Black" scale={[20,25,19]} position={[6.5,1.6,-33.8]} rotation={[0, Math.PI / 2, 0]}/>
              <WindowFrameObject color="Black" scale={[20,25,19]} position={[8.5,1.6,-33.8]} rotation={[0, Math.PI / 2, 0]}/>
              <WindowFrameObject color="Black" scale={[20,25,19]} position={[10.5,1.6,-33.8]} rotation={[0, Math.PI / 2, 0]}/>

              <WindowFrameObject color="White" scale={[20,25,19]} position={[11.4,1.6,-34.8]} rotation={[0, 0, 0]}/>
              <WindowFrameObject color="White" scale={[20,25,19]} position={[11.4,1.6,-36.8]} rotation={[0, 0, 0]}/>
              <WindowFrameObject color="White" scale={[20,25,19]} position={[11.4,1.6,-38.8]} rotation={[0, 0, 0]}/>
              <WindowFrameObject color="White" scale={[20,25,19]} position={[11.4,5.5,-34.8]} rotation={[0, 0, 0]}/>
              <WindowFrameObject color="White" scale={[20,25,19]} position={[11.4,5.5,-36.8]} rotation={[0, 0, 0]}/>
              <WindowFrameObject color="White" scale={[20,25,19]} position={[11.4,5.5,-38.8]} rotation={[0, 0, 0]}/>
              
              <WindowFrameObject color="Black" scale={[20,28,19]} position={[12.5,1.6,-39.75]} rotation={[0, Math.PI / 2, 0]}/>
              <WindowFrameObject color="White" scale={[20,28,19]} position={[14.5,1.6,-39.75]} rotation={[0, Math.PI / 2, 0]}/>
              <WindowFrameObject color="White" scale={[20,28,19]} position={[16.5,1.6,-39.75]} rotation={[0, Math.PI / 2, 0]}/>
              <WindowFrameObject color="White" scale={[20,28,19]} position={[18.5,1.6,-39.75]} rotation={[0, Math.PI / 2, 0]}/>
              <WindowFrameObject color="White" scale={[20,28,19]} position={[20.5,1.6,-39.75]} rotation={[0, Math.PI / 2, 0]}/>
              <WindowFrameObject color="White" scale={[20,28,19]} position={[22.5,1.6,-39.75]} rotation={[0, Math.PI / 2, 0]}/>
              <WindowFrameObject color="Black" scale={[20,28,21.5]} position={[24.72,1.6,-39.75]} rotation={[0, Math.PI / 2, 0]}/>
              <WindowFrameObject color="Black" scale={[20,27.5,19]} position={[12.5,6,-39.75]} rotation={[0, Math.PI / 2, Math.PI / 5]}/>
              <WindowFrameObject color="White" scale={[20,27.5,19]} position={[14.5,6,-39.75]} rotation={[0, Math.PI / 2, Math.PI / 5]}/>
              <WindowFrameObject color="White" scale={[20,27.5,19]} position={[16.5,6,-39.75]} rotation={[0, Math.PI / 2, Math.PI / 5]}/>
              <WindowFrameObject color="White" scale={[20,27.5,19]} position={[18.5,6,-39.75]} rotation={[0, Math.PI / 2, Math.PI / 5]}/>
              <WindowFrameObject color="White" scale={[20,27.5,19]} position={[20.5,6,-39.75]} rotation={[0, Math.PI / 2, Math.PI / 5]}/>
              <WindowFrameObject color="White" scale={[20,27.5,19]} position={[22.5,6,-39.75]} rotation={[0, Math.PI / 2, Math.PI / 5]}/>
              <WindowFrameObject color="Black" scale={[20,27.5,21.5]} position={[24.72,6,-39.75]} rotation={[0, Math.PI / 2, Math.PI / 5]}/>

              <WindowFrameObject color="White" scale={[20,25,19]} position={[26,1.6,-34.8]} rotation={[0, 0, 0]}/>
              <WindowFrameObject color="White" scale={[20,25,19]} position={[26,1.6,-36.8]} rotation={[0, 0, 0]}/>
              <WindowFrameObject color="White" scale={[20,25,19]} position={[26,1.6,-38.8]} rotation={[0, 0, 0]}/>
              <WindowFrameObject color="White" scale={[20,25,19]} position={[26,5.5,-34.8]} rotation={[0, 0, 0]}/>
              <WindowFrameObject color="White" scale={[20,25,19]} position={[26,5.5,-36.8]} rotation={[0, 0, 0]}/>
              <WindowFrameObject color="White" scale={[20,25,19]} position={[26,5.5,-38.8]} rotation={[0, 0, 0]}/>

              
              <WindowFrameObject color="Black" scale={[20,25,19]} position={[4.5,5.5,-33.8]} rotation={[0, Math.PI / 2, 0]}/>
              <WindowFrameObject color="Black" scale={[20,25,19]} position={[6.5,5.5,-33.8]} rotation={[0, Math.PI / 2, 0]}/>
              <WindowFrameObject color="Black" scale={[20,25,19]} position={[8.5,5.5,-33.8]} rotation={[0, Math.PI / 2, 0]}/>
              <WindowFrameObject color="Black" scale={[20,25,19]} position={[10.5,5.5,-33.8]} rotation={[0, Math.PI / 2, 0]}/>

            </group>

            <RigidBody type="fixed" position={[18.7,-1,-36.8]}>
                  <mesh>
                      <boxGeometry args={[15,0.1,6]}/>
                      <meshStandardMaterial color="#E7E2BA"/>
                  </mesh>
            </RigidBody>

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
