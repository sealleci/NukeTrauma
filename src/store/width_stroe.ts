import { create } from 'zustand'

interface WidthState {
    worldMapWidth: number
    worldMapHeight: number
    isSmallScreen: boolean,
    setIsSmallScreen: (newValue: boolean) => void
    setWorldMapWidth: (newValue: number) => void
    setWorldMapHeight: (newValue: number) => void
}

const useWidthStore = create<WidthState>()((set) => ({
    worldMapWidth: 1024,
    worldMapHeight: 720,
    isSmallScreen: false,
    setIsSmallScreen: (newValue) => set(() => ({
        isSmallScreen: newValue
    })),
    setWorldMapWidth: (newValue) => set(() => ({
        worldMapWidth: newValue
    })),
    setWorldMapHeight: (newValue) => set(() => ({
        worldMapHeight: newValue
    }))
}))

export default useWidthStore
