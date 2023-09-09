import { create } from 'zustand'

interface LaunchState {
    launchSignal: boolean,
    cancelSignal: boolean,
    setLaunchSignal: (newLaunchSignal: boolean) => void,
    setCancelSignal: (newCancelSignal: boolean) => void
}

const useLaunchStore = create<LaunchState>()((set) => ({
    launchSignal: false,
    cancelSignal: false,
    setLaunchSignal: (newLaunchSignal) => set(() => ({ launchSignal: newLaunchSignal })),
    setCancelSignal: (newCancelSignal) => set(() => ({ cancelSignal: newCancelSignal }))
}))

export default useLaunchStore
