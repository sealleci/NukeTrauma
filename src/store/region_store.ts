import { create } from 'zustand'

interface RegionState {
    regionList: string[]
    finalRegionList: string[]
    setRegionList: (newRegionList: string[]) => void,
    // in arrow function, regionList won't be updated
    getRegionList: () => string[],
    updateFinalRegionList: () => void
    clearFinalRegionList: () => void
}

const useRegionStore = create<RegionState>()((set, get) => ({
    regionList: [],
    geoIndex: 0,
    finalRegionList: [],
    setRegionList: (newValue) => set(() => ({
        regionList: newValue
    })),
    getRegionList: () => get().regionList,
    updateFinalRegionList: () => set(() => ({
        finalRegionList: get().regionList
    })),
    clearFinalRegionList: () => set(() => ({
        finalRegionList: []
    }))
}))

export default useRegionStore
