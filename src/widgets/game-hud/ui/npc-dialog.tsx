import { useMissionStore } from "@/widgets/store/mission-store"

interface NPCDialogProps {
    npcId: number,
    npcName: string,
    onClose: () => void
}
export function NPCDialog({npcId,npcName,onClose}: NPCDialogProps){
    const {
        availableMission,
        assignMission,
        getActiveMissions,
        completeMission
    } = useMissionStore()
    const missions = getActiveMissions()
    const npcMission = availableMission.filter(elem => elem.relatedNPC === npcId)

    const handleAcceptMission = (missionId: number) => {
        assignMission(missionId)
        console.log(`Миссия принята ${missionId}`)
    }

    const handleCompleteMission = (missionId: number) => {
        completeMission(missionId)
        console.log(`Миссия завершена ${missionId}`)
    }

    return (
        <section className="fixed inset-0 h-screen w">
            <section className="bg-black/70 w-full h-full">
            sdkfdfk;ls</section>
        </section>
    )
}