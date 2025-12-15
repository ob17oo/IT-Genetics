import { useInteraction } from "@/hooks/useInteraction"
import { useMissionInteractionStore } from "@/widgets/store/mission-interaction.store"
import { useMissionStore } from "@/widgets/store/mission-store"
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
    const missions = useMissionStore((state) => state.missions)
    const wasShowingRef = useRef(false)
    
    // Проверяем, взята ли миссия игроком
    const isMissionAssigned = missions.some(mission => mission.id === missionId && !mission.completed)
    
    const handleInteract = () => {
        // Дополнительная проверка: взаимодействие только для принятых миссий
        if (!isMissionAssigned) {
            return
        }
        onInteract?.(missionId)
        clearInteraction()
    }

    // Вызываем useInteraction только если миссия принята
    const { isNear, showInteractPrompt } = useInteraction({
        missionId,
        missionPosition,
        playerPosition: isMissionAssigned ? playerPosition : null, // Передаем null если миссия не принята
        maxDistance: 3,
        onInteract: isMissionAssigned ? handleInteract : undefined // Передаем undefined если миссия не принята
    })

    // Обновляем store только при изменении состояния показа (для взаимодействия)
    useEffect(() => {
        // Не обрабатываем взаимодействие, если миссия не принята
        if (!isMissionAssigned) {
            if (wasShowingRef.current) {
                wasShowingRef.current = false
                clearInteraction()
            }
            return
        }

        // Скрываем индикатор взаимодействия, если диалог открыт
        if (isDialogOpen) {
            if (wasShowingRef.current) {
                wasShowingRef.current = false
                clearInteraction()
            }
            return
        }

        // Показываем подсказку взаимодействия только когда близко и миссия принята
        const isShowing = showInteractPrompt && isNear && !isDialogOpen && isMissionAssigned
        
        if (isShowing && !wasShowingRef.current) {
            // Показываем индикатор взаимодействия
            wasShowingRef.current = true
            setInteraction(true, missionId)
        } else if (!isShowing && wasShowingRef.current) {
            // Скрываем индикатор взаимодействия
            wasShowingRef.current = false
            clearInteraction()
        }
    }, [showInteractPrompt, isNear, isDialogOpen, isMissionAssigned, missionId, setInteraction, clearInteraction])

    // Индикатор показывается только если миссия взята и не завершена
    const shouldShow = !isDialogOpen && isMissionAssigned
    const canInteract = isNear && showInteractPrompt && isMissionAssigned

    // Не показываем индикатор, если миссия не взята
    if (!isMissionAssigned) {
        return null
    }

    return (
      <group position={missionPosition}>
        {shouldShow && (
          <Html center>
            <div className="relative">
              {/* Индикатор с ! - всегда виден для взятых миссий */}
              <div className={`w-14 h-14 bg-black/80 border rounded-md flex items-center justify-center ${
                canInteract 
                  ? 'border-yellow-200 animate-pulse' 
                  : 'border-yellow-500/50 opacity-70'
              }`}>
                <span className="text-white text-2xl font-bold">!</span>
              </div>
              {/* Подсказка - только когда близко */}
              {canInteract && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Нажми E
                </div>
              )}
            </div>
          </Html>
        )}
      </group>
    );
}
