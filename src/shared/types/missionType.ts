export interface Mission{
    id: number,
    title: string,
    description: string,
    reward: number,
    progress: number,
    completed: boolean,
    type: string,
    difficulty: string,
    requires: number | null,
    relatedNPC?: number
}