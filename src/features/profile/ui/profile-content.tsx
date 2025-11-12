import Image from "next/image"

import { MOCK_PLAYER as playerData } from "@/shared/constants"

export default function ProfileContent(){
    const softSkills = playerData.skills.filter((skill) => skill.type === 'Soft')
    const hardSkills = playerData.skills.filter((skill) => skill.type === 'Hard')
    return (
        <section className="flex flex-col gap-6">
            <section className="border border-yellow-500/30 rounded-3xl p-6 flex items-center gap-6">
                <section className="relative w-[100px] h-[100px] rounded-full overflow-hidden">
                    <Image src={playerData.avatar} alt={playerData.name} fill />
                </section>
                <section>
                    <span className="text-white/50 text-[14px]">Имя разработчика:</span>
                    <p className="text-lg text-yellow-500">{playerData.name}</p>
                </section>
                <section>
                    <span className="text-white/50 text-[14px]">Фамилия разработчика:</span>
                    <p className="text-lg text-yellow-500">{playerData.surName}</p>
                </section>
                <section>
                    <span className="text-white/50 text-[14px]">Опыт работы:</span>
                    <p className="text-lg text-yellow-500">{playerData.expirience} месяца</p>
                </section>
            </section>

            <section className="border border-yellow-500/30 rounded-3xl p-6 flex justify-between ">
                <section>
                    <span className="text-white/50 text-[14px]">О чем мечтает:</span>
                    <p className="text-yellow-500 text-lg">{playerData.dream}</p>
                </section>
                <section className="flex flex-col gap-3">
                    <section>
                        <span className="text-white/50 text-[14px]">Актуальный грейд:</span>
                        <p className="text-yellow-500 text-lg">{playerData.level}</p>
                    </section>
                    <section>
                        <span className="text-white/50 text-[14px]">Желаемый грейд:</span>
                        <p className="text-yellow-500 text-lg">{playerData.dreamLevel}</p>
                    </section>
                </section>
            </section>

            
            
            <section className="border border-yellow-500/30  rounded-3xl p-6 flex justify-between">
                <section className="w-[48%] flex flex-col gap-6">
                    <h2 className="text-yellow-500 text-lg ">Hard Skill – это технические инструменты и технологии, которые можно измерить и проверить. </h2>
                    <section className="border border-yellow-500/30 rounded-3xl p-6">
                        <p className="text-yellow-200 text-[14px]">Hard Skill, которые имеет твой разработчик:</p>
                        { hardSkills.map((skill) => (
                            <section key={skill.name}>
                                <h2 className="text-yellow-500 text-lg">
                                    {skill.name}
                                    <section className="flex items-center gap-2 p-2">
                                        <section className="w-full bg-gray-700 rounded-full h-2">
                                            <section className={`bg-yellow-500 h-2 rounded-full`} style={{ width: `${(skill.level! / 10) * 100 }%` }}></section>
                                        </section>
                                        <section className="flex items-center gap-1">
                                            <span>Уровень</span>
                                            <p>{skill.level}</p>
                                        </section>
                                    </section>
                                </h2>
                            </section>
                        ))}
                    </section>
                </section>

                <section className="w-[48%] flex flex-col gap-6">
                    <h2 className="text-yellow-500 text-lg ">Soft Skill — личные качества и компетенции, которые определяют эффективность работы в команде</h2>
                    <section className="border border-yellow-500/30 rounded-3xl p-6">
                        <p className="text-yellow-200 text-[14px]">Soft Skill, которые имеет твой разработчик:</p>
                        { softSkills.map((skill) => (
                            <section key={skill.name}>
                                <h2 className="text-yellow-500 text-lg">
                                    {skill.name}
                                    <section className="flex items-center gap-2 p-2">
                                        <section className="w-full bg-gray-700 rounded-full h-2">
                                            <section className={`bg-yellow-500 h-2 rounded-full`} style={{ width: `${(skill.level! / 10) * 100 }%` }}></section>
                                        </section>
                                        <section className="flex items-center gap-1">
                                            <span>Уровень</span>
                                            <p>{skill.level}</p>
                                        </section>
                                    </section>
                                </h2>
                            </section>
                        ))}
                    </section>
                </section>
            </section>
        </section>
    )
}