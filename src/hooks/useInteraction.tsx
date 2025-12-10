import { useFrame } from "@react-three/fiber";
import { useEffect, useState, useCallback, useRef } from "react";
import { Vector3 } from "three";

interface InteractionState {
  isNear: boolean;
  showInteractPrompt: boolean;
}

interface InteractionProps {
  missionId: number;
  missionPosition: [number, number, number];
  playerPosition: Vector3 | null;
  maxDistance?: number;
  onInteract?: () => void;
}

export function useInteraction({
  missionId,
  playerPosition,
  maxDistance = 3,
  onInteract,
  missionPosition,
}: InteractionProps) {
  const [state, setState] = useState<InteractionState>({
    isNear: false,
    showInteractPrompt: false,
  });

  // Используем useRef для предотвращения лишних вычислений
  const missionPosRef = useRef(new Vector3(...missionPosition));
  const lastIsNearRef = useRef(false);
  const lastShowPromptRef = useRef(false);

  // Обновляем ref при изменении позиции миссии
  useEffect(() => {
    missionPosRef.current.set(...missionPosition);
  }, [missionPosition]);

  useFrame(() => {
    if (!playerPosition) return;

    const distance = playerPosition.distanceTo(missionPosRef.current);
    const newIsNear = distance <= maxDistance;

    // Обновляем только при изменении состояния
    if (newIsNear !== lastIsNearRef.current) {
      setState((prev) => ({
        isNear: newIsNear,
        showInteractPrompt: newIsNear ? true : prev.showInteractPrompt,
      }));
      lastIsNearRef.current = newIsNear;
    }
  });

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
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [state.isNear, onInteract]);

  useEffect(() => {
    if (!state.isNear || !state.showInteractPrompt) return;

    const timer = setTimeout(() => {
      setState((prev) => ({ ...prev, showInteractPrompt: false }));
    }, 3000);

    return () => clearTimeout(timer);
  }, [state.isNear, state.showInteractPrompt]);

  // Логируем только при изменении
  useEffect(() => {
    if (
      state.isNear !== lastIsNearRef.current ||
      state.showInteractPrompt !== lastShowPromptRef.current
    ) {
      console.log("Interaction state changed:", state);
      lastShowPromptRef.current = state.showInteractPrompt;
    }
  }, [state]);

  return state;
}
