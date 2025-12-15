import { useMissionStore } from "@/widgets/store/mission-store"
import { useAuthStore } from "@/widgets/store/auth-store"
import { useState, useEffect, useCallback, useMemo } from "react"

interface ThirdMissionProps {
    missionId: number,
    onClose: () => void
}

interface DataItem {
    id: number
    type: 'critical' | 'important' | 'normal'
    label: string
    icon: string
    points: number
    position: { x: number, y: number }
    spawnTime: number
}

export default function ThirdMission({missionId, onClose}: ThirdMissionProps){
    const [play, setPlay] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [timeLeft, setTimeLeft] = useState(20)
    const [score, setScore] = useState(0)
    const [dataItems, setDataItems] = useState<DataItem[]>([])
    const [collectedItems, setCollectedItems] = useState<number[]>([])
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [nextItemId, setNextItemId] = useState(1)
    const [isCompleted, setIsCompleted] = useState(false)
    const completeMissionWithRewards = useMissionStore((state) => state.completeMissionWithRewards)
    const updateMissionProgress = useMissionStore((state) => state.updateMissionProgress)
    const updateDNA = useAuthStore((state) => state.updateDNA)

    const targetScore = 30 // Нужно набрать минимум 30 очков за 20 секунд
    const spawnInterval = 800 // Новый объект каждые 0.8 секунды

    const dataTypes = useMemo(() => [
        { type: 'critical' as const, label: 'Критические данные', icon: '🔥', points: 10 },
        { type: 'important' as const, label: 'Важные данные', icon: '⭐', points: 5 },
        { type: 'normal' as const, label: 'Обычные данные', icon: '📄', points: 2 }
    ], [])

    const generateRandomPosition = () => {
        const padding = 20
        return {
            x: Math.random() * (100 - padding * 2) + padding,
            y: Math.random() * (100 - padding * 2) + padding
        }
    }

    const handleGameEnd = useCallback((finalScore?: number) => {
        setGameStarted(false)
        setIsCompleted(true)
        const finalScoreValue = finalScore !== undefined ? finalScore : score
        
        if (finalScoreValue >= targetScore) {
            const reward: number = completeMissionWithRewards(missionId)
            if (reward > 0) {
                updateDNA(reward)
            }
            setShowSuccessMessage(true)
            // Обновляем score для отображения в сообщении об успехе
            if (finalScoreValue !== score) {
                setScore(finalScoreValue)
            }
            setTimeout(() => {
                onClose()
            }, 3000)
        } else {
            setGameOver(true)
        }
    }, [score, targetScore, missionId, completeMissionWithRewards, updateDNA, onClose])

    const spawnDataItem = useCallback(() => {
        if (!gameStarted || timeLeft <= 0 || isCompleted) return

        const randomType = Math.random()
        let itemType: 'critical' | 'important' | 'normal'
        if (randomType < 0.2) {
            itemType = 'critical'
        } else if (randomType < 0.5) {
            itemType = 'important'
        } else {
            itemType = 'normal'
        }

        const typeData = dataTypes.find(d => d.type === itemType)!
        const newItem: DataItem = {
            id: nextItemId,
            type: itemType,
            label: typeData.label,
            icon: typeData.icon,
            points: typeData.points,
            position: generateRandomPosition(),
            spawnTime: Date.now()
        }

        setDataItems(prev => [...prev, newItem])
        setNextItemId(prev => prev + 1)

        // Удаляем объект через 3 секунды, если не собран
        setTimeout(() => {
            setDataItems(prev => prev.filter(item => item.id !== newItem.id))
        }, 3000)
    }, [gameStarted, timeLeft, isCompleted, nextItemId, dataTypes])

    useEffect(() => {
        if (gameStarted && timeLeft > 0 && !isCompleted) {
            const timer = setTimeout(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else if (timeLeft === 0 && gameStarted && !isCompleted) {
            // Используем setTimeout чтобы избежать синхронного setState в эффекте
            setTimeout(() => {
                handleGameEnd()
            }, 0)
        }
    }, [timeLeft, gameStarted, isCompleted, handleGameEnd])

    useEffect(() => {
        if (gameStarted && timeLeft > 0 && !isCompleted) {
            const spawnTimer = setInterval(() => {
                spawnDataItem()
            }, spawnInterval)
            return () => clearInterval(spawnTimer)
        }
    }, [gameStarted, timeLeft, spawnDataItem, isCompleted])

    const startGame = () => {
        setGameStarted(true)
        setTimeLeft(20)
        setScore(0)
        setDataItems([])
        setCollectedItems([])
        setNextItemId(1)
        setGameOver(false)
        setIsCompleted(false)
        // Спавним первый объект сразу
        setTimeout(() => spawnDataItem(), 500)
    }

    const handleItemClick = (itemId: number) => {
        if (collectedItems.includes(itemId) || isCompleted) return

        const item = dataItems.find(i => i.id === itemId)
        if (!item) return

        setCollectedItems(prev => [...prev, itemId])
        setDataItems(prev => prev.filter(i => i.id !== itemId))
        
        // Обновляем score без вызова updateMissionProgress здесь
        setScore(prevScore => {
            const newScore = prevScore + item.points
            
            // Проверяем, достигли ли цели
            if (newScore >= targetScore && !isCompleted) {
                setIsCompleted(true)
                // Используем setTimeout чтобы избежать синхронного setState
                setTimeout(() => {
                    updateMissionProgress(missionId, 100)
                    handleGameEnd(newScore)
                }, 0)
            }
            return newScore
        })
    }

    // Обновляем прогресс миссии в useEffect, чтобы избежать вызова во время рендера
    useEffect(() => {
        if (gameStarted && !isCompleted) {
            const progress = Math.min(Math.round((score / targetScore) * 100), 100)
            updateMissionProgress(missionId, progress)
        }
    }, [score, gameStarted, isCompleted, missionId, targetScore, updateMissionProgress])


    const restartGame = () => {
        setGameOver(false)
        setScore(0)
        setDataItems([])
        setCollectedItems([])
        setNextItemId(1)
        setTimeLeft(20)
        setIsCompleted(false)
        setGameStarted(true)
        setTimeout(() => spawnDataItem(), 500)
    }

    const getItemStyle = (item: DataItem) => {
        const baseStyle = {
            position: 'absolute' as const,
            left: `${item.position.x}%`,
            top: `${item.position.y}%`,
            transform: 'translate(-50%, -50%)'
        }

        switch(item.type) {
            case 'critical':
                return { ...baseStyle, animation: 'pulse 0.8s infinite' }
            case 'important':
                return { ...baseStyle, animation: 'bounce 1s infinite' }
            default:
                return baseStyle
        }
    }

    const getItemClassName = (item: DataItem) => {
        const base = "cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
        switch(item.type) {
            case 'critical':
                return `${base} text-red-400 bg-red-500/20 border-red-500`
            case 'important':
                return `${base} text-yellow-400 bg-yellow-500/20 border-yellow-500`
            default:
                return `${base} text-blue-400 bg-blue-500/20 border-blue-500`
        }
    }

    return ( 
       <section className="w-full h-full p-6">
            { !play && (
                <section className="flex flex-col gap-3">
                    <section className="flex flex-col gap-3">
                        <h2 className="text-yellow-500 text-lg">Скорость: Собери данные за 20 секунд</h2>
                        <p className="text-yellow-500/60 text-lg">
                            Скорость достижения результата важна не меньше, чем качество.
                        </p>
                        <p className="text-yellow-500/40 text-sm mt-2">
                            Критическая ситуация! Нужно быстро собрать важные данные для проекта. Покажи свою скорость и эффективность!
                        </p>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-2">
                            <p className="text-yellow-200 text-sm font-semibold mb-2">🎯 Цель игры:</p>
                            <ul className="text-yellow-200/70 text-xs space-y-1 list-disc list-inside">
                                <li>Собери данные на сумму <span className="font-bold text-yellow-400">{targetScore} очков</span> за 20 секунд</li>
                                <li><span className="text-red-400">🔥 Критические</span> = 10 очков</li>
                                <li><span className="text-yellow-400">⭐ Важные</span> = 5 очков</li>
                                <li><span className="text-blue-400">📄 Обычные</span> = 2 очка</li>
                                <li>Кликай на появляющиеся объекты как можно быстрее!</li>
                            </ul>
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
                        Начать сбор данных
                    </button>
                </section>
            )}
            { play && gameStarted && !showSuccessMessage && !gameOver && (
                <section className="flex flex-col gap-4">
                    <section className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-500/20 border border-red-500 rounded-xl px-4 py-2">
                                <p className="text-red-200 text-sm">Время: <span className={`font-bold text-lg ${timeLeft <= 5 ? 'animate-pulse text-red-400' : 'text-red-300'}`}>{timeLeft}с</span></p>
                            </div>
                            <div className="bg-green-500/20 border border-green-500 rounded-xl px-4 py-2">
                                <p className="text-green-200 text-sm">Очки: <span className={`font-bold text-lg ${score >= targetScore ? 'text-green-400' : 'text-green-300'}`}>{score}/{targetScore}</span></p>
                            </div>
                            <div className="bg-blue-500/20 border border-blue-500 rounded-xl px-4 py-2">
                                <p className="text-blue-200 text-sm">Собрано: <span className="font-bold text-lg text-blue-300">{collectedItems.length}</span></p>
                            </div>
                        </div>
                        <div className="w-48 bg-gray-700 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    score >= targetScore ? 'bg-green-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${Math.min((score / targetScore) * 100, 100)}%` }}
                            />
                        </div>
                    </section>

                    <section className="relative bg-[#0a0a0a] border-2 border-yellow-500/30 rounded-xl p-8 min-h-[400px] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
                        
                        {dataItems.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-yellow-500/50 text-lg">Ожидание данных...</p>
                            </div>
                        )}

                        {dataItems.map((item) => {
                            if (collectedItems.includes(item.id)) return null
                            
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item.id)}
                                    className={`
                                        ${getItemClassName(item)}
                                        border-2 rounded-full p-4 flex flex-col items-center justify-center gap-2
                                        min-w-[80px] shadow-lg
                                    `}
                                    style={getItemStyle(item)}
                                >
                                    <span className="text-3xl">{item.icon}</span>
                                    <span className="text-xs font-semibold whitespace-nowrap">{item.label}</span>
                                    <span className="text-xs opacity-70">+{item.points}</span>
                                </button>
                            )
                        })}

                        {/* Индикатор скорости */}
                        {timeLeft > 0 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                <p className="text-yellow-500/60 text-xs text-center">
                                    {timeLeft <= 5 && (
                                        <span className="text-red-400 font-bold animate-pulse">⏰ ВРЕМЯ ИСТЕКАЕТ!</span>
                                    )}
                                    {timeLeft > 5 && timeLeft <= 10 && (
                                        <span className="text-yellow-400">⏱️ Ускоряйся!</span>
                                    )}
                                </p>
                            </div>
                        )}
                    </section>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                        <p className="text-yellow-200/70 text-xs text-center">
                            💡 Совет: Приоритезируй критические данные (🔥) для быстрого набора очков!
                        </p>
                    </div>
                </section>
            )}
            { gameOver && (
                <section className="flex flex-col gap-4 items-center justify-center min-h-[300px]">
                    <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 text-center max-w-md">
                        <p className="text-red-400 text-2xl font-bold mb-2">⏱️ Время вышло!</p>
                        <p className="text-red-300 text-lg mb-2">Собрано: {score}/{targetScore} очков</p>
                        <p className="text-red-200/70 text-sm mb-4">
                            Скорость важна! Попробуй быть быстрее и эффективнее.
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
                        <p className="text-green-300 text-lg">Данные успешно собраны!</p>
                        <p className="text-green-200/70 text-sm mt-2">
                            Ты продемонстрировал скорость и эффективность работы. Скорость достижения результата важна не меньше, чем качество!
                        </p>
                        <p className="text-yellow-400 text-sm mt-3">Награда: +40 DNA</p>
                        <p className="text-green-300/50 text-xs mt-2">Собрано: {score} очков за {20 - timeLeft} секунд</p>
                    </div>
                </section>
            )}
       </section>
    )
}

