import { create } from 'zustand'
import type { LanguageType, UiTranslationType } from '../types/data.ts'

interface LanguageState {
    language: LanguageType,
    uiTranslation: UiTranslationType,
    setLanguage: (newLanguage: LanguageType) => void,
    setTranslation: (newUiTranslation: UiTranslationType) => void
}

const useLanguageStore = create<LanguageState>()((set) => ({
    language: 'zh_cn',
    uiTranslation: {},
    setLanguage: (newLanguage) => set(() => ({
        language: newLanguage
    })),
    setTranslation: (newUiTranslation) => set(() => ({
        uiTranslation: newUiTranslation
    }))
}))

export default useLanguageStore
