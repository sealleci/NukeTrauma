import { create } from 'zustand'

interface RegionState {
    regionList: string[],
    finalRegionList: string[],
    setRegionList: (newRegionList: string[]) => void,
    updateFinalRegionList: () => void,
    clearFinalRegionList: () => void
}

const useRegionStore = create<RegionState>()((set, get) => ({
    regionList: [],
    geoIndex: 0,
    finalRegionList: [],
    setRegionList: (newRegionList) => set(() => ({
        regionList: newRegionList
    })),
    updateFinalRegionList: () => set(() => ({
        finalRegionList: get().regionList
    })),
    clearFinalRegionList: () => set(() => ({
        finalRegionList: []
    }))
}))

export default useRegionStore
