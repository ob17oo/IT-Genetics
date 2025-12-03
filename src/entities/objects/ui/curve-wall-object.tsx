import { CuboidCollider, MeshCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { CylinderGeometry, DoubleSide } from "three";

interface CurveWallProps {
  radiusX?: number; // ← Радиус по оси X (горизонтальный)
  radiusZ?: number; // ← Радиус по оси Z (глубинный)
  height: number;
  depth: number;
  startAngle?: number;
  arcAngle?: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  segments?: number;
  withCollider?: boolean;
  colliderType?: "simple" | "accurate" | "none";
}
export default function CurveWallObject({
  radiusX = 10, // Радиус по X (ширина овала)
  radiusZ = 5, // Радиус по Z (глубина овала) - добавь этот параметр!
  height = 10,
  depth = 0.3,
  startAngle = 0,
  arcAngle = Math.PI,
  position,
  rotation,
  color = "#FFFFFF",
  segments = 32,
  withCollider = true,
  colliderType = "simple",
}: CurveWallProps) {
  const wallGeometry = useMemo(() => {
    return new CylinderGeometry(
      radiusX + depth / 2,
      radiusX - depth / 2,
      height,
      segments,
      1,
      true,
      startAngle,
      arcAngle
    );
  }, [radiusX, depth, height, segments, startAngle, arcAngle]);

  // Коэффициент масштабирования для создания овала
  const scaleZ = radiusZ / radiusX;

  const colliders = useMemo(() => {
    if (!withCollider || colliderType === "none") return null;

    if (colliderType === "simple") {
      const colliderCount = Math.max(3, Math.floor(segments / 4));
      const segmentAngle = arcAngle / colliderCount;

      return (
        <>
          {Array.from({ length: colliderCount }).map((_, i) => {
            const angle = startAngle + (i + 0.5) * segmentAngle;
            // Для овала используем разные радиусы для X и Z
            const x = Math.cos(angle) * (radiusX - depth / 2);
            const z = Math.sin(angle) * (radiusZ - depth / 2); // ← radiusZ здесь!

            return (
              <CuboidCollider
                key={i}
                args={[
                  Math.sin(segmentAngle / 2) * radiusX, // Ширина по X
                  height / 2, // Полувысота
                  depth / 2, // Полу-толщина
                ]}
                position={[x, height / 2, z]}
                rotation={[0, -angle, 0]}
                scale={[1, 1, scaleZ]} // ← Масштабируем коллайдер для овала
              />
            );
          })}
        </>
      );
    }
    return (
      <MeshCollider type="hull">
        <mesh geometry={wallGeometry} scale={[1, 1, scaleZ]} />
      </MeshCollider>
    );
  }, [
    radiusX,
    radiusZ,
    height,
    depth,
    startAngle,
    arcAngle,
    segments,
    withCollider,
    colliderType,
    wallGeometry,
    scaleZ,
  ]);

  return (
    <RigidBody type="fixed" position={position} rotation={rotation}>
      {/* Визуальная стена с масштабированием для овала */}
      <mesh
        geometry={wallGeometry}
        receiveShadow
        scale={[1, 1, scaleZ]} // ← Вот это делает овал!
      >
        <meshStandardMaterial color={color} side={DoubleSide} />
      </mesh>

      {/* Физические коллайдеры */}
      {colliders}
    </RigidBody>
  );
}
