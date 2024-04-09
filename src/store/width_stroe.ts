import { create } from 'zustand'

interface WidthState {
    worldMapWidth: number
    isSmallScreen: boolean,
    setIsSmallScreen: (newValue: boolean) => void
    setWorldMapWidth: (newValue: number) => void
}

const useWidthStore = create<WidthState>()((set) => ({
    worldMapWidth: 320,
    isSmallScreen: false,
    setIsSmallScreen: (newValue) => set(() => ({
        isSmallScreen: newValue
    })),
    setWorldMapWidth: (newValue) => set(() => ({
        worldMapWidth: newValue
    }))
}))

export default useWidthStore
