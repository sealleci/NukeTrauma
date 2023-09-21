import { create } from 'zustand'

interface WidthState {
    isSmallScreen: boolean,
    setIsSmallScreen: (newValue: boolean) => void
}

const useWidthStore = create<WidthState>()((set) => ({
    isSmallScreen: false,
    setIsSmallScreen: (newValue) => set(() => ({
        isSmallScreen: newValue
    }))
}))

export default useWidthStore
