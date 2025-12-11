"use client";

import { useMissionStore } from "@/widgets/store/mission-store";
import { useMemo, useState } from "react";

export default function MissionsContent() {
  const missions = useMissionStore((state) => state.missions);
  const availableMission = useMissionStore((state) => state.availableMission);
  const updateMissionProgress = useMissionStore((state) => state.updateMissionProgress);
  const [filter, setFilter] = useState('All');

  const allMissions = useMemo(() => {
    return [...missions, ...availableMission];
  }, [missions,availableMission])

  const filteredMassive = useMemo(() => {
    switch(filter){
      case 'All':
        return allMissions
      case 'Completed':
        return allMissions.filter((elem) => elem.completed)
      case 'Main':
        return allMissions.filter((elem) => elem.type === 'main')
      case 'Side':
        return allMissions.filter((elem) => elem.type === 'side')
      default:
        return allMissions
    }
  }, [filter, allMissions])


  return (
    <section className="flex flex-col gap-6 scroll-smooth">
      <h2 className="text-2xl text-yellow-200">Миссии</h2>
      <section className="flex gap-3">
        <button
          onClick={() => setFilter("All")}
          className={`text-[14px] text-yellow-200 py-3 px-4 rounded-3xl transition-all duration-300 ease-in-out border ${
            filter === "All"
              ? "border-transparent bg-yellow-500"
              : "border border-yellow-500/30"
          }`}
        >
          Все
        </button>
        <button
          disabled={allMissions.filter((item) => item.completed).length <= 0}
          onClick={() => setFilter("Completed")}
          className={`text-[14px] text-yellow-200 py-3 px-4 rounded-3xl transition-all duration-300 ease-in-out border ${
            filter === "Completed"
              ? "border-transparent bg-yellow-500"
              : "border border-yellow-500/30"
          }`}
        >
          Полученные
        </button>
        <button
          disabled={allMissions.filter((item) => item.type === "main").length <= 0}
          onClick={() => setFilter("Main")}
          className={`text-[14px] text-yellow-200 py-3 px-4 rounded-3xl transition-all duration-300 ease-in-out border ${
            filter === "Main"
              ? "border-transparent bg-yellow-500"
              : "border border-yellow-500/30"
          }`}
        >
          Основные
        </button>
        <button
          disabled={allMissions.filter((item) => item.type === "side").length <= 0}
          onClick={() => setFilter("Side")}
          className={`text-[14px] text-yellow-200 py-3 px-4 rounded-3xl transition-all duration-300 ease-in-out border ${
            filter === "Side"
              ? "border-transparent bg-yellow-500"
              : "border border-yellow-500/30"
          }`}
        >
          Побочные
        </button>
      </section> 
      <section className="flex flex-col gap-3">
        {filteredMassive.map((mission) => (
          <section
            className={`p-6 border border-yellow-500/30 rounded-3xl flex flex-col gap-6 ${
              mission.completed ? "opacity-100" : "opacity-50"
            }`}
            key={mission.id}
          >
            <section className="flex justify-between items-center">
              <section className="flex flex-col">
                <h2 className="text-yellow-200 text-lg">{mission.title}</h2>
                <p className="text-yellow-500">{mission.description}</p>
              </section>
              <section>
                <p className="text-lg text-yellow-500">
                  {" "}
                  {mission.completed ? "Выполнен" : "В процессе"}{" "}
                </p>
              </section>
            </section>
            <section className="flex items-center gap-3">
              <span
                className={`text-[14px] px-4 py-3 rounded-full ${
                  mission.difficulty === "easy"
                    ? "bg-green-500"
                    : mission.difficulty === "medium"
                    ? "bg-orange-500"
                    : mission.difficulty === "hard"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              >
                {mission.difficulty === "easy"
                  ? "Легкое"
                  : mission.difficulty === "medium"
                  ? "Среднее"
                  : mission.difficulty === "hard"
                  ? "Сложное"
                  : "Эксперт"}
              </span>
              <span
                className={`text-[14px] px-4 py-3 rounded-full border border-yellow-500/30 text-yellow-200`}
              >
                {mission.type === "main" ? "Основной" : "Побочный"}
              </span>
            </section>
            <section className="flex items-center gap-3">
              <section className="w-full bg-gray-700 rounded-full h-2">
                <section
                  className={`h-2 rounded-full transition-all ${
                    mission.completed ? "bg-green-400" : "bg-yellow-400"
                  }`}
                  style={{ width: `${mission.progress}%` }}
                ></section>
              </section>
              <span className="text-yellow-200 text-lg">
                {mission.progress}%
              </span>
            </section>
            <section className="flex gap-3">
              <button
                onClick={() =>{
                  const newProgress = Math.min(mission.progress + 10, 100);
                  updateMissionProgress(mission.id, newProgress)
                }
                }
                className="text-yellow-200 text-lg opacity-70 transition-all duration-300 ease-in-out hover:opacity-100"
              >
                Улучшить
              </button>
              <button
                onClick={() =>{
                  updateMissionProgress(mission.id, 0)
                }}
                className="text-yellow-200 text-lg opacity-70 transition-all duration-300 ease-in-out hover:opacity-100"
              >
                Сбросить
              </button>
            </section>
          </section>
        ))}
      </section>
    </section>
  );
}
