import { create } from 'zustand'
import type { CharacterType } from '../types/data.ts'

interface CharacterState {
    type: CharacterType
    headImage: string
    setCharacter: (newType: CharacterType, newImage: string) => void
}

const useCharacterStore = create<CharacterState>()((set) => ({
    type: 'neco_arc',
    headImage: '',
    setCharacter: (newType, newImage) => set(() => ({
        type: newType,
        headImage: newImage
    }))
}))

export default useCharacterStore
