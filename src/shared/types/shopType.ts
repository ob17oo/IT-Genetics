export interface ShopType{
    id: number,
    title: string,
    description: string,
    category: string,
    type: string,
    price: number,
    currency: string,
    icon: string
    effect: EffectType,
    rarity: string,
    maxPurchases?: number
    requiredLevel?: number,
}

export interface EffectType {
    type: string,
    value: number,
    skillName?: string,
    category?: string
}