"use client";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { CylinderGeometry, DoubleSide } from "three";

interface CurvedCurtainProps {
  radius?: number;
  height: number;
  depth?: number;
  startAngle?: number;
  arcAngle?: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  segments?: number;
  foldCount?: number;
  material?: "cloth" | "velvet" | "silk";
  withPhysics?: boolean;
  showRod?: boolean;
  showHem?: boolean;
}

export default function CurvedCurtainObject({
  radius = 10,
  height = 10,
  depth = 0.05,
  startAngle = 0,
  arcAngle = Math.PI,
  position,
  rotation,
  color = "#FFFFFF",
  segments = 64,
  foldCount = 8,
  material = "cloth",
  withPhysics = false,
  showRod = false,
  showHem = false,
}: CurvedCurtainProps) {
  // Геометрия шторы
  const curtainGeometry = useMemo(() => {
    // CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
    return new CylinderGeometry(
      radius + depth / 2, // radiusTop
      radius - depth / 2, // radiusBottom
      height, // height
      segments, // radialSegments
      8, // heightSegments - для плавности
      true, // openEnded - БЕЗ крышек
      startAngle,
      arcAngle
    );
  }, [radius, depth, height, segments, startAngle, arcAngle]);

  // Модифицируем геометрию для создания складок
  const foldedGeometry = useMemo(() => {
    const geometry = curtainGeometry.clone();
    const positionAttribute = geometry.getAttribute("position");
    const vertexCount = positionAttribute.count;

    for (let i = 0; i < vertexCount; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);

      const angle = Math.atan2(z, x);
      const foldAmplitude = 0.03 * radius;

      const verticalWave = Math.sin((y / height) * Math.PI * 4) * 0.01;
      const horizontalWave = Math.sin(angle * foldCount * 2) * foldAmplitude;

      const distance = Math.sqrt(x * x + z * z);
      const normalX = x / distance;
      const normalZ = z / distance;

      const newX = x + normalX * (horizontalWave + verticalWave);
      const newZ = z + normalZ * (horizontalWave + verticalWave);

      positionAttribute.setXYZ(i, newX, y, newZ);
    }

    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
  }, [curtainGeometry, radius, height, foldCount]);

  // Материал для шторы (полностью непрозрачный, без текстуры)
  const curtainMaterial = useMemo(() => {
    const baseProps = {
      side: DoubleSide,
      transparent: false,
      opacity: 1.0,
      depthWrite: true,
      color: color,
    };

    // Настройки для разных типов ткани
    switch (material) {
      case "velvet":
        return {
          ...baseProps,
          roughness: 0.8,
          metalness: 0.1,
        };
      case "silk":
        return {
          ...baseProps,
          roughness: 0.2,
          metalness: 0.1,
          sheen: 0.5,
          sheenRoughness: 0.3,
          sheenColor: "#ffffff",
        };
      case "cloth":
      default:
        return {
          ...baseProps,
          roughness: 0.7,
          metalness: 0,
        };
    }
  }, [color, material]);

  // Карниз
  const curtainRod = useMemo(() => {
    if (!showRod) return null;

    return (
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius + 0.05, radius + 0.05, 0.1, 32]} />
        <meshStandardMaterial color="#8B4513" metalness={0.5} roughness={0.3} />
      </mesh>
    );
  }, [showRod, radius, height]);

  // Утяжеленная часть
  const curtainHem = useMemo(() => {
    if (!showHem) return null;

    return (
      <mesh position={[0, -height / 2 + 0.05, 0]}>
        <cylinderGeometry args={[radius + 0.02, radius + 0.02, 0.1, 32]} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.8} />
      </mesh>
    );
  }, [showHem, radius, height, color]);

  const curtainContent = (
    <group>
      <mesh geometry={foldedGeometry} receiveShadow castShadow>
        <meshStandardMaterial {...curtainMaterial} />
      </mesh>
      {curtainRod}
      {curtainHem}
    </group>
  );

  return withPhysics ? (
    <mesh position={position} rotation={rotation}>
      {curtainContent}
    </mesh>
  ) : (
    <group position={position} rotation={rotation}>
      {curtainContent}
    </group>
  );
}
