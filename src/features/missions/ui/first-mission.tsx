import { useMissionStore } from "@/widgets/store/mission-store"
import { useAuthStore } from "@/widgets/store/auth-store"
import { useState, useEffect } from "react"

interface FirstMissionProps {
    missionId: number,
    onClose: () => void
}

interface Bug {
    id: number
    line: number
    code: string
    fixedCode: string
    description: string
}

export default function FirstMission({missionId, onClose}: FirstMissionProps){
    const [play, setPlay] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [timeLeft, setTimeLeft] = useState(60)
    const [bugs, setBugs] = useState<Bug[]>([])
    const [fixedBugs, setFixedBugs] = useState<number[]>([])
    const [selectedBug, setSelectedBug] = useState<number | null>(null)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const completeMissionWithRewards = useMissionStore((state) => state.completeMissionWithRewards)
    const updateDNA = useAuthStore((state) => state.updateDNA)

    const codeBugs: Bug[] = [
        {
            id: 1,
            line: 5,
            code: "const data = fetch('/api/users')",
            fixedCode: "const data = await fetch('/api/users')",
            description: "Отсутствует await для асинхронной операции"
        },
        {
            id: 2,
            line: 12,
            code: "if (user = null) {",
            fixedCode: "if (user === null) {",
            description: "Использован оператор присваивания вместо сравнения"
        },
        {
            id: 3,
            line: 18,
            code: "return users.map(user => user.name)",
            fixedCode: "return users?.map(user => user.name) ?? []",
            description: "Отсутствует проверка на null/undefined"
        },
        {
            id: 4,
            line: 25,
            code: "setTimeout(() => updateData(), 1000)",
            fixedCode: "setTimeout(() => updateData(), 1000)",
            description: "Отсутствует очистка таймера (не критично, но лучше исправить)"
        }
    ]

    useEffect(() => {
        if (gameStarted && timeLeft > 0 && fixedBugs.length < codeBugs.length) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else if (timeLeft === 0 || (gameStarted && fixedBugs.length === codeBugs.length)) {
            handleGameEnd()
        }
    }, [timeLeft, gameStarted, fixedBugs.length])

    const startGame = () => {
        setGameStarted(true)
        setBugs([...codeBugs])
        setTimeLeft(60)
        setFixedBugs([])
        setSelectedBug(null)
    }

    const handleBugClick = (bugId: number) => {
        if (fixedBugs.includes(bugId)) return
        setSelectedBug(bugId)
    }

    const fixBug = () => {
        if (selectedBug === null) return
        
        const bug = bugs.find(b => b.id === selectedBug)
        if (!bug) return

        const updatedBugs = bugs.map(b => 
            b.id === selectedBug ? { ...b, code: b.fixedCode } : b
        )
        setBugs(updatedBugs)
        setFixedBugs([...fixedBugs, selectedBug])
        setSelectedBug(null)

        // Проверяем, все ли баги исправлены
        if (fixedBugs.length + 1 === codeBugs.length) {
            setTimeout(() => handleGameEnd(), 500)
        }
    }

    const handleGameEnd = () => {
        setGameStarted(false)
        if (fixedBugs.length === codeBugs.length || (timeLeft > 0 && fixedBugs.length === codeBugs.length)) {
            const reward: number = completeMissionWithRewards(missionId)
            if (reward > 0) {
                updateDNA(reward)
            }
            setShowSuccessMessage(true)
            setTimeout(() => {
                onClose()
            }, 3000)
        } else {
            setGameOver(true)
        }
    }

    const restartGame = () => {
        setGameOver(false)
        setFixedBugs([])
        setSelectedBug(null)
        setBugs([...codeBugs])
        setTimeLeft(60)
        setGameStarted(true)
    }

    const selectedBugData = bugs.find(b => b.id === selectedBug)

    return ( 
       <section className="w-full h-full p-6">
            { !play && (
                <section className="flex flex-col gap-3">
                    <section className="flex flex-col gap-3">
                        <h2 className="text-yellow-500 text-lg">Ответственность: Ответственность за результат</h2>
                        <p className="text-yellow-500/60 text-lg">
                            Основа отношений — ответственность за результат. Мы верим в ответственность, не ограниченную инструкциями.
                        </p>
                        <p className="text-yellow-500/40 text-sm mt-2">
                            Проект срывается по срокам из-за критических ошибок в коде. Возьми ответственность и исправь все баги до истечения времени!
                        </p>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-2">
                            <p className="text-yellow-200 text-sm font-semibold mb-1">🎯 Цель игры:</p>
                            <p className="text-yellow-200/70 text-xs">
                                Найди и исправь все 4 ошибки в коде. У тебя есть 60 секунд. Кликай на строки с ошибками, затем нажми "Исправить".
                            </p>
                        </div>
                    </section>
                    <button 
                        type="button" 
                        onClick={() => {
                            setPlay(true)
                            startGame()
                        }} 
                        className="text-yellow-500 border border-yellow-500 rounded-xl px-4 py-3 w-fit self-end hover:bg-yellow-500/10 transition-all duration-200"
                    >
                        Начать исправление
                    </button>
                </section>
            )}
            { play && gameStarted && !showSuccessMessage && !gameOver && (
                <section className="flex flex-col gap-4">
                    <section className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl px-4 py-2">
                                <p className="text-yellow-200 text-sm">Время: <span className="font-bold text-lg">{timeLeft}с</span></p>
                            </div>
                            <div className="bg-green-500/20 border border-green-500 rounded-xl px-4 py-2">
                                <p className="text-green-200 text-sm">Исправлено: <span className="font-bold text-lg">{fixedBugs.length}/{codeBugs.length}</span></p>
                            </div>
                        </div>
                        <div className="w-32 bg-gray-700 rounded-full h-2">
                            <div 
                                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(fixedBugs.length / codeBugs.length) * 100}%` }}
                            />
                        </div>
                    </section>

                    <section className="grid grid-cols-2 gap-4">
                        <section className="bg-[#1a1a1a] border border-yellow-500/30 rounded-xl p-4">
                            <h3 className="text-yellow-400 text-lg font-semibold mb-3">📝 Код с ошибками:</h3>
                            <div className="bg-[#0a0a0a] rounded-lg p-4 font-mono text-sm space-y-2">
                                {bugs.map((bug) => {
                                    const isFixed = fixedBugs.includes(bug.id)
                                    const isSelected = selectedBug === bug.id
                                    return (
                                        <div
                                            key={bug.id}
                                            onClick={() => !isFixed && handleBugClick(bug.id)}
                                            className={`
                                                p-2 rounded cursor-pointer transition-all duration-200
                                                ${isFixed 
                                                    ? 'bg-green-500/10 border border-green-500/30 text-green-300 line-through opacity-60' 
                                                    : isSelected
                                                    ? 'bg-yellow-500/20 border border-yellow-500 scale-105'
                                                    : 'bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20'
                                                }
                                            `}
                                        >
                                            <span className="text-gray-500 mr-2">{bug.line}:</span>
                                            <code className={isFixed ? 'line-through' : ''}>{bug.code}</code>
                                            {isFixed && <span className="ml-2 text-green-400">✓</span>}
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                        <section className="bg-[#1a1a1a] border border-yellow-500/30 rounded-xl p-4">
                            <h3 className="text-yellow-400 text-lg font-semibold mb-3">
                                {selectedBugData ? '🔍 Детали ошибки:' : 'Выбери ошибку для исправления'}
                            </h3>
                            {selectedBugData && !fixedBugs.includes(selectedBugData.id) && (
                                <div className="space-y-3">
                                    <div className="bg-[#0a0a0a] rounded-lg p-3">
                                        <p className="text-red-300 text-sm mb-2">❌ Текущий код:</p>
                                        <code className="text-red-400 font-mono text-xs block">{selectedBugData.code}</code>
                                    </div>
                                    <div className="bg-[#0a0a0a] rounded-lg p-3">
                                        <p className="text-green-300 text-sm mb-2">✅ Исправленный код:</p>
                                        <code className="text-green-400 font-mono text-xs block">{selectedBugData.fixedCode}</code>
                                    </div>
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                        <p className="text-blue-300 text-xs">{selectedBugData.description}</p>
                                    </div>
                            <button 
                                        onClick={fixBug}
                                        className="w-full bg-green-500/20 border border-green-500 text-green-300 py-2 px-4 rounded-lg hover:bg-green-500/30 transition-all duration-200 font-semibold"
                                    >
                                        Исправить ошибку
                            </button>
                                </div>
                            )}
                            {!selectedBugData && (
                                <div className="text-yellow-500/50 text-sm text-center py-8">
                                    Кликни на строку с ошибкой слева
                                </div>
                            )}
                        </section>
                    </section>
                </section>
            )}
            { gameOver && (
                <section className="flex flex-col gap-4 items-center justify-center min-h-[300px]">
                    <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 text-center max-w-md">
                        <p className="text-red-400 text-2xl font-bold mb-2">⏱️ Время вышло!</p>
                        <p className="text-red-300 text-lg mb-4">Исправлено: {fixedBugs.length}/{codeBugs.length} ошибок</p>
                        <p className="text-red-200/70 text-sm mb-4">
                            Ответственность требует завершения задачи. Попробуй еще раз!
                        </p>
                    <button 
                            onClick={restartGame}
                            className="bg-yellow-500/20 border border-yellow-500 text-yellow-300 py-2 px-6 rounded-lg hover:bg-yellow-500/30 transition-all duration-200 font-semibold"
                        >
                            Попробовать снова
                    </button>
                    </div>
                </section>
            )}
            { showSuccessMessage && (
                <section className="flex flex-col gap-4 items-center justify-center min-h-[300px]">
                    <div className="bg-green-500/20 border border-green-500 rounded-xl p-6 text-center">
                        <p className="text-green-400 text-2xl font-bold mb-2">✓ Миссия выполнена!</p>
                        <p className="text-green-300 text-lg">Все ошибки исправлены!</p>
                        <p className="text-green-200/70 text-sm mt-2">
                            Ты продемонстрировал ответственность за результат, взяв на себя исправление проблем проекта
                        </p>
                        <p className="text-yellow-400 text-sm mt-3">Награда: +30 DNA</p>
                    </div>
                </section>
            )}
       </section>
    )
}
