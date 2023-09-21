import { create } from 'zustand'
import type { LanguageType, UiTranslationType, DialogueType } from '../types/data.ts'

interface LanguageState {
    language: LanguageType,
    uiTranslation: UiTranslationType | null,
    dialogue: DialogueType | null,
    setLanguage: (newValue: LanguageType) => void,
    setUiTranslation: (newValue: UiTranslationType) => void,
    setDialogue: (newValue: DialogueType) => void
}

const useLanguageStore = create<LanguageState>()((set) => ({
    language: 'zh_cn',
    uiTranslation: null,
    dialogue: null,
    setLanguage: (newValue) => set(() => ({
        language: newValue
    })),
    setUiTranslation: (newValue) => set(() => ({
        uiTranslation: newValue
    })),
    setDialogue: (newValue) => set(() => ({
        dialogue: newValue
    }))
}))

export default useLanguageStore
