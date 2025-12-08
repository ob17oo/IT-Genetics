"use client";
import { useMemo } from "react";
import { useGLTF, Clone } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

interface WindowInstance {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  color?: string;
}

interface InstancedWindowProps {
  instances: WindowInstance[];
}

export function InstancedWindow({ instances }: InstancedWindowProps) {
  // Группируем окна по цвету для разных моделей
  const windowsByColor = useMemo(() => {
    const groups: Record<string, WindowInstance[]> = {};
    instances.forEach((instance) => {
      const color = instance.color || "White";
      if (!groups[color]) groups[color] = [];
      groups[color].push(instance);
    });
    return groups;
  }, [instances]);

  return (
    <>
      {Object.entries(windowsByColor).map(([color, windows]) => (
        <WindowGroup key={color} color={color} windows={windows} />
      ))}
    </>
  );
}

function WindowGroup({
  color,
  windows,
}: {
  color: string;
  windows: WindowInstance[];
}) {
  const { scene } = useGLTF(`/model/furniture/windowFrame-${color}.glb`);

  // Проблема: InstancedMesh не работает правильно для сложных моделей с несколькими мешами
  // Используем Clone для каждого окна - это менее оптимально, но работает правильно
  // TODO: Исправить InstancedMesh для работы с группами мешей
  return (
    <>
      {windows.map((window, i) => {
        const scale = window.scale || 0.1;
        return (
          <RigidBody key={`${color}-${i}`} type="fixed" colliders={false}>
            <Clone 
              object={scene} 
              position={window.position}
              rotation={window.rotation}
              scale={scale}
            />
          </RigidBody>
        );
      })}
    </>
  );
}
