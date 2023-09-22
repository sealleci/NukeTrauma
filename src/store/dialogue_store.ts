import { create } from 'zustand'
import { CharacterType, LanguageType } from '../types/data.ts'

interface DialogueState {
    prevCharacter: CharacterType
    prevRegion: string
    prevSubNumeric: string
    prevLanguage: LanguageType
    curSentence: string
    setPrevCharacter: (newValue: CharacterType) => void
    setPrevRegion: (newValue: string) => void
    setPrevSubNumeric: (newValue: string) => void
    setPrevLanguage: (newValue: LanguageType) => void
    setCurSentence: (newValue: string) => void
}

const useDialogueStore = create<DialogueState>()((set) => ({
    prevCharacter: 'neco_arc',
    prevRegion: 'greeting',
    prevSubNumeric: '',
    prevLanguage: 'zh_cn',
    curSentence: '',
    setPrevCharacter: (newValue: CharacterType) => set({ prevCharacter: newValue }),
    setPrevRegion: (newValue: string) => set({ prevRegion: newValue }),
    setPrevSubNumeric: (newValue: string) => set({ prevSubNumeric: newValue }),
    setPrevLanguage: (newValue: LanguageType) => set({ prevLanguage: newValue }),
    setCurSentence: (newValue) => set(() => ({ curSentence: newValue }))
}))

export default useDialogueStore
