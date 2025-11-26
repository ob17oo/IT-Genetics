import MissionsContent from "@/features/missions/ui/missions-content"
import ProfileContent from "@/features/profile/ui/profile-content"
import AchievmentsContent from "@/features/achivments/ui/achievments-content"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ShopContent from "@/features/shop/ui/shop-content"

interface GameDialogProps{
    isOpen: boolean,
    onClose: ()=> void
}

export default function GameDialog( {isOpen, onClose}: GameDialogProps){
    const [window, setWindow] = useState('Профиль')
    const router = useRouter()
    useEffect(() => {
        if(isOpen){
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])
    if(!isOpen) return null

    const WindowRender = () => {
        switch(window){
            case 'Профиль':
                return <ProfileContent />
            case 'Миссии':
                return <MissionsContent />
            case 'Достижения':
                return <AchievmentsContent />
            case 'Магазин':
                return <ShopContent />
            default:
                return <h2 className="text-yellow-500 text-lg text-center">Окно не найдено</h2>
        }
    }

    return (
        <section className="fixed inset-0 z-50">
            <section className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}>
                <section className="flex justify-between w-full h-full p-6">
                    {/* Левый блок с фиксированной высотой и скроллом */}
                    <section className="bg-[#121212] rounded-3xl w-[83%] h-[95vh] border border-yellow-500/30 flex flex-col">
                        {/* Заголовок окна */}
                        <div className="p-6 border-b border-yellow-500/30 shrink-0">
                            <h2 className="text-2xl font-bold text-yellow-500">{window}</h2>
                        </div>
                        {/* Контент со скроллом */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {WindowRender()}
                        </div>
                    </section>
                    
                    {/* Правый блок навигации */}
                    <section className="w-[15%] bg-[#121212] rounded-3xl border border-yellow-500/30 p-6 flex flex-col gap-8 h-fit">
                        <section className="w-full flex justify-end">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="opacity-30 transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-100"
                            >
                                <Image src="/static/Close.svg" alt="Close" width={24} height={24} />
                            </button>
                        </section>
                        
                        <section className="flex flex-col gap-4">
                            <button 
                                type="button" 
                                onClick={() => setWindow('Профиль')}
                                className={`text-yellow-500 text-[16px] transition-all duration-300 ease-in-out hover:scale-105 text-left ${
                                    window === 'Профиль' ? 'opacity-100 font-bold' : 'opacity-50'
                                }`}
                            >
                                Профиль
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setWindow('Миссии')}
                                className={`text-yellow-500 text-[16px] transition-all duration-300 ease-in-out hover:scale-105 text-left ${
                                    window === 'Миссии' ? 'opacity-100 font-bold' : 'opacity-50'
                                }`}
                            >
                                Миссии
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setWindow('Достижения')}
                                className={`text-yellow-500 text-[16px] transition-all duration-300 ease-in-out hover:scale-105 text-left ${
                                    window === 'Достижения' ? 'opacity-100 font-bold' : 'opacity-50'
                                }`}
                            >
                                Достижения
                            </button>
                            <button
                            type="button"
                            onClick={() => setWindow('Магазин')}
                              className={`text-yellow-500 text-[16px] transition-all duration-300 ease-in-out hover:scale-105 text-left ${
                                    window === 'Магазин' ? 'opacity-100 font-bold' : 'opacity-50'
                                }`}>
                                Магазин
                            </button>
                        </section>
                        
                        <section className="pt-4 border-t border-yellow-500/30">
                            <button 
                                type="button" 
                                onClick={() => router.push('/')}
                                className="text-yellow-500/50 text-[16px] transition-all duration-300 ease-in-out hover:text-yellow-500 w-full text-left"
                            >
                                Выйти из игры
                            </button>
                        </section>
                    </section>
                </section>
            </section>
        </section>
    )
}