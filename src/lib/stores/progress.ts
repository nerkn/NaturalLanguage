import { create } from 'zustand'

interface Progress {
    modulename: string;
    identifier: string;
    id2: string;
    askme: number;
    favorites: string[];
}

interface ProgressStore {
    progress: Progress[];
    addOrUpdateProgress: (
        modulename: string,
        identifier: string,
        id2: string,
        askmeIncrement?: number,
        favoriteToAddOrRemove?: string
    ) => void;
    resetProgress: () => void;
    getProgress: (
        modulename: string,
        identifier: string,
        id2: string) => Progress[]
}

const useProgressStore = create<ProgressStore>((set, get) => ({
    progress: [],
    addOrUpdateProgress: (
        modulename: string,
        identifier: string,
        id2: string,
        askmeIncrement = 0,
        favoriteToAddOrRemove = ''
    ) => set((state) => {
        const existingProgress = state.progress.find(p => p.identifier === identifier);
        if (existingProgress) {
            const updatedFavorites = favoriteToAddOrRemove
                ? existingProgress.favorites.includes(favoriteToAddOrRemove)
                    ? existingProgress.favorites.filter(fav => fav !== favoriteToAddOrRemove)
                    : [...existingProgress.favorites, favoriteToAddOrRemove]
                : existingProgress.favorites;
            return {
                progress: state.progress.map(p =>
                    p.identifier === identifier
                        ? {
                            ...p,
                            modulename,
                            id2,
                            askme: p.askme + askmeIncrement,
                            favorites: updatedFavorites,
                        }
                        : p
                )
            };
        } else {
            return {
                progress: [
                    ...state.progress,
                    {
                        modulename,
                        identifier,
                        id2,
                        askme: askmeIncrement > 0 ? askmeIncrement : 0,
                        favorites: favoriteToAddOrRemove ? [favoriteToAddOrRemove] : [],
                    }
                ]
            };
        }
    }),
    resetProgress: () => set({ progress: [] }),
    getProgress(modulename, identifier, id2) {
        return get().progress.filter(p => (p.modulename == modulename && p.identifier == identifier && p.id2 == id2))
    },
}));

export default useProgressStore;