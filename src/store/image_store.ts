import { create } from 'zustand'

interface HeadImageState {
    headImage: string
    setHeadImage: (newImage: string) => void
}

const useHeadImageStore = create<HeadImageState>()((set) => ({
    headImage: '',
    setHeadImage: (newImage) => set(() => ({
        headImage: newImage
    }))
}))

export default useHeadImageStore
