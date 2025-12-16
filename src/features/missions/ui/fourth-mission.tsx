import { useMissionStore } from "@/widgets/store/mission-store"
import { useAuthStore } from "@/widgets/store/auth-store"
import { useState, useEffect, useRef } from "react"

interface FourthMissionProps {
    missionId: number,
    onClose: () => void
}

interface CommunicationScenario {
    id: number
    situation: string
    message: string
    channels: {
        id: string
        name: string
        icon: string
        isCorrect: boolean
        feedback: string
    }[]
    correctChannel: string
}

export default function FourthMission({missionId, onClose}: FourthMissionProps){
    const [play, setPlay] = useState(false)
    const [currentScenario, setCurrentScenario] = useState(0)
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
    const [showFeedback, setShowFeedback] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [score, setScore] = useState(0)
    const scoreRef = useRef(0)
    const [completedScenarios, setCompletedScenarios] = useState<number[]>([])
    const completeMissionWithRewards = useMissionStore((state) => state.completeMissionWithRewards)
    const updateMissionProgress = useMissionStore((state) => state.updateMissionProgress)
    const updateDNA = useAuthStore((state) => state.updateDNA)

    const scenarios: CommunicationScenario[] = [
        {
            id: 1,
            situation: "Срочная проблема с деплоем",
            message: "Производственный сервер упал, нужно срочно исправить. Вся команда должна быть в курсе.",
            channels: [
                {
                    id: 'A',
                    name: "Личная встреча",
                    icon: "👥",
                    isCorrect: false,
                    feedback: "Для срочной проблемы личная встреча может занять слишком много времени. Нужен более быстрый способ."
                },
                {
                    id: 'B',
                    name: "Email",
                    icon: "📧",
                    isCorrect: false,
                    feedback: "Email не подходит для срочных ситуаций - сообщение может быть прочитано не сразу."
                },
                {
                    id: 'C',
                    name: "Чат команды",
                    icon: "💬",
                    isCorrect: true,
                    feedback: "Отлично! Чат команды - идеальный канал для срочных вопросов. Все увидят сообщение быстро."
                },
                {
                    id: 'D',
                    name: "Личное сообщение одному коллеге",
                    icon: "📱",
                    isCorrect: false,
                    feedback: "Для срочной проблемы всей команды нужно сообщить всем сразу, а не одному человеку."
                }
            ],
            correctChannel: 'C'
        },
        {
            id: 2,
            situation: "Обсуждение архитектурного решения",
            message: "Нужно обсудить новую архитектуру модуля. Это важное решение, требующее обсуждения и фиксации.",
            channels: [
                {
                    id: 'A',
                    name: "Чат команды",
                    icon: "💬",
                    isCorrect: false,
                    feedback: "Чат подходит для обсуждения, но важные архитектурные решения лучше фиксировать письменно."
                },
                {
                    id: 'B',
                    name: "Личная встреча + протокол",
                    icon: "👥",
                    isCorrect: true,
                    feedback: "Правильно! Личная встреча позволяет обсудить детали, а протокол фиксирует решение для всех."
                },
                {
                    id: 'C',
                    name: "Личное сообщение",
                    icon: "📱",
                    isCorrect: false,
                    feedback: "Архитектурные решения должны обсуждаться всей командой, а не в личных сообщениях."
                },
                {
                    id: 'D',
                    name: "Email без встречи",
                    icon: "📧",
                    isCorrect: false,
                    feedback: "Email хорош для фиксации, но сложные решения лучше обсуждать лично для понимания всеми."
                }
            ],
            correctChannel: 'B'
        },
        {
            id: 3,
            situation: "Обратная связь по коду коллеги",
            message: "Нужно дать конструктивную обратную связь по коду. Важно быть тактичным и помочь улучшить качество.",
            channels: [
                {
                    id: 'A',
                    name: "Публичный комментарий в PR",
                    icon: "💬",
                    isCorrect: false,
                    feedback: "Публичные комментарии могут смутить коллегу. Для обратной связи лучше выбрать более приватный канал."
                },
                {
                    id: 'B',
                    name: "Личное сообщение",
                    icon: "📱",
                    isCorrect: true,
                    feedback: "Отлично! Личное сообщение позволяет дать тактичную обратную связь один на один."
                },
                {
                    id: 'C',
                    name: "Email",
                    icon: "📧",
                    isCorrect: false,
                    feedback: "Email может показаться слишком формальным для обратной связи по коду."
                },
                {
                    id: 'D',
                    name: "Игнорировать",
                    icon: "🙈",
                    isCorrect: false,
                    feedback: "Обратная связь важна для роста команды. Нужно открыто общаться, даже если это неудобно."
                }
            ],
            correctChannel: 'B'
        },
        {
            id: 4,
            situation: "Объявление о новом процессе",
            message: "Вводится новый процесс code review. Нужно сообщить всей команде о правилах и сроках.",
            channels: [
                {
                    id: 'A',
                    name: "Личное сообщение каждому",
                    icon: "📱",
                    isCorrect: false,
                    feedback: "Для объявления всей команде лучше использовать общий канал, чтобы все видели одно и то же."
                },
                {
                    id: 'B',
                    name: "Email + объявление в чате",
                    icon: "📧",
                    isCorrect: true,
                    feedback: "Правильно! Email фиксирует информацию, а объявление в чате привлекает внимание всех."
                },
                {
                    id: 'C',
                    name: "Только чат",
                    icon: "💬",
                    isCorrect: false,
                    feedback: "Чат хорош для привлечения внимания, но важные процессы лучше фиксировать в email."
                },
                {
                    id: 'D',
                    name: "Только личная встреча",
                    icon: "👥",
                    isCorrect: false,
                    feedback: "Личная встреча хороша для обсуждения, но не все могут присутствовать. Нужна письменная фиксация."
                }
            ],
            correctChannel: 'B'
        },
        {
            id: 5,
            situation: "Критическая ошибка в продакшене",
            message: "Обнаружена критическая уязвимость безопасности. Нужно срочно сообщить команде и начать исправление.",
            channels: [
                {
                    id: 'A',
                    name: "Email",
                    icon: "📧",
                    isCorrect: false,
                    feedback: "Email может быть прочитан не сразу. Для критической проблемы безопасности нужен более быстрый канал."
                },
                {
                    id: 'B',
                    name: "Чат + срочный звонок",
                    icon: "📞",
                    isCorrect: true,
                    feedback: "Идеально! Чат привлекает внимание, а звонок гарантирует, что все в курсе критической ситуации."
                },
                {
                    id: 'C',
                    name: "Только чат",
                    icon: "💬",
                    isCorrect: false,
                    feedback: "Чат хорош, но для критической проблемы безопасности лучше также позвонить для гарантии."
                },
                {
                    id: 'D',
                    name: "Личная встреча",
                    icon: "👥",
                    isCorrect: false,
                    feedback: "Для критической проблемы личная встреча может занять слишком много времени на организацию."
                }
            ],
            correctChannel: 'B'
        }
    ]

    const handleChannelSelect = (channelId: string) => {
        if (selectedChannel) return // Предотвращаем повторный выбор
        
        setSelectedChannel(channelId)
        const scenario = scenarios[currentScenario]
        const channel = scenario.channels.find(c => c.id === channelId)
        
        if (channel?.isCorrect) {
            // Обновляем scoreRef синхронно для использования в handleNext
            setScore(prev => {
                const newScore = prev + 1
                scoreRef.current = newScore
                return newScore
            })
            setCompletedScenarios(prev => [...prev, scenario.id])
        }
        
        setShowFeedback(true)
    }

    const handleNext = () => {
        if (currentScenario < scenarios.length - 1) {
            setCurrentScenario(prev => prev + 1)
            setSelectedChannel(null)
            setShowFeedback(false)
        } else {
            // Все сценарии пройдены
            // Используем актуальное значение score из ref (оно уже включает последний правильный ответ)
            const finalScore = scoreRef.current
            const progress = Math.round((finalScore / scenarios.length) * 100)
            updateMissionProgress(missionId, progress)
            
            if (finalScore >= scenarios.length * 0.8) { // 80% правильных ответов
                const reward = completeMissionWithRewards(missionId)
                if (reward > 0) {
                    updateDNA(reward)
                }
                setShowSuccessMessage(true)
                setTimeout(() => {
                    onClose()
                }, 3000)
            } else {
                // Недостаточно правильных ответов
                setShowSuccessMessage(true)
                setTimeout(() => {
                    onClose()
                }, 3000)
            }
        }
    }

    // Синхронизируем scoreRef с score
    useEffect(() => {
        scoreRef.current = score
    }, [score])

    // Обновляем прогресс при изменении score
    useEffect(() => {
        if (play && score > 0) {
            const progress = Math.round((score / scenarios.length) * 100)
            updateMissionProgress(missionId, progress)
        }
    }, [score, play, missionId, scenarios.length, updateMissionProgress])

    const currentScenarioData = scenarios[currentScenario]
    const isLastScenario = currentScenario === scenarios.length - 1
    const selectedChannelData = selectedChannel 
        ? currentScenarioData.channels.find(c => c.id === selectedChannel)
        : null

    return (
        <section className="w-full h-full p-6">
            {!play && (
                <section className="flex flex-col gap-3">
                    <section className="flex flex-col gap-3">
                        <h2 className="text-yellow-500 text-lg">Открытое общение: Выбери правильный канал</h2>
                        <p className="text-yellow-500/60 text-lg">
                            Эффективная коммуникация — основа успешной команды. Выбери правильный способ общения для каждой ситуации.
                        </p>
                        <p className="text-yellow-500/40 text-sm mt-2">
                            В разных ситуациях нужны разные каналы коммуникации. Личная встреча, чат, email или звонок — 
                            каждый имеет свое место. Покажи, что ты понимаешь, когда и как лучше общаться с командой.
                        </p>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-2">
                            <p className="text-yellow-200 text-sm font-semibold mb-2">🎯 Цель игры:</p>
                            <ul className="text-yellow-200/70 text-xs space-y-1 list-disc list-inside">
                                <li>Пройди {scenarios.length} сценариев коммуникации</li>
                                <li>Выбери правильный канал общения для каждой ситуации</li>
                                <li>Набери минимум 80% правильных ответов для успешного прохождения</li>
                                <li>Покажи понимание открытого и эффективного общения в команде</li>
                            </ul>
                        </div>
                    </section>
                    <button 
                        type="button" 
                        onClick={() => setPlay(true)} 
                        className="text-yellow-500 border border-yellow-500 rounded-xl px-4 py-3 w-fit self-end hover:bg-yellow-500/10 transition-all duration-200"
                    >
                        Начать игру
                    </button>
                </section>
            )}

            {play && !showSuccessMessage && (
                <section className="flex flex-col gap-6">
                    <section className="flex items-center justify-between">
                        <div className="bg-blue-500/20 border border-blue-500 rounded-xl px-4 py-2">
                            <p className="text-blue-200 text-sm">
                                Сценарий <span className="font-bold text-lg text-blue-300">{currentScenario + 1}/{scenarios.length}</span>
                            </p>
                        </div>
                        <div className="bg-green-500/20 border border-green-500 rounded-xl px-4 py-2">
                            <p className="text-green-200 text-sm">
                                Правильно: <span className="font-bold text-lg text-green-300">{score}/{scenarios.length}</span>
                            </p>
                        </div>
                    </section>

                    <section className="bg-[#1a1a1a] border-2 border-yellow-500/30 rounded-xl p-6 space-y-4">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                            <p className="text-yellow-500/70 text-xs uppercase tracking-wider mb-2">Ситуация</p>
                            <p className="text-yellow-200 text-lg font-semibold">{currentScenarioData.situation}</p>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <p className="text-blue-500/70 text-xs uppercase tracking-wider mb-2">Сообщение</p>
                            <p className="text-blue-200 text-base">{currentScenarioData.message}</p>
                        </div>

                        <div className="space-y-2 mt-6">
                            <p className="text-yellow-200/80 text-sm font-semibold mb-3">
                                Выбери правильный канал коммуникации:
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {currentScenarioData.channels.map((channel) => {
                                    const isSelected = selectedChannel === channel.id
                                    const isCorrect = channel.isCorrect
                                    const showResult = showFeedback && isSelected
                                    
                                    return (
                                        <button
                                            key={channel.id}
                                            type="button"
                                            onClick={() => handleChannelSelect(channel.id)}
                                            disabled={!!selectedChannel}
                                            className={`
                                                p-4 rounded-xl border-2 transition-all duration-200
                                                ${!selectedChannel 
                                                    ? 'border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50 hover:bg-yellow-500/10 cursor-pointer' 
                                                    : isSelected && isCorrect
                                                    ? 'border-green-500 bg-green-500/20 cursor-default'
                                                    : isSelected && !isCorrect
                                                    ? 'border-red-500 bg-red-500/20 cursor-default'
                                                    : 'border-gray-700 bg-gray-800/30 opacity-50 cursor-not-allowed'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{channel.icon}</span>
                                                <div className="flex-1 text-left">
                                                    <p className="text-white font-semibold">{channel.name}</p>
                                                </div>
                                                {showResult && (
                                                    <span className={`text-lg ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                                        {isCorrect ? '✓' : '✗'}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {showFeedback && selectedChannelData && (
                            <div className={`
                                mt-4 p-4 rounded-xl border-2
                                ${selectedChannelData.isCorrect 
                                    ? 'bg-green-500/10 border-green-500/30' 
                                    : 'bg-red-500/10 border-red-500/30'
                                }
                            `}>
                                <p className={`
                                    text-sm
                                    ${selectedChannelData.isCorrect ? 'text-green-300' : 'text-red-300'}
                                `}>
                                    {selectedChannelData.feedback}
                                </p>
                            </div>
                        )}

                        {showFeedback && (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="w-full bg-yellow-500/20 border border-yellow-500 text-yellow-300 py-3 rounded-xl hover:bg-yellow-500/30 transition-all duration-200 font-semibold mt-4"
                            >
                                {isLastScenario ? 'Завершить' : 'Следующий сценарий'}
                            </button>
                        )}
                    </section>
                </section>
            )}

            {showSuccessMessage && (
                <section className="flex flex-col gap-4 items-center justify-center min-h-[300px]">
                    <div className="bg-green-500/20 border border-green-500 rounded-xl p-6 text-center max-w-md">
                        <p className="text-green-400 text-2xl font-bold mb-2">
                            {score >= scenarios.length * 0.8 ? '✓ Миссия выполнена!' : '⚠️ Попробуй еще раз'}
                        </p>
                        <p className="text-green-300 text-lg mb-2">
                            Правильных ответов: {score}/{scenarios.length}
                        </p>
                        {score >= scenarios.length * 0.8 ? (
                            <>
                                <p className="text-green-200/70 text-sm mt-2">
                                    Ты показал отличное понимание эффективной коммуникации в команде! 
                                    Открытое общение — это выбор правильного канала в нужное время.
                                </p>
                                <p className="text-yellow-400 text-sm mt-3">Награда: +20 DNA</p>
                            </>
                        ) : (
                            <p className="text-red-200/70 text-sm mt-2">
                                Нужно набрать минимум {Math.ceil(scenarios.length * 0.8)} правильных ответов. 
                                Попробуй еще раз и подумай о том, какой канал лучше подходит для каждой ситуации.
                            </p>
                        )}
                    </div>
                </section>
            )}
        </section>
    )
}

