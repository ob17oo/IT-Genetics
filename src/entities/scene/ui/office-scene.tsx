'use client'
import { TableObject } from "@/entities/objects/ui/table-object";
import { Canvas } from "@react-three/fiber";
import "@/shared/lib/preload-models";
import GameHud from "@/widgets/game-hud/ui/game-hud";
import { CharacterController } from "@/entities/characters/third-person-character/character-controller";
import { Physics, RigidBody, CuboidCollider, MeshCollider } from "@react-three/rapier";
import { Suspense } from "react";
import SceneLoader from "@/shared/ui/Loader/scene-loader";

export function OfficeScene(){
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
                intensity={2}
                castShadow
              />

              {/* Пол (fixed + явный коллайдер) */}
              <RigidBody type="fixed">
                <mesh
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[0, -1, 0]}
                  receiveShadow
                  userData={{ isFloor: true }}
                >
                  <planeGeometry args={[40, 80]} />
                  <meshStandardMaterial color="#986B41" />
                </mesh>
                {/* halfExtents: [width/2, thickness/2, depth/2] */}
                <CuboidCollider args={[20, 0.1, 40]} position={[0, -1, 0]} />
              </RigidBody>

              {/* Стена справа */}
              <RigidBody type="fixed">
                <mesh rotation={[0, 0, 0]} position={[15, 4, 0]} receiveShadow>
                  <boxGeometry args={[0.3, 10, 40]} />
                  <meshStandardMaterial color="#E8E8E8" />
                </mesh>
                <CuboidCollider args={[0.15, 5, 20]} position={[15, 4, 0]} />
              </RigidBody>
              {/* Стена слева */}
              <RigidBody type="fixed">
                <mesh rotation={[0, 0, 0]} position={[-20, 4, 0]} receiveShadow>
                  <boxGeometry args={[0.3, 10, 40]} />
                  <meshStandardMaterial color="#E8E8E8" />
                </mesh>
                <CuboidCollider args={[0.15, 5, 20]} position={[-20, 4, 0]} />
              </RigidBody>
              {/* Задняя стена */}
              <RigidBody type="fixed">
                <mesh rotation={[0, 0, 0]} position={[0, 4, -20]} receiveShadow>
                  <boxGeometry args={[40, 10, 0.3]} />
                  <meshStandardMaterial color="#E8E8E8" />
                </mesh>
                <CuboidCollider args={[20, 5, 0.15]} position={[0, 4, -20]} />
              </RigidBody>

              {/* Передняя стена (дальняя) */}
              <RigidBody type="fixed">
                <mesh position={[-7.6, 4, 20]} receiveShadow>
                  <boxGeometry args={[25, 10, 0.3]} />
                  <meshStandardMaterial color="#E8E8E8" />
                </mesh>
                <CuboidCollider
                  args={[12.5, 5, 0.15]}
                  position={[-7.6, 4, 20]}
                />
              </RigidBody>

              <group>
                <group>
                  <RigidBody type="fixed">
                    <MeshCollider type="trimesh">
                      <TableObject position={[-13, 0, 14]} />
                    </MeshCollider>
                  </RigidBody>
                  <RigidBody type="fixed">
                    <MeshCollider type="trimesh">
                      <TableObject position={[-7, 0, 14]} />
                    </MeshCollider>
                  </RigidBody>
                  <RigidBody type="fixed">
                    <MeshCollider type="trimesh">
                      <TableObject position={[-1, 0, 14]} />
                    </MeshCollider>
                  </RigidBody>
                </group>
                <group>
                  <RigidBody type="fixed">
                    <MeshCollider type="trimesh">
                      <TableObject position={[-13, 0, 4]} />
                    </MeshCollider>
                  </RigidBody>
                  <RigidBody type="fixed">
                    <MeshCollider type="trimesh">
                      <TableObject position={[-7, 0, 4]} />
                    </MeshCollider>
                  </RigidBody>
                  <RigidBody type="fixed">
                    <MeshCollider type="trimesh">
                      <TableObject position={[-1, 0, 4]} />
                    </MeshCollider>
                  </RigidBody>
                </group>
                <group>
                  <RigidBody type="fixed">
                    <MeshCollider type="trimesh">
                      <TableObject position={[-13, 0, -6]} />
                    </MeshCollider>
                  </RigidBody>
                  <RigidBody type="fixed">
                    <MeshCollider type="trimesh">
                      <TableObject position={[-7, 0, -6]} />
                    </MeshCollider>
                  </RigidBody>
                  <RigidBody type="fixed">
                    <MeshCollider type="trimesh">
                      <TableObject position={[-1, 0, -6]} />
                    </MeshCollider>
                  </RigidBody>
                </group>
              </group>
              <CharacterController />
            </Physics>
          </Suspense>
        </Canvas>
        <GameHud />
      </section>
    );
}