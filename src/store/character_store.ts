import { create } from 'zustand'
import { CharacterType } from '../types/data.ts'

interface CharacterState {
    type: CharacterType
    headImage: string
    setHeadImage: (newType: CharacterType, newImage: string) => void
}

const useCharacterStore = create<CharacterState>()((set) => ({
    type: 'neco_arc',
    headImage: '',
    setHeadImage: (newType, newImage) => set(() => ({
        type: newType,
        headImage: newImage
    }))
}))

export default useCharacterStore
