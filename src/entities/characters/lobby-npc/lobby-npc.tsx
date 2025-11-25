import { useNPCInteraction } from "@/hooks/useNPCInteraction";
import { Html, useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Group } from "three";
import { Vector3 } from "three";
import { NPCDialog } from '@/widgets/game-hud/ui/npc-dialog'
import { useNPCInteractionStore } from "@/widgets/store/npc-interaction-store";
interface LobbyNPCProps {
  scale: number | [number, number, number];
  path: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  npcId: number;
  npcName: string;
  playerPosition: Vector3 | null;
}

export function LobbyNPC({
  npcId,
  scale = 0.1,
  path,
  position,
  rotation,
  npcName,
  playerPosition,
}: LobbyNPCProps) {
  const groupRef = useRef<Group>(null);
  const { scene, animations } = useGLTF(`/model/character/${path}.glb`);
  const { actions, names } = useAnimations(animations, groupRef);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const dialogPortal = typeof document !== "undefined" ? document.body : null;
  const { setInteraction, clearInteraction } = useNPCInteractionStore();
  
  const handleInteract = () => {
    setDialogOpen(true);
    clearInteraction();
  };

  const { isNearNPC, showInteractPrompt } = useNPCInteraction({
    npcId: npcId,
    npcPosition: position,
    playerPosition: playerPosition,
    maxDistance: 3,
    onInteract: handleInteract,
  });

  // Обновляем store при изменении состояния подсказки
  useEffect(() => {
    if (showInteractPrompt && isNearNPC) {
      setInteraction(true, npcName, npcId);
    } else {
      clearInteraction();
    }
  }, [showInteractPrompt, isNearNPC, npcName, npcId, setInteraction, clearInteraction]);

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
    <>
      <group
        ref={groupRef}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        <primitive object={scene} />
      </group>

  

      {dialogPortal && isDialogOpen && (
        <Html fullscreen className="w-screen h-screen flex justify-center items-center">
          <NPCDialog
            npcId={npcId}
            npcName={npcName}
            onClose={() => setDialogOpen(false)}
          />
        </Html>
      )}
    </>
  );
}
