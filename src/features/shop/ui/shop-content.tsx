import { MOCK_SHOP as shopData } from "@/shared/constants"
import { useAuthStore } from "@/widgets/store/auth-store"
import { useShopStore } from "@/widgets/store/shop-store"
import { useState } from "react"

export default function ShopContent(){
    const user = useAuthStore((state) => state.user)
    const purchaseItem = useAuthStore((state) => state.purchaseItem)
    const { purchaseItem: recordPurchase, canPurchase, getPurchaseCount } = useShopStore()
    const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null)

    const handlePurchase = (item: typeof shopData[0]) => {
        if (!user) {
            setMessage({ text: 'Вы не авторизованы', type: 'error' })
            setTimeout(() => setMessage(null), 3000)
            return
        }

        // Проверка на максимальное количество покупок
        if (!canPurchase(item.id, item.maxPurchases)) {
            setMessage({ text: 'Достигнут лимит покупок для этого предмета', type: 'error' })
            setTimeout(() => setMessage(null), 3000)
            return
        }

        // Проверка на уровень (если требуется)
        if (item.requiredLevel && parseInt(user.level) < item.requiredLevel) {
            setMessage({ text: `Требуется уровень ${item.requiredLevel}`, type: 'error' })
            setTimeout(() => setMessage(null), 3000)
            return
        }

        // Проверка на достаточное количество DNA
        if (user.dna < item.price) {
            setMessage({ text: 'Недостаточно DNA для покупки', type: 'error' })
            setTimeout(() => setMessage(null), 3000)
            return
        }

        // Совершаем покупку - передаем category из товара
        const success = purchaseItem(item.price, item.effect, item.category)
        
        if (success) {
            recordPurchase(item.id)
            setMessage({ text: `${item.title} успешно куплен!`, type: 'success' })
            setTimeout(() => setMessage(null), 3000)
        } else {
            setMessage({ text: 'Ошибка при покупке', type: 'error' })
            setTimeout(() => setMessage(null), 3000)
        }
    }

    return (
        <section className="flex flex-col gap-4">
            {message && (
                <div className={`p-4 rounded-xl border ${
                    message.type === 'success' 
                        ? 'bg-green-500/20 border-green-500 text-green-400' 
                        : 'bg-red-500/20 border-red-500 text-red-400'
                }`}>
                    {message.text}
                </div>
            )}
            <section className="mb-4">
                <p className="text-yellow-500 text-xl">
                    Ваш баланс: <span className="font-bold">{user?.dna || 0} DNA</span>
                </p>
            </section>
            <section className="grid grid-cols-3 gap-6">
                {shopData.map((item) => {
                    const purchaseCount = getPurchaseCount(item.id)
                    const canBuy = canPurchase(item.id, item.maxPurchases)
                    const hasEnoughDNA = (user?.dna || 0) >= item.price
                    const meetsLevelRequirement = !item.requiredLevel || (user && parseInt(user.level) >= item.requiredLevel)
                    const isDisabled = !canBuy || !hasEnoughDNA || !meetsLevelRequirement

                    return (
                        <section 
                            className={`border rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 ease-in-out ${
                                isDisabled 
                                    ? 'border-gray-500/30 opacity-60' 
                                    : 'border-yellow-500/30 hover:scale-105'
                            }`} 
                            key={item.id}
                        >
                            <section className="relative flex justify-center items-center w-[50px] h-[50px] rounded-full bg-yellow-200">
                                <p className="text-2xl">{item.icon}</p>
                            </section>
                            <section>
                                <h2 className="text-yellow-500 text-lg text-center">{item.title}</h2>
                                <p className="text-yellow-200 text-[14px] text-center">{item.description}</p>
                            </section>
                            <section>
                                <span className={`text-lg ${
                                    hasEnoughDNA ? 'text-yellow-200' : 'text-red-400'
                                }`}>
                                    {item.price} DNA
                                </span>
                                {item.maxPurchases && (
                                    <p className="text-xs text-yellow-500/60 mt-1">
                                        Куплено: {purchaseCount}/{item.maxPurchases}
                                    </p>
                                )}
                            </section>
                            <section className="flex items-center gap-3">
                                <span className={`px-3 py-2 rounded-full border text-lg text-white ${
                                    item.type === 'Скилл' 
                                    ? 'border-orange-400' : item.type === 'Буст' 
                                    ? 'border-green-400' : item.type === 'Особенный' 
                                    ? 'border-yellow-400' : 'border-gray-400' }`}
                                    >{item.type}</span>
                                <span className={`px-3 py-2 rounded-full text-lg text-white ${
                                    item.rarity === 'Обычно' 
                                    ? 'bg-gray-400' : item.rarity === 'Необычное' 
                                    ? 'bg-green-400' : item.rarity === 'Редкое' 
                                    ?  'bg-blue-400' : item.rarity === 'Эпическое' 
                                    ? 'bg-purple-400' : 'bg-orange-400' }`
                                    }>{item.rarity}
                                </span>
                            </section>
                            {item.requiredLevel && (
                                <p className="text-xs text-yellow-500/60">
                                    Требуется уровень: {item.requiredLevel}
                                </p>
                            )}
                            <section>
                                <button 
                                    disabled={isDisabled}
                                    onClick={() => handlePurchase(item)}
                                    className={`px-4 py-3 rounded-3xl border transition-all duration-300 ease-in-out ${
                                        isDisabled
                                            ? 'text-gray-500 border-gray-500/30 cursor-not-allowed'
                                            : 'text-yellow-200 border-yellow-500/30 hover:bg-yellow-500 hover:animate-pulse'
                                    }`}
                                >
                                    {!canBuy ? 'Лимит исчерпан' : !hasEnoughDNA ? 'Недостаточно DNA' : 'Купить'}
                                </button>
                            </section>
                        </section>
                    )
                })}
            </section>
        </section>
    )
}