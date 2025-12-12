import MissionDialog from "./mission-dialog";
import { NPCMissionDialog } from "./npc-mission-dialog";
import { NPCStartDialog } from "./npc-start-dialog";
import { useMissionInteractionStore } from "@/widgets/store/mission-interaction.store";
import { useNPCInteractionStore } from "@/widgets/store/npc-interaction-store";
import { useEffect } from "react";

interface MissionHudProps {
    npcId?: number;
    npcName?: string;
    isOpen: boolean;
    onClose: () => void;
    type: 'NPC-Start' | 'NPC-Mission' | 'Mission',
    missionId?: number
}


export default function MissionHud({ npcId = 1, npcName = '', isOpen, onClose, type, missionId = 1}: MissionHudProps) {
    const { setDialogOpen: setMissionDialogOpen } = useMissionInteractionStore();
    const { setDialogOpen: setNPCDialogOpen } = useNPCInteractionStore();

    // Обновляем состояние открытия диалога в store
    useEffect(() => {
        if (type === 'Mission') {
            setMissionDialogOpen(isOpen);
        } else if (type === 'NPC-Start' || type === 'NPC-Mission') {
            setNPCDialogOpen(isOpen);
        }
        
        return () => {
            if (type === 'Mission') {
                setMissionDialogOpen(false);
            } else if (type === 'NPC-Start' || type === 'NPC-Mission') {
                setNPCDialogOpen(false);
            }
        };
    }, [isOpen, type, setMissionDialogOpen, setNPCDialogOpen]);

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