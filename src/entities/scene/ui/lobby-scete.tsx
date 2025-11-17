'use client'

import OfficeDoorObject from "@/entities/objects/ui/officeDoor-object";
import WalletObject from "@/entities/objects/ui/wall-object";
import FloorTexture from "@/entities/textures/floor-texture";
import { OrbitControls, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense } from "react";
import { BooleanKeyframeTrack } from "three";

export default function LobbyScene(){
    return (
        <section className="w-full h-screen relative">
            <Canvas shadows camera={{position: [0 , 5 ,10], fov: 75}}>
                <Suspense>
                    <Physics gravity={[0, -20,0]}>
                        <color attach="backgroud" args={['#1E1E1E']} />
                        <ambientLight intensity={1} />
                        <directionalLight 
                        position={[10,10,5]} 
                        intensity={1.5}
                        castShadow
                        />

                        <RigidBody type="fixed">
                            <FloorTexture widthSize={70} heightSize={40} />
                        </RigidBody>
                        
                        <RigidBody type="fixed">
                            <WalletObject widthSize={20} heightSize={40} depthSize={0.3} color="#FFFFFF" rotation={[0 ,0, Math.PI /2]} position={[35,9,0]} recieveShadow={true} />
                        </RigidBody>
                        <RigidBody type="fixed">
                            <WalletObject widthSize={20} heightSize={40} depthSize={0.3} color="#FFFFFF" rotation={[0 ,0, Math.PI /2]} position={[-35,9,0]} recieveShadow={true} />
                        </RigidBody>
                        <RigidBody type="fixed">
                            <WalletObject widthSize={50} heightSize={20} depthSize={0.3} color="#FFFFFF" rotation={[Math.PI / 2 ,0, 0]} position={[-10,9,-20]} recieveShadow={true} />
                        </RigidBody>
                        <Text position={[-8.5, 10, -19.8]} fontSize={4} color="green" rotation={[0, 0, 0]}>CHULAKOV</Text>
                        <OfficeDoorObject position={[-30,3,-20.3]} scale={2.5} />
                        <RigidBody type="fixed">
                            <group position={[-8,0,-8]}>
                                <mesh position={[0,1.5,0]} rotation={[0,0,0]} >
                                    <boxGeometry args={[25, 6, 1]} />
                                    <meshStandardMaterial color="yellow" />
                                </mesh>
                                <mesh rotation={[Math.PI  / 2, 0,0]} position={[0, 3, -2.2]}>
                                    <boxGeometry args={[23.5,5,0.5]} />
                                    <meshStandardMaterial color="black" />
                                </mesh>
                                <mesh rotation={[0,Math.PI /2,0]} position={[-12.3,1.5,-2.2]}>
                                    <boxGeometry args={[5,6,1]} />
                                    <meshStandardMaterial color="yellow" />
                                </mesh>
                                <mesh rotation={[0,Math.PI /2,0]} position={[12.3,1.5,-2.2]}>
                                    <boxGeometry args={[5,6,1]} />
                                    <meshStandardMaterial color="yellow" />
                                </mesh>
                            </group>
                        </RigidBody>
                        
                    </Physics>
                </Suspense>
                <OrbitControls />
            </Canvas>
        </section> 
    )
}