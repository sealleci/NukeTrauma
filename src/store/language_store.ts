import { create } from 'zustand'

interface LanguageState {
    language: string
    setLanguage: (newLanguage: string) => void
}

const useLanguageStore = create<LanguageState>()((set) => ({
    language: '',
    setLanguage: (newLanguage) => set(() => ({
        language: newLanguage
    }))
}))

export default useLanguageStore
