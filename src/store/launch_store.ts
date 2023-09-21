import { create } from 'zustand'

interface LaunchState {
    launchSignal: boolean,
    cancelSignal: boolean,
    setLaunchSignal: (newValue: boolean) => void,
    setCancelSignal: (newValue: boolean) => void
}

const useLaunchStore = create<LaunchState>()((set) => ({
    launchSignal: false,
    cancelSignal: false,
    setLaunchSignal: (newValue) => set(() => ({ launchSignal: newValue })),
    setCancelSignal: (newValue) => set(() => ({ cancelSignal: newValue }))
}))

export default useLaunchStore
