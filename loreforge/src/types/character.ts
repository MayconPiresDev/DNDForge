export type DndCharacter = {
    id?: string;
    userId: string;
    name: string;
    race: string;
    class: string;
    level: number;
    abilities: {
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
    };
    createdAt: Date;
};