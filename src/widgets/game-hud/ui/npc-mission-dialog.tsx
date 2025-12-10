import { useMissionStore } from "@/widgets/store/mission-store";
import { useMemo } from "react";

interface NPCDialogProps {
  npcId: number;
  npcName: string;
  onClose: () => void;
}
export function NPCMissionDialog({ npcId, npcName, onClose }: NPCDialogProps) {
  const missions = useMissionStore((state) => state.missions)
  const assignMission = useMissionStore((state) => state.assignMission)
  const completeMission = useMissionStore((state) => state.completeMission)
  const availableMission = useMissionStore((state) => state.availableMission)
  const npcMission = availableMission.filter(
    (elem) => elem.relatedNPC === npcId
  );

  const incomplited = useMemo(() => {
    missions.filter((elem) => !elem.completed);
  },[])

  const handleAcceptMission = (missionId: number) => {
    assignMission(missionId);
    console.log(`Миссия принята ${missionId}`);
  };

  const handleCompleteMission = (missionId: number) => {
    completeMission(missionId);
    console.log(`Миссия завершена ${missionId}`);
  };

  return (
    <section className="fixed inset-0 z-50">
      <section
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <section
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center w-full h-full p-6"
        >
          <section className="bg-[#121212] rounded-3xl border border-yellow-500/30 p-8 w-full max-w-4xl h-fit space-y-6">
            <section className="flex items-start justify-between gap-4 border-b border-yellow-500/30 pb-4">
              <div>
                <p className="text-sm text-yellow-500/60 uppercase tracking-[0.2em]">
                  NPC
                </p>
                <h2 className="text-3xl font-bold text-yellow-500">
                  {npcName}
                </h2>
                <p className="text-sm text-yellow-100/60">Доступные задания</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="opacity-40 transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-100 text-yellow-200"
              >
                ✕
              </button>
            </section>

            <section className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {npcMission.length === 0 && (
                <p className="text-yellow-100/70">
                  Для этого персонажа нет активных заданий.
                </p>
              )}

              {npcMission.map((mission) => {
                const isActive = missions.some((elem) => elem.id === mission.id)
                return (
                  <article
                    key={mission.id}
                    className="p-4 border border-yellow-500/20 rounded-2xl bg-[#1a1a1a] flex flex-col gap-3"
                  >
                    <header className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-yellow-500/70">
                          {mission.type}
                        </p>
                        <h3 className="text-xl text-yellow-100 font-semibold">
                          {mission.title}
                        </h3>
                      </div>
                      <p className="text-yellow-500 font-semibold">
                        +{mission.reward} XP
                      </p>
                    </header>
                    <p className="text-yellow-100/70 text-sm leading-relaxed">
                      {mission.description}
                    </p>

                    <footer className="flex items-center justify-end gap-3">
                      {isActive ? (
                        <button
                          type="button"
                          onClick={() => handleCompleteMission(mission.id)}
                          className="px-4 py-2 rounded-full border border-green-400/40 text-green-300 text-sm hover:bg-green-400/10 transition-all"
                        >
                          Завершить миссию
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAcceptMission(mission.id)}
                          className="px-4 py-2 rounded-full border border-yellow-500 text-yellow-500 text-sm hover:bg-yellow-500/10 transition-all"
                        >
                          Принять миссию
                        </button>
                      )}
                    </footer>
                  </article>
                );
              })}
            </section>
          </section>
        </section>
      </section>
    </section>
  );
}
