import { MOCK_SHOP as shopData } from "@/shared/constants"

export default function ShopContent(){
    return (
        <section>
            <section className="grid grid-cols-3 gap-6">
                {shopData.map((item) => (
                    <section className={`border border-yellow-500/30 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 ease-in-out hover:scale-105`} key={item.id}>
                        <section className="relative flex justify-center items-center w-[50px] h-[50px] rounded-full bg-yellow-200">
                            <p className="text-2xl">{item.icon}</p>
                        </section>
                        <section>
                            <h2 className="text-yellow-500 text-lg text-center">{item.title}</h2>
                            <p className="text-yellow-200 text-[14px] text-center">{item.description}</p>
                        </section>
                        <section>
                            <span className="text-yellow-200 text-lg">{item.price} DNA</span>
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
                        <section>
                            <button className="text-yellow-200 px-4 py-3 rounded-3xl border border-yellow-500/30 transition-all duration-300 ease-in-out hover:bg-yellow-500 hover:animate-pulse">Купить</button>
                        </section>
                    </section>
                ))}
            </section>
        </section>
    )
}