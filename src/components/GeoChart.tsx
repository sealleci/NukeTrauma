import { memo, useCallback, useEffect, useState } from 'react'
// @ts-expect-error lib no types
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup, useZoomPanContext } from 'react-simple-maps'
import useCounterStore from '../store/counter_store.ts'
import useLaunchStore from '../store/launch_store.ts'
import useRegionStore from '../store/region_store.ts'
import { getRangeRandom } from '../utils/tool.ts'
import worldMap from '../assets/map/features.json'
import '../scss/GeoChart.scss'

const INIT_CENTER: [number, number] = [37.6175, 55.7519]
const INIT_ZOOM: number = 5
const MIN_ZOOM: number = 1
const MAX_ZOOM: number = 25
const NORMAL_COLOR: string = '#3c3171'
const ACTIVE_COLOR: string = '#e84981'

interface GeometryMappingType {
    'Polygon': [number, number][][]
    'MultiPolygon': [number, number][][][]
}

interface GeoItem<T extends keyof GeometryMappingType = 'Polygon'> {
    type: string
    id: string
    rsmKey: string
    svgPath: string
    properties: { name: string }
    geometry: {
        type: T
        coordinates: GeometryMappingType[T]
    }
}

interface ZoomPanContext {
    x: number
    y: number
    k: number
    transformString: string
}

function getIncrement(regionList: string[]): number {
    let sum = 0

    regionList.forEach((region) => {
        switch (region) {
            case 'Russia':
                sum += getRangeRandom(0, 10000)
                break
            case 'United States':
                sum += getRangeRandom(50, 25000)
                break
            case 'China':
                sum += getRangeRandom(150, 50000)
                break
            case 'Japan':
                sum += getRangeRandom(5000, 70000)
                break
            case 'Korea':
                sum += getRangeRandom(4000, 60000)
                break
            case 'United Kingdom':
                sum += getRangeRandom(1000, 15000)
                break
            case 'France':
                sum += getRangeRandom(1500, 20000)
                break
            case 'Italy':
                sum += getRangeRandom(2000, 25000)
                break
            case 'Germany':
                sum += getRangeRandom(1200, 18000)
                break
            case 'Spain':
                sum += getRangeRandom(1100, 16000)
                break
            case 'Poland':
                sum += getRangeRandom(1300, 17000)
                break
            case 'Ethiopia':
                sum += getRangeRandom(800, 8000)
                break
            case 'Iran':
                sum += getRangeRandom(700, 9000)
                break
            case 'India':
                sum += getRangeRandom(8000, 100000)
                break
            case 'Malaysia':
                sum += getRangeRandom(2000, 20000)
                break
            case 'Australia':
                sum += getRangeRandom(10, 9000)
                break
            case 'Canada':
                sum += getRangeRandom(0, 5000)
                break
            case 'Mexico':
                sum += getRangeRandom(4000, 40000)
                break
            case 'Brazil':
                sum += getRangeRandom(50, 60000)
                break
            case 'Argentina':
                sum += getRangeRandom(25, 10000)
                break
            case 'Greenland':
                sum += 0
                break
            case 'Venezuela':
                sum += 666
                break
            default:
                sum += getRangeRandom(25, 8000)
                break
        }
    })

    return sum
}

const GeoChartContent = memo(() => {
    const [curSelectedRegionList, setCurSelectedRegionList] = useState<GeoItem[]>([])
    const regionList = useRegionStore((state) => state.regionList)
    const setRegionList = useRegionStore((state) => state.setRegionList)
    const launchSignal = useLaunchStore((state) => state.launchSignal)
    const setLaunchSignal = useLaunchStore((state) => state.setLaunchSignal)
    const cancelSignal = useLaunchStore((state) => state.cancelSignal)
    const setCancelSignal = useLaunchStore((state) => state.setCancelSignal)
    const increase = useCounterStore((state) => state.increase)
    const zoomContext = useZoomPanContext() as ZoomPanContext

    const handleClick = useCallback((region: GeoItem) => {
        if (curSelectedRegionList.find(curRegion => curRegion.properties.name === region.properties.name) !== undefined) {
            setCurSelectedRegionList(prev => prev.filter((curRegion) => curRegion.properties.name !== region.properties.name))
        } else {
            setCurSelectedRegionList(prev => [...prev, region])
        }
    }, [curSelectedRegionList])

    // well i do some shit here
    const calcCenter = useCallback(<T extends keyof GeometryMappingType = 'Polygon'>(region: GeoItem<T>): [number, number] => {
        let totalCoordCount: number = 0
        let sumX: number = 0
        let sumY: number = 0

        switch (region.geometry.type) {
            case 'Polygon':
                (region as GeoItem<'Polygon'>).geometry.coordinates[0].forEach(([x, y]) => {
                    sumX += x
                    sumY += y
                    totalCoordCount += 1
                })

                return [sumX / totalCoordCount, sumY / totalCoordCount]
            case 'MultiPolygon':
                (region as GeoItem<'MultiPolygon'>).geometry.coordinates.forEach((k) => {
                    k[0].forEach(([x, y]) => {
                        sumX += x
                        sumY += y
                        totalCoordCount += 1
                    })
                })

                return [sumX / totalCoordCount, sumY / totalCoordCount]
            default:
                return [0, 0]
        }
    }, [])

    useEffect(() => {
        setRegionList(curSelectedRegionList.map((region) => region.properties.name))
    }, [curSelectedRegionList, setRegionList])

    useEffect(() => {
        if (!launchSignal && !cancelSignal) {
            return
        }

        if (launchSignal) {
            increase(getIncrement(regionList))
        }

        regionList.forEach((regionName) => {
            setCurSelectedRegionList(prev => prev.filter(curRegion => curRegion.properties.name !== regionName))
        })

        setRegionList([])
        setLaunchSignal(false)
        setCancelSignal(false)
    }, [launchSignal, cancelSignal, regionList, setLaunchSignal, setCancelSignal, setRegionList, increase])

    return <>
        <Geographies
            geography={worldMap}
        >
            {
                ({ geographies }: { geographies: GeoItem[] }) =>
                    geographies.map((geo) => (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => handleClick(geo)}
                            fill={curSelectedRegionList.find(curRegion => curRegion.properties.name === geo.properties.name) !== undefined ? ACTIVE_COLOR : NORMAL_COLOR}
                        />
                    ))
            }
        </Geographies>
        {
            curSelectedRegionList.map(region => <Marker
                key={region.rsmKey + '-label'}
                coordinates={calcCenter(region)}
                onClick={() => handleClick(region)}
            >
                <text
                    fontSize={`${2.25 / zoomContext.k}rem`}
                    className='region_label_text'
                >{region.properties.name}</text>
            </Marker>)
        }
    </>
})

const GeoChart = memo(() => {
    const relocateSignal = useLaunchStore((state) => state.relocateSignal)
    const setRelocateSignal = useLaunchStore((state) => state.setRelocateSignal)

    useEffect(() => {
        if (!relocateSignal) {
            return
        }

        setRelocateSignal(false)
    }, [relocateSignal, setRelocateSignal])

    return <ComposableMap>
        <ZoomableGroup
            center={INIT_CENTER}
            // trick for re-render when relocate signal changes
            zoom={INIT_ZOOM + (relocateSignal ? 1 : 0)}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
        >
            <GeoChartContent />
        </ZoomableGroup>
    </ComposableMap>
})

export default GeoChart
