import { NPCMissionDialog } from "./npc-mission-dialog";
import { NPCStartDialog } from "./npc-start-dialog";
interface MissionHudProps {
    npcId: number;
    npcName: string;
    isOpen: boolean;
    onClose: () => void;
    typeOfNPC: 'Start' | 'Mission'
}


export default function MissionHud({ npcId, npcName, isOpen, onClose, typeOfNPC }: MissionHudProps) {
    if (!isOpen) return null;

    const renderType = () => {
        switch(typeOfNPC){
        case 'Start':
            return <NPCStartDialog npcId={npcId} npcName={npcName} onClose={onClose} />
        case 'Mission':
            return <NPCMissionDialog npcId={npcId} npcName={npcName} onClose={onClose} />
        default:
            return <NPCStartDialog npcId={npcId} npcName={npcName} onClose={onClose} />            

    }
    }

    return (
        <>
            {renderType()}
        </>
    )
}