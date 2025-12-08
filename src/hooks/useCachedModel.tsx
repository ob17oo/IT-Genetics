"use client";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Group } from "three";

// useMemo для кеширования
const sceneCache = new Map<string, Group>();

export function useCachedModel(path: string): Group {
  const gltf = useGLTF(path);

  // Мемоизация сцены с клонированием
  const scene = useMemo(() => {
    // Проверяем кеш
    if (sceneCache.has(path)) {
      return sceneCache.get(path)!;
    }

    // Клонируем и кешируем
    const cloned = gltf.scene.clone();
    sceneCache.set(path, cloned);
    return cloned;
  }, [gltf.scene, path]);

  return scene;
}
