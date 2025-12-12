import { useMissionStore } from "@/widgets/store/mission-store"
import { useState } from "react"

interface FirstMissionProps {
    missionId: number,
    onClose: () => void
}

export default function FirstMission({missionId, onClose}: FirstMissionProps){
    const levels = [
        {
            title: 'Релиз проекта через 1 час но в нем есть критическая ошибкаи ты единственный кто ее заметил',
            answers: [
                {id: 'A', value: 'Сказать что это не твоя зона отвественности'},
                {id: 'B', value: 'Взять на себя исправление проекта'},
                {id: 'C', value: 'Промолчать о проблеме'},
                {id: 'D', value: 'Спихнуть на кого то другого'}
            ],
            correctAnswer: 'B'
            
        }
    ]
    const [play , setPlay] = useState(false) 
    const [picked , setPicked] = useState<string | null>(null)
    const [showAnswer, setShowAnswer] = useState(false)
    const completeMission = useMissionStore((state) => state.completeMission)
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
        setShowAnswer(true)
        if(picked === correctAnswer){
            setTimeout(() => {
                completeMission(missionId)
                onClose()
                console.log('Миссия выполнена!')
            }, 500)
        }
    } 

    return ( 
       <section className="w-full h-full p-6">
            { !play && (
                <section className="flex flex-col gap-3">
                    <section className="flex flex-col gap-3">
                        <h2 className="text-yellow-500 text-lg ">Отвественность: Взять отвественность за ошибку</h2>
                        <p className="text-yellow-500/60 text-lg">Выбери правильный ответ и в случае неудачи возьми отвественность</p>
                    </section>
                    <button type="button" onClick={() => {setPlay(true); setPicked(null)}} className="text-yellow-500 border border-yellow-500 rounded-xl px-4 py-3 w-fit self-end">Далее</button>
                </section>
            )}
            { play && (
                <section className="flex flex-col gap-3">
                    <h2 className="text-yellow-500 text-xl">Выбери по твоему мнению правильный вариант:</h2>
                    <section className="flex flex-col gap-3">
                        <p className="text-yellow-500 text-lg">{levels[0].title}</p>
                        {levels[0].answers.map((answer, i) => (
                            <button disabled={showAnswer} key={i} className={`w-full py-3 px-4 border rounded-2xl text-yellow-200 text-lg flex justify-start transition-all duration-200 ease-in-out ${getButtonColor(answer.id)}}`} type="button" onClick={() => setPicked(answer.id)}>{answer.id}: {answer.value}</button>
                        ))}
                    </section>
                        <button className={`px-3 py-2 border text-lg text-white w-fit rounded-2xl self-end transition-all duration-200 ease-in-out ${showAnswer ? 'bg-yellow-500 border-transparent' : 'bg-transparent border border-yellow-500/30'}`} onClick={handleCompleteMission} type="button">Ответить</button>
                </section>
            )}
       </section>
    )
}