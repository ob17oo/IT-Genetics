'use client'
import { MOCK_MISSIONS as missionData } from "@/shared/constants"
export default function MissionsContent(){
    return (
        <section className="flex flex-col gap-6 overflow-hidden scroll-smooth">
            <section className="flex flex-col gap-3">
                { missionData.map((mission) => (
                    <section className="p-6 border border-yellow-500/30 rounded-3xl flex flex-col gap-6" key={mission.title}>
                        <section className="flex justify-between items-center">
                          <section className="flex flex-col">
                            <h2 className="text-yellow-200 text-lg">{mission.title}</h2>
                            <p className="text-yellow-500">{mission.description}</p>
                          </section>
                          <section>
                              <p className="text-lg text-yellow-500"> {mission.completed ? 'Выполнен' : 'В процессе'}    </p>
                          </section>      
                        </section>
                        <section className="flex items-center gap-3">
                          <span className={`text-[14px] px-4 py-3 rounded-full ${mission.difficulty === 'Легкая' ? 'bg-green-500'  : mission.difficulty === 'Средняя' ? 'bg-orange-500' : mission.difficulty === 'Сложная' ? 'bg-red-500' : 'bg-gray-500'}`}>{mission.difficulty}</span>  
                          <span className={`text-[14px] px-4 py-3 rounded-full border border-yellow-500/30 text-yellow-200`}>{mission.type}</span>
                        </section>
                        <section>
                          {/*
                            Сделать ебаный прогресс бар
                          */}
                        </section>
                    </section>
                ))}
            </section>
        </section>
    )
}