// hooks/useNPCInteraction.tsx
import { useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

interface MissionInteractionState {
  isNear: boolean;
  showInteractPrompt: boolean;
}

interface useMissionInteraction {
  missionId: number;
  missionPosition: [number, number, number];
  playerPosition: Vector3 | null;
  maxDistance?: number;
  onInteract?: () => void;
}

export function useInteraction({
  missionId,
  missionPosition,
  playerPosition,
  maxDistance = 3,
  onInteract,
}: useMissionInteraction) {
  const [state, setState] = useState<MissionInteractionState>({
    isNear: false,
    showInteractPrompt: false,
  });

  // Проверка расстояния каждый кадр
  useFrame(() => {
    if (!playerPosition) return;

    const distance = playerPosition.distanceTo(
      new Vector3(missionPosition[0], missionPosition[1], missionPosition[2])
    );

    const newIsNear = distance <= maxDistance;

    setState((prev) => ({
      isNear: newIsNear,
      showInteractPrompt:
        newIsNear && !prev.showInteractPrompt
          ? true
          : prev.showInteractPrompt,
    }));
  });

  // Обработчик клавиши E
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        (event.key === "e" ||
          event.key === "E" ||
          event.key === "у" ||
          event.key === "У") &&
        state.isNear
      ) {
        event.preventDefault();
        setState((prev) => ({ ...prev, showInteractPrompt: false }));
        onInteract?.();
        console.log('Окно миссий открыто')
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [state.isNear, onInteract]);

  // Авто-скрытие подсказки
  useEffect(() => {
    if (!state.isNear || !state.showInteractPrompt) return;

    const timer = setTimeout(() => {
      setState((prev) => ({ ...prev, showInteractPrompt: false }));
    }, 3000);

    return () => clearTimeout(timer);
  }, [state.isNear, state.showInteractPrompt]);

  return state;
}
