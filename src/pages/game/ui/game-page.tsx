import { OfficeScene } from "@/entities/scene/ui/office-scene";

// import LobbyScene from "@/entities/scene/ui/lobby-scete";

export default function GamePage(){
    return (
        <section className="flex h-screen">
            <OfficeScene />
            {/* <LobbyScene /> */}
        </section>
    )
}