import FirstMission from "@/features/missions/ui/first-mission";
import SecondMission from "@/features/missions/ui/second-mission";
import ThirdMission from "@/features/missions/ui/third-mission";
import FourthMission from "@/features/missions/ui/fourth-mission";
import Image from "next/image";

interface MissionDialogProps {
    missionId: number,
    onClose: () => void,
}

export default function MissionDialog({missionId, onClose}: MissionDialogProps){
    const renderMission = () => {
        switch(missionId) {
            case 1:
                return <FirstMission missionId={missionId} onClose={onClose} />
            case 2:
                return <SecondMission missionId={missionId} onClose={onClose} />
            case 3:
                return <ThirdMission missionId={missionId} onClose={onClose} />
            case 4:
                return <FourthMission missionId={missionId} onClose={onClose} />
            default:
                return <FirstMission missionId={missionId} onClose={onClose} />
        }
    }

    return (
        <section className="fixed inset-0 z-50">
            <section className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={onClose}>
                <section onClick={(e) => e.stopPropagation()} className="flex items-center justify-center w-full h-full p-6">
                    <section className="bg-[#121212] rounded-3xl border border-yellow-500/30 p-8 w-full max-w-6xl h-fit space-y-6">
                        <section className="flex w-full justify-end">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="opacity-30 transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-100"
                                >
                                <Image src="/static/close.svg" alt="Close" width={24} height={24} />
                            </button>
                        </section>
                        {renderMission()}
                    </section>
                </section>
            </section>
        </section>
    )
}