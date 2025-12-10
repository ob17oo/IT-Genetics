import { useNPCInteractionStore } from "@/widgets/store/npc-interaction-store"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface NPCDialogProps {
    npcName: string,
    onClose: () => void
}
export function NPCStartDialog({npcName, onClose}: NPCDialogProps){
    const [step, setStep] = useState(0)
    const [fade, setFade] = useState(false)
    const { clearInteraction } = useNPCInteractionStore()
    const router = useRouter()
    const messages = [
      `Привет, я ${npcName}! Рад тебя видеть в нашей IT-команде.`,
      `Добро пожаловать в IT-Genetics — уникальную бизнес-симуляцию от Chulakov Design. Здесь ты начнёшь путь от стажёра до опытного IT-специалиста.`,
      `Твоя цель — развивать как профессиональные навыки (Hard Skills), так и личные качества (Soft Skills). Участвуй в проектах, выполняй задания и взаимодействуй с командой.`,
      `Готов начать карьеру? Нажми "Играть" и сделай первый шаг к успеху!`,
    ];

    const changeStep = (newStep: number) => {
        setFade(true)
        setTimeout(() => {
            setStep(newStep)
            setFade(false)
        }, 200)
    }

    const handleNextMess = () => {
        if(step < messages.length - 1){
            changeStep(step + 1)
        } else {
            onClose()
        }
    }
    const handlePrevMess = () => {
        if(step > 0){
            changeStep(step -1)
        }
    }

    const handlePlay = () => {
        clearInteraction()
        router.push('/game')
        onClose()
    }

    return (
        <section className="fixed inset-0 z-50">
            <section className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}>
                <section onClick={(e) => e.stopPropagation()} className="flex items-center justify-center w-full h-full p-6">
                    <section className="bg-[#121212] rounded-3xl border border-yellow-500/30 p-8 w-full max-w-5xl h-[50vh] space-y-6 flex flex-col justify-between">
                        <section className="flex items-start justify-between gap-4 border-b border-yellow-500/30 pb-4">
                            <div>
                                <p className="text-sm text-yellow-500/60 uppercase tracking-[0.2em]">NPC</p>
                                <h2 className="text-lg font-bold text-yellow-500">{npcName}</h2>
                            </div>
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="opacity-40 transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-100 text-yellow-200"
                            >
                                ✕
                            </button>
                        </section>

                        <section className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            <h2 className={`text-yellow-500 text-xl text-center transition-opacity duration-200 ${fade ? 'opacity-0' : 'opacity-100'}`}>{messages[step]}</h2>
                        </section>
                        <section className="flex justify-end">
                           <section className="flex gap-3">
                                <button className="text-yellow-500 px-3 py-2 border border-yellow-500/30 rounded-2xl" type="button" onClick={handlePrevMess}>Назад</button>
                                { step === messages.length - 1 ? (
                                    <button className="text-yellow-500 px-3 py-2 border border-yellow-500/30 rounded-2xl" type="button" onClick={handlePlay}>Играть</button>
                                ) : (
                                    <button className="text-yellow-500 px-3 py-2 border border-yellow-500/30 rounded-2xl" type="button" onClick={handleNextMess}>Далее</button>
                                )}
                           </section>
                        </section>
                    </section>
                </section>
            </section>
        </section>
    )
}