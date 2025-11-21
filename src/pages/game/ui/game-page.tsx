import LobbyScene from "@/entities/scene/ui/lobby-scene";
// import { OfficeScene } from "@/entities/scene/ui/office-scene";


export default function GamePage(){
    return (
        <section className="flex h-screen">
            {/* <OfficeScene /> */}
            <LobbyScene />
        </section>
    )
}