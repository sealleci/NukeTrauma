import { create } from 'zustand'

interface SelectState {
    isSelectOpen: boolean
    setIsSelectOpen: (newValue: boolean) => void
}

const useSelectStore = create<SelectState>()((set) => ({
    isSelectOpen: false,
    setIsSelectOpen: (newValue) => set(() => ({
        isSelectOpen: newValue
    }))
}))

export default useSelectStore