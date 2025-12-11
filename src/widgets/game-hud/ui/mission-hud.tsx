import MissionDialog from "./mission-dialog";
import { NPCMissionDialog } from "./npc-mission-dialog";
import { NPCStartDialog } from "./npc-start-dialog";
interface MissionHudProps {
    npcId?: number;
    npcName?: string;
    isOpen: boolean;
    onClose: () => void;
    type: 'NPC-Start' | 'NPC-Mission' | 'Mission',
    missionId?: number
}


export default function MissionHud({ npcId = 1, npcName = '', isOpen, onClose, type, missionId = 1}: MissionHudProps) {
    if (!isOpen) return null;

    const renderType = () => {
        switch(type){
        case 'NPC-Start':
            return <NPCStartDialog npcName={npcName} onClose={onClose} />
        case 'NPC-Mission':
            return <NPCMissionDialog npcId={npcId} npcName={npcName} onClose={onClose} />
        case 'Mission':
            return <MissionDialog missionId={missionId} onClose={onClose}/>
        default:
            return <NPCStartDialog npcName={npcName} onClose={onClose} />            

    }
    }

    return (
        <>
            {renderType()}
        </>
    )
}