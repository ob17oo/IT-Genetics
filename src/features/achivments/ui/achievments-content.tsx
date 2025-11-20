"use client";

import { useAchivmentsStore } from "@/widgets/store/achievments-mission";
import { useState } from "react";

export default function AchievmentsContent() {
  const { getAllAchievments } = useAchivmentsStore();
  const achievments = getAllAchievments();
  const [filter, setFilter] = useState(false);

  const filtered = filter
    ? achievments.filter((item) => item.unlocked)
    : achievments;

  return (
    <section className="flex flex-col gap-6 scroll-smooth">
      <h2 className="text-2xl text-yellow-200">Миссии</h2>
      <section className="flex gap-3">
        <button
          onClick={() => setFilter(false)}
          className={`text-[14px] text-yellow-200 py-3 px-4 rounded-3xl transition-all duraiton-300 ease-in-out border ${
            filter
              ? "border border-yellow-500/30"
              : "border-transparent bg-yellow-500"
          }`}
        >
          Все
        </button>
        <button
        disabled={achievments.filter(item => item.unlocked).length <= 0}
          onClick={() => setFilter(true)}
          className={`text-[14px] text-yellow-200 py-3 px-4 rounded-3xl transition-all duraiton-300 ease-in-out border ${
            filter
              ? "border-transparent bg-yellow-500"
              : "border border-yellow-500/30" 
          }`}
        >
          Полученные
        </button>
      </section>
      <section className="grid grid-cols-3 gap-6">
        {filtered.map((achievment) => (
          <section
            className={`border border-yellow-500/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 ease-in-out hover:scale-105 ${
              achievment.unlocked ? "opacity-100" : "opacity-50"
            }`}
            key={achievment.id}
          >
            <section className="relative flex justify-center items-center w-[50px] h-[50px] rounded-full bg-yellow-200">
              <p className="text-2xl">{achievment.icon}</p>
            </section>
            <section>
              <h2 className="text-yellow-500 text-lg">{achievment.title}</h2>
            </section>
            <section className="flex gap-3">
              <span
                className={`px-3 py-2 rounded-full border border-yellow-200 text-lg text-white `}
              >
                {achievment.category}
              </span>
              <span
                className={`px-3 py-2 rounded-full text-lg text-white ${
                  achievment.rarity === "Обычно"
                    ? "bg-gray-400"
                    : achievment.rarity === "Необычное"
                    ? "bg-green-400"
                    : achievment.rarity === "Редкое"
                    ? "bg-blue-400"
                    : achievment.rarity === "Эпическое"
                    ? "bg-purple-400"
                    : "bg-orange-400"
                }`}
              >
                {achievment.rarity}
              </span>
            </section>
            <section>
              <p className="text-yellow-200 text-[14px] text-center">
                {achievment.description}
              </p>
            </section>
            <section className="flex gap-2 items-center">
              <span className="text-[14px] text-yellow-500/70">Награда:</span>
              <p className="text-yellow-200 text-lg">{achievment.reward} DNA</p>
            </section>
          </section>
        ))}
      </section>
    </section>
  );
}
