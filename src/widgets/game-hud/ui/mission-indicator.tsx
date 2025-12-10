import { useInteraction } from "@/hooks/useInteraction"
import { Html } from "@react-three/drei"
import { Vector3 } from "three"

interface MissionIndicatorProps{
    missionId: number,
    playerPosition: Vector3 | null,
    missionPosition: [number,number,number]
}

export default function MissionIndicator({missionId, missionPosition, playerPosition}: MissionIndicatorProps){
    const { showInteractPrompt } = useInteraction({
        missionId,
        missionPosition,
        playerPosition,
        maxDistance: 1,
        onInteract: () => {
            console.log('Взаимодействие выполнено')
        }
    })
    return (
      <group position={missionPosition}>
        {showInteractPrompt && (
          <Html center>
            <div className="relative">
              {/* Красный прямоугольник с ! */}
              <div className="w-10 h-14 bg-red-600 rounded-md flex items-center justify-center animate-pulse">
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