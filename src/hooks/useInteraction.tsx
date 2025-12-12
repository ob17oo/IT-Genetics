// hooks/useInteraction.tsx
import { useState, useEffect, useRef } from "react";
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
  missionPosition,
  playerPosition,
  maxDistance = 3,
  onInteract,
}: useMissionInteraction) {
  const wasNearRef = useRef(false);
  const [state, setState] = useState<MissionInteractionState>({
    isNear: false,
    showInteractPrompt: false,
  });

  // Проверка расстояния каждый кадр
  useFrame(() => {
    if (!playerPosition) {
      if (wasNearRef.current) {
        wasNearRef.current = false;
        setState({
          isNear: false,
          showInteractPrompt: false,
        });
      }
      return;
    }

    const distance = playerPosition.distanceTo(
      new Vector3(missionPosition[0], missionPosition[1], missionPosition[2])
    );

    const newIsNear = distance <= maxDistance;

    // Обновляем состояние только при изменении статуса "рядом"
    if (newIsNear !== wasNearRef.current) {
      wasNearRef.current = newIsNear;
      setState({
        isNear: newIsNear,
        showInteractPrompt: newIsNear, // Показываем подсказку при входе в зону
      });
    }
  });

  // Обработчик клавиши E
  useEffect(() => {
    if (!state.isNear) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        (event.key === "e" ||
          event.key === "E" ||
          event.key === "у" ||
          event.key === "У") &&
        state.isNear &&
        state.showInteractPrompt
      ) {
        event.preventDefault();
        setState({
          isNear: false,
          showInteractPrompt: false,
        });
        wasNearRef.current = false;
        onInteract?.();
        console.log('Окно миссий открыто');
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [state.isNear, state.showInteractPrompt, onInteract]);

  // Авто-скрытие подсказки через 5 секунд
  useEffect(() => {
    if (!state.isNear || !state.showInteractPrompt) return;

    const timer = setTimeout(() => {
      setState((prev) => {
        if (prev.isNear) {
          return { ...prev, showInteractPrompt: false };
        }
        return prev;
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [state.isNear, state.showInteractPrompt]);

  return state;
}
