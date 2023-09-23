import { create } from 'zustand'

interface LaunchState {
    launchSignal: boolean
    cancelSignal: boolean
    relocateSignal: boolean
    setLaunchSignal: (newValue: boolean) => void
    setCancelSignal: (newValue: boolean) => void
    setRelocateSignal: (newValue: boolean) => void
}

const useLaunchStore = create<LaunchState>()((set) => ({
    launchSignal: false,
    cancelSignal: false,
    relocateSignal: false,
    setLaunchSignal: (newValue) => set(() => ({ launchSignal: newValue })),
    setCancelSignal: (newValue) => set(() => ({ cancelSignal: newValue })),
    setRelocateSignal: (newValue) => set(() => ({ relocateSignal: newValue }))
}))

export default useLaunchStore
