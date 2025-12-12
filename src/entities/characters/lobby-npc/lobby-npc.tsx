import { useNPCInteraction } from "@/hooks/useNPCInteraction";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group } from "three";
import { Vector3 } from "three";
import { useNPCInteractionStore } from "@/widgets/store/npc-interaction-store";
import { RigidBody } from "@react-three/rapier";
interface LobbyNPCProps {
  scale: number | [number, number, number];
  path: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  npcId: number;
  npcName: string;
  playerPosition: Vector3 | null;
  onInteract?: (npcId: number, npcName: string) => void;
}

export function LobbyNPC({
  npcId,
  scale = 0.1,
  path,
  position,
  rotation,
  npcName,
  playerPosition,
  onInteract,
}: LobbyNPCProps) {
  const groupRef = useRef<Group>(null);
  const { scene, animations } = useGLTF(`/model/character/${path}.glb`);
  const { actions, names } = useAnimations(animations, groupRef);
  const { setInteraction, clearInteraction, isDialogOpen } = useNPCInteractionStore();
  const wasShowingRef = useRef(false);
  
  const handleInteract = () => {
    onInteract?.(npcId, npcName);
    clearInteraction();
  };

  const { isNearNPC, showInteractPrompt } = useNPCInteraction({
    npcId: npcId,
    npcPosition: position,
    playerPosition: playerPosition,
    maxDistance: 3,
    onInteract: handleInteract,
  });

  // Обновляем store только при изменении состояния показа
  useEffect(() => {
    // Скрываем индикатор, если диалог открыт
    if (isDialogOpen) {
      if (wasShowingRef.current) {
        wasShowingRef.current = false;
        clearInteraction();
      }
      return;
    }

    const isShowing = showInteractPrompt && isNearNPC && !isDialogOpen;
    
    if (isShowing && !wasShowingRef.current) {
      // Показываем индикатор
      wasShowingRef.current = true;
      setInteraction(true, npcName, npcId);
    } else if (!isShowing && wasShowingRef.current) {
      // Скрываем индикатор
      wasShowingRef.current = false;
      clearInteraction();
    }
  }, [showInteractPrompt, isNearNPC, isDialogOpen, npcName, npcId, setInteraction, clearInteraction]);

  useEffect(() => {
    if (names.length > 0) {
      const idleAnimation = names.find((elem) =>
        elem.toLowerCase().includes("idle")
      );
      const animationToPlay = idleAnimation || names[0];
      if (animationToPlay && actions[animationToPlay]) {
        actions[animationToPlay].play();
      }
    }
  }, [actions, names]);

  return (
    <RigidBody type="fixed">
      <group
        ref={groupRef}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        <primitive object={scene} />
      </group>
    </RigidBody>
  );
}
