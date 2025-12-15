import { useMissionStore } from "@/widgets/store/mission-store"
import { useAuthStore } from "@/widgets/store/auth-store"
import { useState } from "react"

interface SecondMissionProps {
    missionId: number,
    onClose: () => void
}

interface DialogueOption {
    id: string
    text: string
    isCorrect: boolean
    feedback: string
}

interface DialogueStep {
    id: number
    speaker: string
    message: string
    options: DialogueOption[]
    correctAnswer: string
}

export default function SecondMission({missionId, onClose}: SecondMissionProps){
    const [play, setPlay] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [showFeedback, setShowFeedback] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [score, setScore] = useState(0)
    const completeMissionWithRewards = useMissionStore((state) => state.completeMissionWithRewards)
    const updateMissionProgress = useMissionStore((state) => state.updateMissionProgress)
    const updateDNA = useAuthStore((state) => state.updateDNA)

    const dialogueSteps: DialogueStep[] = [
        {
            id: 1,
            speaker: "Коллега",
            message: "У нас проблема с дедлайном проекта. Клиент недоволен задержками. Что делать?",
            options: [
                {
                    id: 'A',
                    text: "Это не моя проблема, пусть менеджер разбирается",
                    isCorrect: false,
                    feedback: "Это не демонстрирует прозрачность. Нужно честно обсудить проблему."
                },
                {
                    id: 'B',
                    text: "Давай честно обсудим ситуацию и найдем решение вместе",
                    isCorrect: true,
                    feedback: "Отлично! Честное обсуждение — основа прозрачности."
                },
                {
                    id: 'C',
                    text: "Скажем клиенту, что все идет по плану",
                    isCorrect: false,
                    feedback: "Скрытие проблем противоречит прозрачности. Нужна честность."
                }
            ],
            correctAnswer: 'B'
        },
        {
            id: 2,
            speaker: "Команда",
            message: "Как лучше сообщить клиенту о задержке?",
            options: [
                {
                    id: 'A',
                    text: "Сообщить сразу, объяснить причины и предложить план решения",
                    isCorrect: true,
                    feedback: "Правильно! Открытое обсуждение проблем укрепляет доверие."
                },
                {
                    id: 'B',
                    text: "Подождать, может быть успеем в срок",
                    isCorrect: false,
                    feedback: "Промедление снижает прозрачность. Нужна ясность на каждом этапе."
                },
                {
                    id: 'C',
                    text: "Сообщить в последний момент",
                    isCorrect: false,
                    feedback: "Это не прозрачно. Клиент должен быть в курсе ситуации."
                }
            ],
            correctAnswer: 'A'
        },
        {
            id: 3,
            speaker: "Клиент",
            message: "Почему произошла задержка? Что вы делаете для решения?",
            options: [
                {
                    id: 'A',
                    text: "Винить других и оправдываться",
                    isCorrect: false,
                    feedback: "Оправдания не создают прозрачности. Нужна ясность."
                },
                {
                    id: 'B',
                    text: "Честно объяснить причины, показать текущий статус и план действий",
                    isCorrect: true,
                    feedback: "Идеально! Ясность на каждом этапе укрепляет доверие."
                },
                {
                    id: 'C',
                    text: "Умалчивать детали, говорить общими фразами",
                    isCorrect: false,
                    feedback: "Недостаток информации снижает прозрачность. Нужна ясность."
                }
            ],
            correctAnswer: 'B'
        },
        {
            id: 4,
            speaker: "Команда",
            message: "Как поддерживать прозрачность в будущем?",
            options: [
                {
                    id: 'A',
                    text: "Регулярно обновлять статус проекта, честно обсуждать проблемы",
                    isCorrect: true,
                    feedback: "Отлично! Регулярная прозрачность укрепляет долгосрочное доверие."
                },
                {
                    id: 'B',
                    text: "Сообщать только о хороших новостях",
                    isCorrect: false,
                    feedback: "Прозрачность требует честности в любой ситуации."
                },
                {
                    id: 'C',
                    text: "Обсуждать проблемы только внутри команды",
                    isCorrect: false,
                    feedback: "Прозрачность включает открытое обсуждение с клиентами."
                }
            ],
            correctAnswer: 'A'
        }
    ]

    const handleOptionSelect = (optionId: string) => {
        if (showFeedback) return
        setSelectedOption(optionId)
    }

    const handleSubmit = () => {
        if (!selectedOption) return

        const currentDialogue = dialogueSteps[currentStep]
        const selectedOptionData = currentDialogue.options.find(opt => opt.id === selectedOption)
        
        if (!selectedOptionData) return

        setShowFeedback(true)

        if (selectedOptionData.isCorrect) {
            const newScore = score + 1
            setScore(newScore)
            
            // Обновляем прогресс миссии (25% за каждый правильный ответ)
            const progress = Math.round((newScore / dialogueSteps.length) * 100)
            updateMissionProgress(missionId, progress)
            
            // Переходим к следующему шагу или завершаем
            setTimeout(() => {
                if (currentStep < dialogueSteps.length - 1) {
                    setCurrentStep(currentStep + 1)
                    setSelectedOption(null)
                    setShowFeedback(false)
                } else {
                    // Все шаги пройдены
                    updateMissionProgress(missionId, 100)
                    const reward: number = completeMissionWithRewards(missionId)
                    if (reward > 0) {
                        updateDNA(reward)
                    }
                    setShowSuccessMessage(true)
                    setTimeout(() => {
                        onClose()
                    }, 3000)
                }
            }, 2000)
        } else {
            // Неправильный ответ - можно повторить
            setTimeout(() => {
                setSelectedOption(null)
                setShowFeedback(false)
            }, 2000)
        }
    }

    const currentDialogue = dialogueSteps[currentStep]
    const selectedOptionData = currentDialogue?.options.find(opt => opt.id === selectedOption)

    return ( 
       <section className="w-full h-full p-6">
            { !play && (
                <section className="flex flex-col gap-3">
                    <section className="flex flex-col gap-3">
                        <h2 className="text-yellow-500 text-lg">Прозрачность: Открытое обсуждение проблем</h2>
                        <p className="text-yellow-500/60 text-lg">
                            Честно и открыто обсуждаем проблемы и решения внутри команды и с клиентами, укрепляя доверие и обеспечивая ясность на каждом этапе проекта.
                        </p>
                        <p className="text-yellow-500/40 text-sm mt-2">
                            Проект столкнулся с проблемами. Проведи честные диалоги с командой и клиентом, выбирая ответы, которые демонстрируют прозрачность.
                        </p>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-2">
                            <p className="text-yellow-200 text-sm font-semibold mb-1">🎯 Цель игры:</p>
                            <p className="text-yellow-200/70 text-xs">
                                Пройди 4 диалога, выбирая ответы, которые демонстрируют честность, открытость и ясность. Правильные ответы укрепляют доверие.
                            </p>
                        </div>
                    </section>
                    <button 
                        type="button" 
                        onClick={() => {
                            setPlay(true)
                            setCurrentStep(0)
                            setScore(0)
                            setSelectedOption(null)
                            setShowFeedback(false)
                        }} 
                        className="text-yellow-500 border border-yellow-500 rounded-xl px-4 py-3 w-fit self-end hover:bg-yellow-500/10 transition-all duration-200"
                    >
                        Начать диалог
                    </button>
                </section>
            )}
            { play && !showSuccessMessage && (
                <section className="flex flex-col gap-6">
                    <section className="flex items-center justify-between">
                        <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl px-4 py-2">
                            <p className="text-yellow-200 text-sm">Диалог: <span className="font-bold text-lg">{currentStep + 1}/{dialogueSteps.length}</span></p>
                        </div>
                        <div className="bg-green-500/20 border border-green-500 rounded-xl px-4 py-2">
                            <p className="text-green-200 text-sm">Правильных ответов: <span className="font-bold text-lg">{score}</span></p>
                        </div>
                    </section>

                    <section className="bg-[#1a1a1a] border border-yellow-500/30 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                <span className="text-2xl">💬</span>
                            </div>
                            <div>
                                <p className="text-yellow-400 font-semibold text-lg">{currentDialogue.speaker}</p>
                                <p className="text-yellow-500/60 text-xs">Говорит с тобой</p>
                            </div>
                        </div>
                        <div className="bg-[#0a0a0a] rounded-lg p-4 border border-yellow-500/20">
                            <p className="text-yellow-200 text-base leading-relaxed">{currentDialogue.message}</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-yellow-400 text-lg font-semibold">Твой ответ:</h3>
                        {currentDialogue.options.map((option) => {
                            const isSelected = selectedOption === option.id
                            const isCorrect = option.isCorrect
                            const showResult = showFeedback && isSelected

                            return (
                                <button
                                    key={option.id}
                                    disabled={showFeedback}
                                    onClick={() => handleOptionSelect(option.id)}
                                    className={`
                                        w-full p-4 border-2 rounded-xl text-left transition-all duration-200
                                        ${showFeedback
                                            ? isCorrect && isSelected
                                                ? 'border-green-500 bg-green-500/20 text-green-300'
                                                : !isCorrect && isSelected
                                                ? 'border-red-500 bg-red-500/20 text-red-300'
                                                : 'border-gray-600 bg-gray-800/30 opacity-50'
                                            : isSelected
                                            ? 'border-yellow-500 bg-yellow-500/20 text-yellow-200 scale-105'
                                            : 'border-yellow-500/30 bg-[#1a1a1a] text-yellow-200/70 hover:border-yellow-500/60 hover:bg-yellow-500/10'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`
                                            w-8 h-8 rounded-full flex items-center justify-center font-bold
                                            ${showFeedback && isSelected
                                                ? isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                            }
                                        `}>
                                            {option.id}
                                        </span>
                                        <span>{option.text}</span>
                                        {showResult && (
                                            <span className="ml-auto text-xl">
                                                {isCorrect ? '✓' : '✗'}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </section>

                    {showFeedback && selectedOptionData && (
                        <div className={`
                            p-4 rounded-xl border
                            ${selectedOptionData.isCorrect
                                ? 'bg-green-500/20 border-green-500 text-green-300'
                                : 'bg-red-500/20 border-red-500 text-red-300'
                            }
                        `}>
                            <p className="font-semibold mb-1">
                                {selectedOptionData.isCorrect ? '✓ Правильно!' : '✗ Неправильно'}
                            </p>
                            <p className="text-sm">{selectedOptionData.feedback}</p>
                        </div>
                    )}

                    {!showFeedback && (
                        <button
                            disabled={!selectedOption}
                            onClick={handleSubmit}
                            className={`
                                w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200
                                ${!selectedOption
                                    ? 'bg-gray-500/30 border border-gray-500/30 text-gray-500 cursor-not-allowed'
                                    : 'bg-yellow-500/20 border border-yellow-500 text-yellow-300 hover:bg-yellow-500/30'
                                }
                            `}
                        >
                            Ответить
                        </button>
                    )}
                </section>
            )}
            { showSuccessMessage && (
                <section className="flex flex-col gap-4 items-center justify-center min-h-[300px]">
                    <div className="bg-green-500/20 border border-green-500 rounded-xl p-6 text-center">
                        <p className="text-green-400 text-2xl font-bold mb-2">✓ Миссия выполнена!</p>
                        <p className="text-green-300 text-lg">Прозрачность обеспечена в команде!</p>
                        <p className="text-green-200/70 text-sm mt-2">
                            Ты продемонстрировал честность, открытое обсуждение и ясность на каждом этапе. Доверие укреплено!
                        </p>
                        <p className="text-yellow-400 text-sm mt-3">Награда: +35 DNA</p>
                    </div>
                </section>
            )}
       </section>
    )
}
