import { useInteraction } from "@/hooks/useInteraction"
import { useMissionInteractionStore } from "@/widgets/store/mission-interaction.store"
import { Html } from "@react-three/drei"
import { useEffect, useRef } from "react"
import { Vector3 } from "three"

interface MissionIndicatorProps{
    missionId: number,
    playerPosition: Vector3 | null,
    missionPosition: [number,number,number]
    onInteract?: (missionId: number) => void,
}

export default function MissionIndicator({missionId, missionPosition, playerPosition, onInteract}: MissionIndicatorProps){
    const { setInteraction, clearInteraction, isDialogOpen } = useMissionInteractionStore()
    const wasShowingRef = useRef(false)
    
    const handleInteract = () => {
        onInteract?.(missionId)
        clearInteraction()
    }

    const { isNear, showInteractPrompt } = useInteraction({
        missionId,
        missionPosition,
        playerPosition,
        maxDistance: 3,
        onInteract: handleInteract
    })

    // Обновляем store только при изменении состояния показа
    useEffect(() => {
        // Скрываем индикатор, если диалог открыт
        if (isDialogOpen) {
            if (wasShowingRef.current) {
                wasShowingRef.current = false
                clearInteraction()
            }
            return
        }

        const isShowing = showInteractPrompt && isNear && !isDialogOpen
        
        if (isShowing && !wasShowingRef.current) {
            // Показываем индикатор
            wasShowingRef.current = true
            setInteraction(true, missionId)
        } else if (!isShowing && wasShowingRef.current) {
            // Скрываем индикатор
            wasShowingRef.current = false
            clearInteraction()
        }
    }, [showInteractPrompt, isNear, isDialogOpen, missionId, setInteraction, clearInteraction])

    const shouldShow = showInteractPrompt && isNear && !isDialogOpen

    return (
      <group position={missionPosition}>
        {shouldShow && (
          <Html center>
            <div className="relative">
              {/* Индикатор с ! */}
              <div className="w-14 h-14 bg-black/80 border border-yellow-200 rounded-md flex items-center justify-center animate-pulse">
                <span className="text-white text-2xl font-bold">!</span>
              </div>
              {/* Подсказка */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Нажми E
              </div>
            </div>
          </Html>
        )}
      </group>
    );
}
