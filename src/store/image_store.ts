import { create } from 'zustand'
import { CharacterType } from '../types/data.ts'

interface HeadImageState {
    name: CharacterType
    headImage: string
    setHeadImage: (newName: CharacterType, newImage: string) => void
}

const useHeadImageStore = create<HeadImageState>()((set) => ({
    name: 'neco_arc',
    headImage: '',
    setHeadImage: (newName, newImage) => set(() => ({
        name: newName,
        headImage: newImage
    }))
}))

export default useHeadImageStore
