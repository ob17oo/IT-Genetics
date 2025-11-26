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
import { Suspense, useState, useEffect } from "react";
import SceneLoader from "@/shared/ui/Loader/scene-loader";
import FloorTexture from "../../textures/floor-texture";
import WallObject from "@/entities/objects/ui/wall-object";
import { OrbitControls } from "@react-three/drei";
import { LobbyNPC } from "@/entities/characters/lobby-npc/lobby-npc";
import { Vector3 } from "three";
import MissionHud from "@/widgets/game-hud/ui/mission-hud";


interface WallPosition{
  position: [number, number, number];
  size: [number, number, number];
  collider: [number, number, number];
}

const WALL_POSITION: WallPosition[] = [
  { position: [20, 4, 0], size: [0.3, 50, 10], collider: [0.15, 4, 5] },
  { position: [-20, 4, 0], size: [0.3, 50, 10], collider: [0.15, 4, 5] },
  { position: [0, 4, -25], size: [40, 0.3, 10], collider: [20, 4, 0.15] },
  { position: [-7.6, 4, 25], size: [25, 0.3, 10], collider: [12.5, 4, 0.15] },
]

export function OfficeScene() {
  const [playerPosition , setPlayerPosition] = useState<Vector3 | null>(null)
  const [activeNPC, setActiveNPC] = useState<{id: number, name: string} | null>(null)
  
  // Предзагружаем модели офиса ПОСЛЕ рендера (в useEffect, не в useMemo)
  useEffect(() => {
    preloadOfficeModels()
  }, [])
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
              <FloorTexture widthSize={40} heightSize={50} />
              <CuboidCollider args={[20, 0.5, 25]} position={[0, -25, 0]} />
            </RigidBody>

           <RigidBody type="fixed">
            {
               WALL_POSITION.map((wall, i) => (
                <RigidBody type="fixed" key={i}>
                    <WallObject 
                      color="#FFFFFF"
                      widthSize={wall.size[0]}
                      heightSize={wall.size[2]}
                      depthSize={wall.size[1]}
                      position={wall.position}
                      receiveShadow={true}
                    />
                </RigidBody>
               ))
            }
           </RigidBody>

            {/* Столы */}
{/*             
              {
                TABLE_POSITIONS.map((pos , i) => (
                  <RigidBody key={i} type="fixed">
                    <MeshCollider type="trimesh">
                      <TableObject position={pos} />
                    </MeshCollider>
                  </RigidBody>
                ))
              } */}
              <LobbyNPC path="lobby-npc" scale={1} position={[2,-1,2]} rotation={[0,0,0]} npcId={1} npcName="Никита" playerPosition={playerPosition} onInteract={(id,name) => setActiveNPC({id,name})}/>
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
