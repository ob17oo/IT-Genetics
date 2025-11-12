"use client";

import { MOCK_ACHIEVMENTS as achievmentsData } from "@/shared/constants";

export default function AchievmentsContent() {
  return (
    <section className="grid grid-cols-3 gap-6">
        {achievmentsData.map((achievment) => (
            <section className={`border border-yellow-500/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 ease-in-out hover:scale-105 ${achievment.unlocked ? 'opacity-100' : 'opacity-50'}`} key={achievment.id}>
                <section className="relative flex justify-center items-center w-[50px] h-[50px] rounded-full bg-yellow-200">
                    <p className="text-2xl">{achievment.icon}</p>
                </section>
                <section>
                    <h2 className="text-yellow-500 text-lg">{achievment.title}</h2>
                </section>
                <section className="flex gap-3">
                    <span className={`px-3 py-2 rounded-full border border-yellow-200 text-lg text-white `}>{achievment.category}</span>
                    <span className={`px-3 py-2 rounded-full text-lg text-white ${
                        achievment.rarity === 'Обычно' 
                        ? 'bg-gray-400' : achievment.rarity === 'Необычное' 
                        ? 'bg-green-400' : achievment.rarity === 'Редкое' 
                        ?  'bg-blue-400' : achievment.rarity === 'Эпическое' 
                        ? 'bg-purple-400' : 'bg-orange-400' }`}>{achievment.rarity}
                    </span>
                </section>
                <section>
                    <p className="text-yellow-200 text-[14px] text-center">{achievment.description}</p>
                </section>
                <section className="flex gap-2 items-center">
                    <span className="text-[14px] text-yellow-500/70">Награда:</span>
                    <p className="text-yellow-200 text-lg">{achievment.reward} DNA</p>
                </section>
            </section>
        ))}
    </section>
  )
}
