"use client";
import { TableObject } from "@/entities/objects/ui/table-object";
import { Canvas } from "@react-three/fiber";
import "@/shared/lib/preload-models";
import GameHud from "@/widgets/game-hud/ui/game-hud";
import { CharacterController } from "@/entities/characters/third-person-character/character-controller";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  MeshCollider,
} from "@react-three/rapier";
import { Suspense } from "react";
import SceneLoader from "@/shared/ui/Loader/scene-loader";
import FloorTexture from "../../textures/floor-texture";
import WallObject from "@/entities/objects/ui/wall-object";
import { OrbitControls } from "@react-three/drei";


const TABLE_POSITIONS: [number,number,number][] = [
  [-13, 0, 14], [-7, 0, 14], [-1, 0, 14],
  [-13, 0, 4], [-7, 0, 4], [-1, 0, 4],
  [-13, 0, -6], [-7, 0, -6], [-1, 0, -6],
]

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
                <group key={i}>
                    <WallObject 
                      color="#FFFFFF"
                      widthSize={wall.size[0]}
                      heightSize={wall.size[1]}
                      depthSize={wall.size[2]}
                      position={wall.position}
                      recieveShadow={true}
                    />
                    <CuboidCollider args={wall.collider} position={wall.position} />
                </group>
               ))
            }
           </RigidBody>

            {/* Столы */}
            
              {
                TABLE_POSITIONS.map((pos , i) => (
                  <RigidBody key={i} type="fixed">
                    <MeshCollider type="trimesh">
                      <TableObject position={pos} />
                    </MeshCollider>
                  </RigidBody>
                ))
              }
            <CharacterController />
            <OrbitControls />
          </Physics>
        </Suspense>
      </Canvas>
      <GameHud />
    </section>
  );
}
