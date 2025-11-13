export interface UserType {
    id: string,
    name: string,
    surName: string,
    level: string,
    dreamLevel: string,
    dream: string,
    dna: number,
    experience: number,
    specialization: string,
    skills: SkillsType[]
}

export interface SkillsType {
    type: 'Hard' | 'Soft',
    name: string,
    level: number
}