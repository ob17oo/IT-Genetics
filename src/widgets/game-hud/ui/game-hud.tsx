'use client'
import { useEffect, useState } from "react";
import GameDialog from "./game-dialog";
import Image from "next/image";
import { useAuthStore } from "@/widgets/store/auth-store";
import { useMissionStore } from "@/widgets/store/mission-store";
import { useNPCInteractionStore } from "@/widgets/store/npc-interaction-store";

export default function GameHud(){
    const { user } = useAuthStore()
    const { getActiveMissions } = useMissionStore()
    const { showPrompt, promptMessage } = useNPCInteractionStore()
    const [loading , setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    }, [])
    return (
      <>
        <section className="absolute top-0 left-0 right-0 h-auto z-10">
          <section className="flex justify-between p-3 items-start">
            <section className="pointer-events-none">
              <h3 className="text-lg text-white">IT Genetics</h3>
              <span className="text-[12px] text-yellow-500">v 1.0.0</span>
            </section>
            <section>
              {}
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
      </>
    );
}
