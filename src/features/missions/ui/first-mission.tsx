import { useMissionStore } from "@/widgets/store/mission-store"
import { useAuthStore } from "@/widgets/store/auth-store"
import { useState } from "react"

interface FirstMissionProps {
    missionId: number,
    onClose: () => void
}

export default function FirstMission({missionId, onClose}: FirstMissionProps){
    const levels = [
        {
            title: 'Релиз проекта через 1 час, но в нем есть критическая ошибка, и ты единственный, кто ее заметил',
            answers: [
                {id: 'A', value: 'Сказать, что это не твоя зона ответственности'},
                {id: 'B', value: 'Взять на себя исправление проекта'},
                {id: 'C', value: 'Промолчать о проблеме'},
                {id: 'D', value: 'Спихнуть на кого-то другого'}
            ],
            correctAnswer: 'B'
            
        }
    ]
    const [play , setPlay] = useState(false) 
    const [picked , setPicked] = useState<string | null>(null)
    const [showAnswer, setShowAnswer] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const completeMissionWithRewards = useMissionStore((state) => state.completeMissionWithRewards)
    const updateDNA = useAuthStore((state) => state.updateDNA)
    const correctAnswer = levels[0].correctAnswer

    const getButtonColor = (answerId: string) => {
        if(!showAnswer){
            return picked === answerId ? 'border-yellow-500 bg-yellow-500/10 scale-105' : 'border-yellow-500/30 hover:border-yellow-500/60';
        }

        if(showAnswer){
            if(answerId === correctAnswer){
                return "border-green-500 bg-green-500/20 scale-105";
            } else if(answerId === picked && answerId !== correctAnswer) {
                return "border-red-500 bg-red-500/20 scale-105"
            } else {
                return "border-yellow-500/20 opacity-50"
            }
        }
        return "border-yellow-500/30"
    }
    
    const handleCompleteMission = () => {
        if (!picked) {
            return;
        }

        setShowAnswer(true)
        
        if(picked === correctAnswer){
            const reward: number = completeMissionWithRewards(missionId)
            if (reward > 0) {
                updateDNA(reward)
            }
            
            setShowSuccessMessage(true)
            setTimeout(() => {
                onClose()
                console.log('Миссия выполнена! Награда:', reward)
            }, 2000)
        } else {
            setTimeout(() => {
                setShowAnswer(false)
                setPicked(null)
            }, 2000)
        }
    } 

    return ( 
       <section className="w-full h-full p-6">
            { !play && (
                <section className="flex flex-col gap-3">
                    <section className="flex flex-col gap-3">
                        <h2 className="text-yellow-500 text-lg ">Ответственность: Взять ответственность за ошибку</h2>
                        <p className="text-yellow-500/60 text-lg">Выбери правильный ответ и в случае неудачи возьми ответственность</p>
                    </section>
                    <button type="button" onClick={() => {setPlay(true); setPicked(null); setShowAnswer(false); setShowSuccessMessage(false)}} className="text-yellow-500 border border-yellow-500 rounded-xl px-4 py-3 w-fit self-end hover:bg-yellow-500/10 transition-all duration-200">Далее</button>
                </section>
            )}
            { play && !showSuccessMessage && (
                <section className="flex flex-col gap-3">
                    <h2 className="text-yellow-500 text-xl">Выбери по твоему мнению правильный вариант:</h2>
                    <section className="flex flex-col gap-3">
                        <p className="text-yellow-500 text-lg">{levels[0].title}</p>
                        {levels[0].answers.map((answer, i) => (
                            <button 
                                disabled={showAnswer} 
                                key={i} 
                                className={`w-full py-3 px-4 border rounded-2xl text-yellow-200 text-lg flex justify-start transition-all duration-200 ease-in-out ${getButtonColor(answer.id)}`} 
                                type="button" 
                                onClick={() => !showAnswer && setPicked(answer.id)}
                            >
                                {answer.id}: {answer.value}
                            </button>
                        ))}
                    </section>
                    {showAnswer && picked !== correctAnswer && (
                        <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 text-red-400">
                            <p className="text-lg font-semibold">Неправильный ответ!</p>
                            <p className="text-sm mt-1">Попробуй еще раз. Помни о важности ответственности.</p>
                        </div>
                    )}
                    <button 
                        disabled={!picked || showAnswer} 
                        className={`px-3 py-2 border text-lg text-white w-fit rounded-2xl self-end transition-all duration-200 ease-in-out ${
                            !picked || showAnswer 
                                ? 'bg-gray-500/30 border-gray-500/30 cursor-not-allowed opacity-50' 
                                : 'bg-transparent border border-yellow-500/30 hover:bg-yellow-500/10 hover:border-yellow-500'
                        }`} 
                        onClick={handleCompleteMission} 
                        type="button"
                    >
                        {showAnswer && picked !== correctAnswer ? 'Попробовать снова' : 'Ответить'}
                    </button>
                </section>
            )}
            {showSuccessMessage && (
                <section className="flex flex-col gap-4 items-center justify-center min-h-[300px]">
                    <div className="bg-green-500/20 border border-green-500 rounded-xl p-6 text-center">
                        <p className="text-green-400 text-2xl font-bold mb-2">✓ Миссия выполнена!</p>
                        <p className="text-green-300 text-lg">Ты правильно выбрал ответственность!</p>
                        <p className="text-yellow-400 text-sm mt-3">Награда: +30 DNA</p>
                    </div>
                </section>
            )}
       </section>
    )
}