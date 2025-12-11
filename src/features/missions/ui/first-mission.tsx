import { useState } from "react"


export default function FirstMission(){
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
    const [picked , setPicked] = useState(levels[0].answers[0].id)
    const [showAnswer, setShowAnswer] = useState(false)
    
    return ( 
       <section className="w-full h-full p-6">
            { !play && (
                <section className="flex flex-col gap-3">
                    <section className="flex flex-col gap-3">
                        <h2 className="text-yellow-500 text-lg ">Отвественность: Взять отвественность за ошибку</h2>
                        <p className="text-yellow-500/60 text-lg">Выбери правильный ответ и в случае неудачи возьми отвественность</p>
                    </section>
                    <button type="button" onClick={() => setPlay(true)} className="text-yellow-500 border border-yellow-500 rounded-xl px-4 py-3 w-fit self-end">Далее</button>
                </section>
            )}
            { play && (
                <section className="flex flex-col gap-3">
                    <h2 className="text-yellow-500 text-xl">Выбери по твоему мнению правильный вариант:</h2>
                    <section className="flex flex-col gap-3">
                        <p className="text-yellow-500 text-lg">{levels[0].title}</p>
                        {levels[0].answers.map((answer, i) => (
                            <button disabled={showAnswer} key={i} className={`w-full py-3 px-4 border border-yellow-500/30 rounded-2xl text-yellow-200 text-lg flex justify-start transition-all duration-200 ease-in-out ${picked === answer.id  ? 'scale-105' : 'scale-103'} ${showAnswer && picked === answer.id ? 'opacity-100' : showAnswer && picked !== answer.value ? 'opacity-50' : 'opacity-100' }`} type="button" onClick={() => setPicked(answer.id)}>{answer.id}: {answer.value}</button>
                        ))}
                    </section>
                    <section className="flex gap-3 items-center justify-end">
                        <button className={`px-3 py-2 border border-yellow-500/30 text-lg text-white w-fit rounded-2xl self-end`} onClick={() => setShowAnswer(false)} type="button">Отменить</button>
                        <button className={`px-3 py-2 border text-lg text-white w-fit rounded-2xl self-end transition-all duration-200 ease-in-out ${showAnswer ? 'bg-yellow-500 border-transparent' : 'bg-transparent border border-yellow-500/30'}`} onClick={() => setShowAnswer(true)} type="button">Ответить</button>
                    </section>
                </section>
            )}
            { showAnswer && (
                <section>

                </section>
            )}
       </section>
    )
}