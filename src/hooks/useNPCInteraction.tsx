// hooks/useNPCInteraction.tsx
import { useState, useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

interface NPCInteractionState {
  isNearNPC: boolean;
  showInteractPrompt: boolean;
}

interface UseNPCInteractionProps {
  npcId: number;
  npcPosition: [number, number, number];
  playerPosition: Vector3 | null;
  maxDistance?: number;
  onInteract?: () => void;
}

export function useNPCInteraction({
  npcId,
  npcPosition,
  playerPosition,
  maxDistance = 3,
  onInteract,
}: UseNPCInteractionProps) {
  const wasNearRef = useRef(false);
  const [state, setState] = useState<NPCInteractionState>({
    isNearNPC: false,
    showInteractPrompt: false,
  });

  // Кэшируем Vector3 для npcPosition, чтобы не создавать его каждый кадр
  const npcVector = useMemo(
    () => new Vector3(npcPosition[0], npcPosition[1], npcPosition[2]),
    [npcPosition[0], npcPosition[1], npcPosition[2]]
  );

  // Используем useFrame для проверки расстояния
  useFrame(() => {
    if (!playerPosition || !onInteract) {
      if (wasNearRef.current) {
        wasNearRef.current = false;
        setState({
          isNearNPC: false,
          showInteractPrompt: false,
        });
      }
      return;
    }

    // Используем кэшированный Vector3
    const distance = playerPosition.distanceTo(npcVector);
    const newIsNearNPC = distance <= maxDistance;

    // Обновляем состояние только при изменении статуса "рядом"
    if (newIsNearNPC !== wasNearRef.current) {
      wasNearRef.current = newIsNearNPC;
      setState((prev) => ({
        isNearNPC: newIsNearNPC,
        showInteractPrompt: newIsNearNPC && !prev.showInteractPrompt ? true : prev.showInteractPrompt,
      }));
    }
  });

  // Обработчик клавиши E
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        (event.key === "e" ||
          event.key === "E" ||
          event.key === "у" ||
          event.key === "У") &&
        state.isNearNPC
      ) {
        event.preventDefault();
        setState((prev) => ({ ...prev, showInteractPrompt: false }));
        onInteract?.();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [state.isNearNPC, onInteract]);

  // Авто-скрытие подсказки
  useEffect(() => {
    if (!state.isNearNPC || !state.showInteractPrompt) return;

    const timer = setTimeout(() => {
      setState((prev) => ({ ...prev, showInteractPrompt: false }));
    }, 3000);

    return () => clearTimeout(timer);
  }, [state.isNearNPC, state.showInteractPrompt]);

  return state;
}
