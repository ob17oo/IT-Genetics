// hooks/useNPCInteraction.tsx
import { useState, useEffect } from "react";
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
  const [state, setState] = useState<NPCInteractionState>({
    isNearNPC: false,
    showInteractPrompt: false,
  });

  // Проверка расстояния каждый кадр
  useFrame(() => {
    if (!playerPosition) return;

    const distance = playerPosition.distanceTo(
      new Vector3(npcPosition[0], npcPosition[1], npcPosition[2])
    );

    const newIsNearNPC = distance <= maxDistance;

    setState((prev) => ({
      isNearNPC: newIsNearNPC,
      showInteractPrompt:
        newIsNearNPC && !prev.showInteractPrompt
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
