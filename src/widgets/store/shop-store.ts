import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ShopStore {
    purchasedItems: number[]; // Массив ID купленных предметов
    purchaseCounts: Record<number, number>; // Количество покупок каждого предмета
    purchaseItem: (itemId: number) => void;
    canPurchase: (itemId: number, maxPurchases?: number) => boolean;
    getPurchaseCount: (itemId: number) => number;
}

export const useShopStore = create<ShopStore>()(
    persist(
        (set, get) => ({
            purchasedItems: [],
            purchaseCounts: {},

            purchaseItem: (itemId) => {
                set((state) => {
                    const currentCount = state.purchaseCounts[itemId] || 0;
                    return {
                        purchasedItems: state.purchasedItems.includes(itemId)
                            ? state.purchasedItems
                            : [...state.purchasedItems, itemId],
                        purchaseCounts: {
                            ...state.purchaseCounts,
                            [itemId]: currentCount + 1,
                        },
                    };
                });
            },

            canPurchase: (itemId, maxPurchases) => {
                const state = get();
                const currentCount = state.purchaseCounts[itemId] || 0;
                if (maxPurchases === undefined) return true;
                return currentCount < maxPurchases;
            },

            getPurchaseCount: (itemId) => {
                return get().purchaseCounts[itemId] || 0;
            },
        }),
        {
            name: 'shop-storage'
        }
    )
);

