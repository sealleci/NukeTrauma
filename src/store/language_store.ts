import { create } from 'zustand'
import type { LanguageType, UiTranslationType, DialogueType } from '../types/data.ts'

interface LanguageState {
    language: LanguageType,
    uiTranslation: UiTranslationType | null,
    dialogue: DialogueType | null,
    setLanguage: (newLanguage: LanguageType) => void,
    setUiTranslation: (newUiTranslation: UiTranslationType) => void,
    setDialogue: (newDialogue: DialogueType) => void
}

const useLanguageStore = create<LanguageState>()((set) => ({
    language: 'zh_cn',
    uiTranslation: null,
    dialogue: null,
    setLanguage: (newLanguage) => set(() => ({
        language: newLanguage
    })),
    setUiTranslation: (newUiTranslation) => set(() => ({
        uiTranslation: newUiTranslation
    })),
    setDialogue: (newDialogue) => set(() => ({
        dialogue: newDialogue
    }))
}))

export default useLanguageStore
