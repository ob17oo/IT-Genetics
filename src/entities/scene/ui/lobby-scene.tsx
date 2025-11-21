"use client";

import { CharacterController } from "@/entities/characters/third-person-character/character-controller";
import { AdminTableObject } from "@/entities/objects/ui/adminTable-object";
import { ChairObject } from "@/entities/objects/ui/chair-object";
import { CoffeeTableObject } from "@/entities/objects/ui/coffeeTable-object";
import { ComputerObject } from "@/entities/objects/ui/computer-object";
import { LogotypeObject } from "@/entities/objects/ui/logotype-object";
import OfficeDoorObject from "@/entities/objects/ui/officeDoor-object";
import { SofaObject } from "@/entities/objects/ui/sofa-object";
import WalletObject from "@/entities/objects/ui/wall-object";
import GameHud from "@/widgets/game-hud/ui/game-hud";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { Suspense } from "react";

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

export default function LobbyScene() {
  return (
    <section className="w-full h-screen relative">
      <Canvas shadows camera={{ position: [0, 1.7, 10], fov: 75 }}>
        <Suspense>
          <Physics gravity={[0, -20, 0]}>
            <color attach="backgroud" args={["#1E1E1E"]} />
            <ambientLight intensity={1} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.5}
              castShadow
            />
            {/*Пол*/}
            <RigidBody position={[0, -1, 0]} type="fixed">
              {/* <FloorTexture widthSize={50} heightSize={20} /> */}
              <mesh>
                <boxGeometry args={[40, 0.1, 15]} />
                <meshStandardMaterial color="#E7E2BA" />
              </mesh>
              <CuboidCollider args={[20, 0.5, 25]} position={[0, -25, 0]} />
            </RigidBody>

            {/*Стенка для гардероба*/}
            <RigidBody type="fixed">
              <WalletObject
                color="F2F2F2"
                widthSize={14}
                heightSize={0.2}
                depthSize={10}
                position={[-7, 4, 7.5]}
                recieveShadow={true}
              />
            </RigidBody>
            {/*Стенкя с окнами*/}
            <RigidBody type="fixed">
              <WalletObject
                color="F2F2F2"
                widthSize={0.2}
                heightSize={15}
                depthSize={10}
                position={[-20, 4, 0]}
                recieveShadow={true}
              />
            </RigidBody>
            {/*Стенкя с логотипом*/}
            <RigidBody type="fixed">
              <WalletObject
                color="F2F2F2"
                widthSize={20}
                heightSize={0.2}
                depthSize={10}
                position={[-10, 4, -7.5]}
                recieveShadow={true}
              />
            </RigidBody>
            {/*Стенкя с грамотами*/}
            <RigidBody type="fixed">
              <WalletObject
                color="F2F2F2"
                widthSize={11}
                heightSize={0.2}
                depthSize={10}
                position={[14.5, 4, 7.5]}
                recieveShadow={true}
              />
            </RigidBody>
            {/*Стенкя напротив грамот*/}
            <RigidBody type="fixed">
              <WalletObject
                color="F2F2F2"
                widthSize={11}
                heightSize={0.2}
                depthSize={10}
                position={[14.5, 4, -7.5]}
                recieveShadow={true}
              />
            </RigidBody>
            {/*Стенкя напротив окон*/}
            <RigidBody type="fixed">
              <WalletObject
                color="F2F2F2"
                widthSize={0.2}
                heightSize={15}
                depthSize={10}
                position={[20, 4, 0]}
                recieveShadow={true}
              />
            </RigidBody>
            {/*Пол для входа*/}
            <RigidBody position={[-17, -1, 8.5]} type="fixed">
              {/* <FloorTexture widthSize={6.5} heightSize={5} /> */}
              <mesh>
                <boxGeometry args={[6, 0.1, 2.5]} />
                <meshStandardMaterial color="#E7E2BA" />
              </mesh>
              <CuboidCollider args={[0, 0, 0]} position={[0, -25, 0]} />
            </RigidBody>
            {/*Стенка слева от входа*/}
            <RigidBody type="fixed">
              <WalletObject
                color="F2F2F2"
                widthSize={0.2}
                heightSize={2.2}
                depthSize={10}
                position={[-20, 4, 8.5]}
                recieveShadow={true}
              />
            </RigidBody>
            {/*Стенка справа от входа*/}
            <RigidBody type="fixed">
              <WalletObject
                color="F2F2F2"
                widthSize={0.2}
                heightSize={2.2}
                depthSize={10}
                position={[-14, 4, 8.5]}
                recieveShadow={true}
              />
            </RigidBody>
            {/*Стенка входной двери*/}
            <RigidBody type="fixed">
              <WalletObject
                color="F2F2F2"
                widthSize={6.2}
                heightSize={0.2}
                depthSize={10}
                position={[-17, 4, 9.7]}
                recieveShadow={true}
              />
            </RigidBody>

            <OfficeDoorObject position={[-17, 1, -7.7]} scale={1} />
            <OfficeDoorObject position={[-17, 1, 9.3]} scale={1} />
            <OfficeDoorObject position={[-11, 1, 7.1]} scale={1} />
            <OfficeDoorObject position={[-3, 1, 7.1]} scale={1} />
            <OfficeDoorObject
              position={[19.6, 1, 0]}
              scale={1}
              rotation={[0, Math.PI / 2, 0]}
            />
            {/* <CharacterController /> */}

            <RigidBody type="fixed" position={[4.5, -1, 11]}>
              <mesh>
                <boxGeometry args={[9, 0.1, 7]} />
                <meshStandardMaterial color="#E7E2BA" />
              </mesh>
            </RigidBody>
            <RigidBody type="fixed">
              <WalletObject
                color="F2F2F2"
                widthSize={7.2}
                heightSize={0.2}
                depthSize={10}
                position={[0, 4, 11]}
                rotation={[0, Math.PI / 2, 0]}
                recieveShadow={true}
              />
            </RigidBody>
            <RigidBody type="fixed">
              <WalletObject
                color="F2F2F2"
                widthSize={7.2}
                heightSize={0.2}
                depthSize={10}
                position={[9, 4, 11]}
                rotation={[0, Math.PI / 2, 0]}
                recieveShadow={true}
              />
            </RigidBody>
            <RigidBody type="fixed">
              <WalletObject
                color="F2F2F2"
                widthSize={9.2}
                heightSize={0.2}
                depthSize={10}
                position={[4.5, 4, 14.5]}
                rotation={[0, 0, 0]}
                recieveShadow={true}
              />
            </RigidBody>

            <RigidBody type="fixed">
                <SofaObject position={[14, -0.8,-4]} scale={2} />
            </RigidBody>
            <RigidBody  type="fixed"> 
                <SofaObject rotation={[0,Math.PI / 1,0]} position={[14,-0.8,4]} scale={2}/>
            </RigidBody>
            <OrbitControls />
            <RigidBody>
                <CoffeeTableObject scale={0.3} position={[15,0,-0.5]} rotation={[0, Math.PI / 2 , 0]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <LogotypeObject scale={20} position={[-7.5,3.2,-7.3]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <AdminTableObject scale={7} position={[-11,-1,-4]} />
            </RigidBody>
            <RigidBody type="fixed">
                <LobbySofa scale={7} rotation={[0,0,0]} position={[-8,-1,4.5]} />
            </RigidBody>
            <RigidBody type="fixed">
                <ChairObject scale={0.023} position={[-7,-0.95,-6]} rotation={[0,Math.PI / 4,0]} />
            </RigidBody>
            <RigidBody type="fixed">
                <ComputerObject scale={0.0025} position={[-7.5,1.9,-4.9]} rotation={[0,Math.PI /1,0]} />
            </RigidBody>
            {/* <CharacterController position={[0,0,0]} /> */}
          </Physics>
        </Suspense>
      </Canvas>
      <GameHud />
    </section>
  );
}
