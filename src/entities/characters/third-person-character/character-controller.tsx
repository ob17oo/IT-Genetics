"use client";

import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Group, MathUtils, Vector3 } from "three";
import { Character } from "./character";

const clampAngle = (a: number) => {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
};

type RigidApi = {
  linvel: () => { x: number; y: number; z: number };
  setLinvel: (v: { x: number; y: number; z: number }, wake: boolean) => void;
  translation: () => { x: number; y: number; z: number };
};

interface CharacterProps {
  position?: [number, number, number];
  rotationY?: number;
  onPositionChange?: (position: Vector3) => void;
}

export function CharacterController({
  position = [0, 5, 0],
  rotationY = 0,
  onPositionChange,
}: CharacterProps) {
  const { world, rapier } = useRapier();
  const rb = useRef<RigidApi | null>(null);
  const container = useRef<Group | null>(null);
  const character = useRef<Group | null>(null);
  const cameraTarget = useRef<Group | null>(null);
  const cameraBoom = useRef<Group | null>(null);
  const [animation, setAnimation] = useState<"idle" | "walk" | "run">("idle");
  const lastReportedPosition = useRef<Vector3 | null>(null);
  const lastAnimationRef = useRef<"idle" | "walk" | "run">("idle");
  
  // Кэшируем Vector3 объекты, чтобы не создавать их каждый кадр
  const tempVector = useRef(new Vector3());
  const boomWorldRef = useRef(new Vector3());
  const lookAtWorldRef = useRef(new Vector3());
  
  // Кэшируем Ray и его параметры для проверки контакта с полом
  const rayOriginRef = useRef({ x: 0, y: 0, z: 0 });
  const rayDirectionRef = useRef({ x: 0, y: -1, z: 0 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rayRef = useRef<any>(null);
  const groundCheckCounter = useRef(0);

  const [, get] = useKeyboardControls();
  // Настройки управления — ближе к демо из репозитория
  const WALK_SPEED = 2.5;
  const RUN_SPEED = 5;
  const ROTATION_SPEED = 0.012; // чуть быстрее поворот контейнера по A/D
  const CAMERA_LERP = 0.25; // камера догоняет быстрее, остаётся позади
  const CHAR_ROT_LERP = 0.2; // персонаж быстрее выравнивается

  const rotationTarget = useRef(rotationY); // общий поворот контейнера (инициализируем из props)
  const characterRotationTarget = useRef(0); // локальный поворот персонажа
  const initialized = useRef(false);

  useEffect(() => {
    // Инициализация начального поворота
    rotationTarget.current = rotationY;
    if (container.current) {
      container.current.rotation.y = rotationY;
    }
    initialized.current = true;
    
    // Инициализируем Ray один раз, если rapier доступен
    if (rapier) {
      rayRef.current = new rapier.Ray(rayOriginRef.current, rayDirectionRef.current);
    }
  }, [rotationY, rapier]);

  useFrame(({ camera }) => {
    if (rb.current) {
      const vel = rb.current.linvel();

      // Собираем инпут - вызываем get() один раз для оптимизации
      const keys = get();
      const forward = keys.forward ? 1 : 0;
      const backward = keys.backward ? 1 : 0;
      const left = keys.left ? 1 : 0;
      const right = keys.right ? 1 : 0;
      const run = keys.run;

      const movement = { x: 0, z: 0 };
      movement.z = forward ? 1 : backward ? -1 : 0;
      movement.x = left ? 1 : right ? -1 : 0;

      const speed = run ? RUN_SPEED : WALK_SPEED;

      // Вращаем контейнер по оси Y посредством A/D (или ←/→)
      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x;
      }

      // Двигаем вперёд/назад в локальном направлении
      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;
        // Обновляем анимацию только если она изменилась
        const newAnimation = run ? "run" : "walk";
        if (newAnimation !== lastAnimationRef.current) {
          lastAnimationRef.current = newAnimation;
          setAnimation(newAnimation);
        }
      } else {
        vel.x = 0;
        vel.z = 0;
        // Обновляем анимацию только если она изменилась
        if (lastAnimationRef.current !== "idle") {
          lastAnimationRef.current = "idle";
        setAnimation("idle");
        }
      }

      // Поворачиваем модель персонажа мягко
      if (character.current) {
        const from = character.current.rotation.y;
        const to = characterRotationTarget.current;
        const blended = MathUtils.lerp(from, clampAngle(to), CHAR_ROT_LERP);
        character.current.rotation.y = blended;
      }

      // Разрешаем гравитацию. При контакте с полом убираем отрицательный vy
      // Разрешаем гравитацию. При контакте с полом убираем отрицательный vy
      // Проверяем контакт с полом только каждые 3 кадра для оптимизации
      if (rapier && world && rb.current && rayRef.current && vel.y < 0) {
        groundCheckCounter.current++;
        if (groundCheckCounter.current >= 3) {
          groundCheckCounter.current = 0;
        const t = rb.current.translation();
        const halfHeight = 0.6;
        const radius = 0.3;
        const footY = t.y - (halfHeight + radius - 0.01);
          
          // Обновляем позицию луча вместо создания нового
          rayOriginRef.current.x = t.x;
          rayOriginRef.current.y = footY;
          rayOriginRef.current.z = t.z;
          // Обновляем Ray через его свойства (если доступно) или пересоздаем реже
          if (rayRef.current && rayRef.current.origin) {
            rayRef.current.origin.x = t.x;
            rayRef.current.origin.y = footY;
            rayRef.current.origin.z = t.z;
          } else if (rapier) {
            // Пересоздаем только если Ray не инициализирован
            rayRef.current = new rapier.Ray(rayOriginRef.current, rayDirectionRef.current);
          }
          
          const hit = world.castRay(rayRef.current, 0.2, true);
        if (hit && vel.y < 0) {
          vel.y = 0;
          }
        }
      }
      rb.current.setLinvel(vel, true);

      if (onPositionChange) {
        const translation = rb.current.translation();
        // Используем кэшированный Vector3 вместо создания нового
        tempVector.current.set(translation.x, translation.y, translation.z);
        const previousPosition = lastReportedPosition.current;
        if (
          !previousPosition ||
          previousPosition.distanceToSquared(tempVector.current) > 0.0001
        ) {
          // Клонируем только когда нужно обновить
          // Передаем клон, так как handlePositionChange может использовать его асинхронно
          const positionToReport = tempVector.current.clone();
          lastReportedPosition.current = positionToReport; // Используем тот же клон, не клонируем дважды
          onPositionChange(positionToReport);
        }
      }
    }

    // Камера следует за контейнером: сначала поворот контейнера
    if (container.current) {
      container.current.rotation.y = MathUtils.lerp(
        container.current.rotation.y,
        rotationTarget.current,
        CAMERA_LERP
      );
    }

    // Позиция камеры — берём мировую позицию узла-boom
    if (cameraBoom.current) {
      // Используем кэшированный Vector3 вместо создания нового
      cameraBoom.current.getWorldPosition(boomWorldRef.current);
      camera.position.lerp(boomWorldRef.current, CAMERA_LERP);
    }

    // Точка взгляда — узел-таргет немного впереди
    if (cameraTarget.current) {
      // Используем кэшированный Vector3 вместо создания нового
      cameraTarget.current.getWorldPosition(lookAtWorldRef.current);
      // lookAt обновляет матрицу камеры напрямую, это нормально для камеры
      camera.lookAt(lookAtWorldRef.current);
    }
  });

  return (
    <RigidBody
      colliders={false}
      lockRotations
      ref={(api) => {
        rb.current = api as unknown as RigidApi;
      }}
      mass={60}
      position={position}
      canSleep={false}
      gravityScale={1}
    >
      <group ref={container}>
        {/* Точка, куда смотрит камера (впереди персонажа) */}
        <group ref={cameraTarget} position-z={3} />
        {/* Узел позиции камеры — «штанга»: выше и позади */}
        <group ref={cameraBoom} position-y={3.5} position-z={-4} />
        {/* Персонаж */}
        <group ref={character}>
          <Character scale={1.2} animation={animation} />
        </group>
      </group>
      {/* Капсула персонажа: подгоняй размеры под свою модель */}
      <CapsuleCollider args={[0.5, 0.5]} position={[0, 1, 0]} />
    </RigidBody>
  );
}
