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
  linvel: () => { x: number; y: number; z: number }
  setLinvel: (v: { x: number; y: number; z: number }, wake: boolean) => void
  translation: () => { x: number; y: number; z: number }
}

export function CharacterController() {
  const { world, rapier } = useRapier()
  const rb = useRef<RigidApi | null>(null);
  const container = useRef<Group | null>(null);
  const character = useRef<Group | null>(null);
  const cameraTarget = useRef<Group | null>(null);
  const cameraBoom = useRef<Group | null>(null);
  const [animation, setAnimation] = useState<'idle' | 'walk' | 'run'>('idle')

  const [, get] = useKeyboardControls();
  // Настройки управления — ближе к демо из репозитория
  const WALK_SPEED = 2;
  const RUN_SPEED = 4;
  const ROTATION_SPEED = 0.012; // чуть быстрее поворот контейнера по A/D
  const CAMERA_LERP = 0.25; // камера догоняет быстрее, остаётся позади
  const CHAR_ROT_LERP = 0.2; // персонаж быстрее выравнивается

  const rotationTarget = useRef(0);            // общий поворот контейнера
  const characterRotationTarget = useRef(0);   // локальный поворот персонажа

  useEffect(() => {
    // click-to-steer отключен: управление только с клавиатуры
  }, []);

  useFrame(({ camera }) => {
    if (rb.current) {
      const vel = rb.current.linvel();

      // Собираем инпут
      const forward = get().forward ? 1 : 0;
      const backward = get().backward ? 1 : 0;
      const left = get().left ? 1 : 0;
      const right = get().right ? 1 : 0;
      const run = get().run;

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
        vel.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed;
        vel.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed;
        setAnimation(run ? 'run' : 'walk')
      } else {
        vel.x = 0;
        vel.z = 0;
        setAnimation('idle')
      }

      // Поворачиваем модель персонажа мягко
      if (character.current) {
        const from = character.current.rotation.y;
        const to = characterRotationTarget.current;
        const blended = MathUtils.lerp(from, clampAngle(to), CHAR_ROT_LERP);
        character.current.rotation.y = blended;
      }

      // Разрешаем гравитацию. При контакте с полом убираем отрицательный vy
      if (rapier && world && rb.current) {
        const t = rb.current.translation()
        const halfHeight = 0.6
        const radius = 0.3
        const footY = t.y - (halfHeight + radius - 0.01)
        const ray = new rapier.Ray({ x: t.x, y: footY, z: t.z }, { x: 0, y: -1, z: 0 })
        const hit = world.castRay(ray, 0.2, true)
        if (hit && vel.y < 0) {
          vel.y = 0
        }
      }
      rb.current.setLinvel(vel, true);
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
      const boomWorld = new Vector3();
      cameraBoom.current.getWorldPosition(boomWorld);
      camera.position.lerp(boomWorld, CAMERA_LERP);
    }

    // Точка взгляда — узел-таргет немного впереди
    if (cameraTarget.current) {
      const lookAtWorld = new Vector3();
      cameraTarget.current.getWorldPosition(lookAtWorld);
      const currentLook = new Vector3();
      camera.getWorldDirection(currentLook);
      // Можно плавно навести камеру на lookAtWorld
      camera.lookAt(lookAtWorld);
    }
  });

  return (
    <RigidBody
      colliders={false}
      lockRotations
      ref={(api) => { rb.current = (api as unknown as RigidApi) }}
      position={[0, 0.1, 0]}
      mass={60}
      canSleep={false}
      gravityScale={1}
    >
      <group ref={container}>
        {/* Точка, куда смотрит камера (впереди персонажа) */}
        <group ref={cameraTarget} position-z={2} />
        {/* Узел позиции камеры — «штанга»: выше и позади */}
        <group ref={cameraBoom} position-y={4} position-z={-5} />
        {/* Персонаж */}
      <group ref={character}>
          <Character scale={1} animation={animation} />
        </group>
      </group>
      {/* Капсула персонажа: подгоняй размеры под свою модель */}
      <CapsuleCollider args={[0, 0.3]} />
    </RigidBody>
  );
}