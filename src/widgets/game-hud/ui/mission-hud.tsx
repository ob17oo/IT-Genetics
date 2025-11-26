import { NPCDialog } from "./npc-dialog";
interface MissionHudProps {
    npcId: number;
    npcName: string;
    isOpen: boolean;
    onClose: () => void;
}


export default function MissionHud({ npcId, npcName, isOpen, onClose }: MissionHudProps) {
    if (!isOpen) return null;

    return (
        <NPCDialog npcId={npcId} npcName={npcName} onClose={onClose} />
    );
}