import { CuboidCollider, MeshCollider } from "@react-three/rapier";
import { useMemo } from "react";
import { CylinderGeometry, DoubleSide, Matrix4 } from "three";

interface CurveWallProps {
  radius?: number;
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
  startPoint?: "center" | "edge" | "inner" | "outer";
}

export default function CurveWallObject({
  radius = 10,
  height = 10,
  depth = 0.3,
  startAngle = 0,
  arcAngle = Math.PI,
  position,
  rotation = [0, 0, 0],
  color = "#FFFFFF",
  segments = 32,
  withCollider = true,
  colliderType = "simple",
  startPoint = "center",
}: CurveWallProps) {
  // Делаем функцию useCallback или выносим вычисление
  const startOffset = useMemo(() => {
    switch (startPoint) {
      case "edge":
        return -radius + depth / 2;
      case "inner":
        return -radius;
      case "outer":
        return -radius - depth;
      case "center":
      default:
        return 0;
    }
  }, [radius, depth, startPoint]); // Указываем зависимости

  const wallGeometry = useMemo(() => {
    const geometry = new CylinderGeometry(
      radius + depth / 2,
      radius - depth / 2,
      height,
      segments,
      1,
      true,
      startAngle,
      arcAngle
    );

    // Сдвигаем геометрию для изменения стартовой точки
    if (startOffset !== 0) {
      const matrix = new Matrix4();
      matrix.makeTranslation(startOffset, 0, 0);
      geometry.applyMatrix4(matrix);
    }

    return geometry;
  }, [radius, depth, height, segments, startAngle, arcAngle, startOffset]); // Добавили startOffset

  const colliders = useMemo(() => {
    if (!withCollider || colliderType === "none") return null;

    if (colliderType === "simple") {
      const colliderCount = Math.max(3, Math.floor(segments / 4));
      const segmentAngle = arcAngle / colliderCount;

      return (
        <>
          {Array.from({ length: colliderCount }).map((_, i) => {
            const angle = startAngle + (i + 0.5) * segmentAngle;
            const x = Math.cos(angle) * radius + startOffset;
            const z = Math.sin(angle) * radius;

            const segmentWidth = Math.abs(
              Math.sin(segmentAngle / 2) * radius * 2
            );

            const colliderAngle = angle + Math.PI / 2;

            return (
              <CuboidCollider
                key={i}
                args={[segmentWidth / 2, height / 2, depth / 2]}
                position={[x, height / 2, z]}
                rotation={[0, -colliderAngle, 0]}
              />
            );
          })}
        </>
      );
    }

    return (
      <MeshCollider type="hull">
        <mesh geometry={wallGeometry} />
      </MeshCollider>
    );
  }, [
    radius,
    height,
    depth,
    startAngle,
    arcAngle,
    segments,
    withCollider,
    colliderType,
    wallGeometry,
    startOffset, // Добавляем здесь
  ]);

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={wallGeometry} receiveShadow>
        <meshStandardMaterial color={color} side={DoubleSide} />
      </mesh>
      {colliders}
    </group>
  );
}
