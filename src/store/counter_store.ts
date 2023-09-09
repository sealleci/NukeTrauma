import { create } from 'zustand'

interface CounterState {
    count: number,
    increase: (value: number) => void
}

const useCounterStore = create<CounterState>()((set) => ({
    count: 0,
    increase: (value) => set((state) => ({ count: state.count + value }))
}))

export default useCounterStore
