export interface PlayerType {
    name: string,
    surName: string,
    dna: number,
    level: string,
    expirience: number,
    avatar: string,
    dreamLevel: string,
    dream: string,
    xp: number,
    maxXp: number,
    specialization: string,
    skills: SkillType[]
}

export interface SkillType {
    type: string,
    name: string,
    level: number
}