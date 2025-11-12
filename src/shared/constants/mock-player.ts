import { PlayerType } from "../types/playerType";

export const MOCK_PLAYER: PlayerType = {
    avatar: '/static/playerAvatar.png',
    expirience: 3,
    name: 'Эмиль',
    surName: 'Ли',
    dna: 150,
    level: 'Стажер',
    dreamLevel: 'Тим лид',
    dream: 'Стать квалифицированным разработчиком в компании и создавать масштабируемые приложения',
    xp: 200,
    maxXp: 700,
    specialization: 'FrontEnd',
    skills: [
        {
            type: 'Hard',
            name: 'JavaScript',
            level: 1
        } , 
        {
            type: 'Hard',
            name: 'TypeScript',
            level: 2
        } ,
        {
            type: 'Hard',
            name: 'React',
            level: 4
        } ,
        {
            type: 'Soft',
            name: 'Общительность',
            level: 7
        } ,
        {
            type: 'Soft',
            name: 'Отвественность',
            level: 1
        } , 
        {
            type: 'Soft',
            name: 'Креативность',
            level: 1
        }
    ]
}