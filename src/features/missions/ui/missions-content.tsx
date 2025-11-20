"use client";
import { useMissionStore } from "@/widgets/store/mission-store";
import { useState } from "react";
export default function MissionsContent() {
  const { getAllMissions,updateMissionProgress } = useMissionStore();
  const mission = getAllMissions();
  const [filter, setFilter] = useState(false);

  const filtered = filter ? mission.filter((item) => item.completed) : mission;
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
          disabled={mission.filter((item) => item.completed).length <= 0}
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
      <section className="flex flex-col gap-3">
        {filtered.map((mission) => (
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
                  mission.difficulty === "Легкая"
                    ? "bg-green-500"
                    : mission.difficulty === "Средняя"
                    ? "bg-orange-500"
                    : mission.difficulty === "Сложная"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              >
                {mission.difficulty}
              </span>
              <span
                className={`text-[14px] px-4 py-3 rounded-full border border-yellow-500/30 text-yellow-200`}
              >
                {mission.type}
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
                <button onClick={() => updateMissionProgress(mission.id , mission.progress += 10)} className="text-yellow-200 text-lg">Улучшить</button>
                <button onClick={() => updateMissionProgress(mission.id , 0)} className="text-yellow-200 text-lg">Сбросить</button>
            </section>
          </section>
        ))}
      </section>
    </section>
  );
}
