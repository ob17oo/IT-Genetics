"use client";
import { useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export default function OlegChulakovObject() {
  const texture = useTexture("/static/OlegChulakov.jpg");

  return (
    <RigidBody type="fixed">
      <mesh position={[26.2, 4.2, -25.5]} rotation={[Math.PI / -2, 0, Math.PI / 2]}>
        <boxGeometry args={[11.5, 0.1, 10.5]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </RigidBody>
  );
}
