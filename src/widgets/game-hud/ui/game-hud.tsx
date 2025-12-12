'use client'
import { useState } from "react";
import GameDialog from "./game-dialog";
import Image from "next/image";
import { useAuthStore } from "@/widgets/store/auth-store";
import { useMissionStore } from '@/widgets/store/mission-store'
import { useNPCInteractionStore } from "@/widgets/store/npc-interaction-store";
import { useMissionInteractionStore } from "@/widgets/store/mission-interaction.store";


export default function GameHud(){
    const { user } = useAuthStore()
    const missions = useMissionStore(state => state.missions)
    const { showPrompt, promptMessage } = useNPCInteractionStore()
    const { showMissionPrompt, promptMissionMessage } = useMissionInteractionStore()
    const [isOpen, setIsOpen] = useState(false);
    const activeMissions = missions.filter(mission => !mission.completed)

    return (
      <>
        <section className="absolute top-0 left-0 right-0 h-auto z-10">
          <section className="flex justify-between p-3 items-start">
            <section className="pointer-events-none">
              <h3 className="text-lg text-white">IT Genetics</h3>
              <span className="text-[12px] text-yellow-500">v 1.0.0</span>
              {activeMissions.length > 0 && (
                <section className="mt-3 space-y-1 p-6 bg-black/70 rounded-2xl border border-yellow-500">
                  <h4 className="text-xs uppercase tracking-[0.4em] text-yellow-500/70">
                    Активные миссии
                  </h4>
                  <ul className="flex flex-col gap-1">
                    {activeMissions.slice(0, 3).map((mission) => (
                      <li 
                        key={mission.id}
                        className="flex items-center gap-2 text-[13px] text-yellow-100/80"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        <span className="truncate">{mission.title}</span>
                        <span className="text-[11px] text-yellow-500/70">{mission.progress}%</span>
                      </li>
                    ))}
                    {activeMissions.length > 3 && (
                      <li className="text-[11px] text-yellow-500/70">
                        + ещё {activeMissions.length - 3}
                      </li>
                    )}
                  </ul>
                </section>
              )}
            </section>
            <section className="pointer-events-auto flex items-center gap-2">
              <section className="py-2 px-4 rounded-full flex gap-2 items-center justify-center bg-green-400/70">
                  <p className="text-white">{ user ? user.dna : 0}</p>
                  <section className="relative overflow-hidden w-7 h-7 bg-green-500 rounded-full flex justify-center items-center">
                      <Image src="/static/dna.svg" alt="dna" width={18} height={18} />
                  </section>
              </section>
              <button className="w-10 h-10 flex items-center justify-center bg-yellow-500 rounded-2xl transition-all duration-300 hover:scale-105" onClick={() => setIsOpen(true)}>
                  <Image src="/static/Menu.svg"  alt="Menu" width={24} height={24} />
              </button>
              <GameDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </section>
          </section>
        </section>

        {/* Подсказка взаимодействия с NPC - привязана к viewport */}
        {showPrompt && promptMessage && (
          <section className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <section className="bg-black/80 py-2 px-4 rounded whitespace-nowrap">
              <h2 className="text-yellow-200 text-[14px]">
                {promptMessage}
              </h2>
            </section>
          </section>
        )}

        {/* Подсказка взаимодействия с миссией - привязана к viewport */}
        {showMissionPrompt && promptMissionMessage && (
          <section className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <section className="bg-black/80 py-2 px-4 rounded whitespace-nowrap">
              <h2 className="text-yellow-200 text-[14px]">
                {promptMissionMessage}
              </h2>
            </section>
          </section>
        )}
        
      </>
    );
}
