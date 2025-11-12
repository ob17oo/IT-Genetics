import { MOCK_MISSIONS, MOCK_ACHIEVMENTS, MOCK_PLAYER } from "@/shared/constants"
import { AchievmentType } from "@/shared/types/achievmentType"
import { MissionType } from "@/shared/types/missionType"
interface GameState {
    mission: MissionType[],
    achievments: AchievmentType[]
    playerDNA: number,
    playerLevel: number,


}