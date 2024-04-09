import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
// @ts-expect-error lib no types
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup, useZoomPanContext } from 'react-simple-maps'
import useCounterStore from '../store/counter_store.ts'
import useLaunchStore from '../store/launch_store.ts'
import useRegionStore from '../store/region_store.ts'
import useWidthStore from '../store/width_stroe.ts'
import { getRangeRandom } from '../utils/tool.ts'
import { calcPolygonArea, calcPolygonCentroid } from '../utils/geometry.ts'
import worldMapData from '../assets/map/features.json'
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

interface RegionAreaProps {
    geo: GeoItem
    onClick: () => void
    isSelected: boolean
}

interface RegionLabelProps {
    coordinates: [number, number]
    onClick: () => void
    fontSize: string
    textContent: string
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

const RegionArea = memo(({ geo, onClick, isSelected }: RegionAreaProps) => {
    return <Geography
        geography={geo}
        onClick={onClick}
        fill={isSelected ? ACTIVE_COLOR : NORMAL_COLOR}
    />
})

const RegionLabel = memo(({ coordinates, onClick, fontSize, textContent }: RegionLabelProps) => {
    return <Marker
        coordinates={coordinates}
        onClick={onClick}
    >
        <text
            fontSize={fontSize}
            className='region_label_text'
        >{textContent}</text>
    </Marker>
})

const GeoChartContent = memo(() => {
    const [curSelectedRegionList, setCurSelectedRegionList] = useState<GeoItem[]>([])
    const storedRegionCenters = useRef<Record<string, [number, number]>>({})
    const zoomContext = useZoomPanContext() as ZoomPanContext
    const regionList = useRegionStore((state) => state.regionList)
    const setRegionList = useRegionStore((state) => state.setRegionList)
    const launchSignal = useLaunchStore((state) => state.launchSignal)
    const setLaunchSignal = useLaunchStore((state) => state.setLaunchSignal)
    const cancelSignal = useLaunchStore((state) => state.cancelSignal)
    const setCancelSignal = useLaunchStore((state) => state.setCancelSignal)
    const increase = useCounterStore((state) => state.increase)
    const fontSize = useMemo(() => `${1.25 / zoomContext.k}rem`
        , [zoomContext])

    const handleClick = useCallback((region: GeoItem) => {
        if (curSelectedRegionList.find(curRegion => curRegion.properties.name === region.properties.name) !== undefined) {
            setCurSelectedRegionList(prev => prev.filter((curRegion) => curRegion.properties.name !== region.properties.name))
        } else {
            setCurSelectedRegionList(prev => [...prev, region])
        }
    }, [curSelectedRegionList])

    const getCenter = useCallback(<T extends keyof GeometryMappingType = 'Polygon'>(region: GeoItem<T>): [number, number] => {
        if (region.properties.name in storedRegionCenters.current) {
            return storedRegionCenters.current[region.properties.name]
        }

        let tmpArea: number = 0
        let tmpCenter: [number, number] = [0, 0]
        let totalArea: number = 0
        let multiCenterX: number = 0
        let multiCenterY: number = 0
        let isHasBigPart: boolean = false

        switch (region.geometry.type) {
            case 'Polygon':
                storedRegionCenters.current[region.properties.name] = calcPolygonCentroid((region as GeoItem<'Polygon'>).geometry.coordinates[0])

                return storedRegionCenters.current[region.properties.name]
            case 'MultiPolygon':
                totalArea = (region as GeoItem<'MultiPolygon'>).geometry.coordinates
                    .reduce((sum, l) => sum + calcPolygonArea(l[0]), 0);
                (region as GeoItem<'MultiPolygon'>).geometry.coordinates
                    .forEach((l) => {
                        if (isHasBigPart) {
                            return
                        }

                        tmpArea = calcPolygonArea(l[0])
                        tmpCenter = calcPolygonCentroid(l[0])

                        if (tmpArea / totalArea > 0.5) {
                            multiCenterX = tmpCenter[0]
                            multiCenterY = tmpCenter[1]
                            isHasBigPart = true
                            return
                        } else {
                            multiCenterX += tmpCenter[0] / totalArea * tmpArea
                            multiCenterY += tmpCenter[1] / totalArea * tmpArea
                        }
                    })

                storedRegionCenters.current[region.properties.name] = [multiCenterX, multiCenterY]
                return storedRegionCenters.current[region.properties.name]
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
            geography={worldMapData}
        >
            {
                ({ geographies }: { geographies: GeoItem[] }) =>
                    geographies.map((region) => <RegionArea
                        key={region.rsmKey}
                        geo={region}
                        onClick={() => handleClick(region)}
                        isSelected={curSelectedRegionList.find(curRegion => curRegion.properties.name === region.properties.name) !== undefined}
                    />)
            }
        </Geographies>
        {
            curSelectedRegionList.map(region => <RegionLabel
                key={region.rsmKey + '-label'}
                coordinates={getCenter(region)}
                onClick={() => handleClick(region)}
                fontSize={fontSize}
                textContent={region.properties.name}
            />)
        }
    </>
})

const GeoChart = memo(() => {
    const relocateSignal = useLaunchStore((state) => state.relocateSignal)
    const setRelocateSignal = useLaunchStore((state) => state.setRelocateSignal)
    const worldMapWidth = useWidthStore((state) => state.worldMapWidth)
    const worldMapHeight = useWidthStore((state) => state.worldMapHeight)
    // XXX: 
    // this is a trick to trigger re-render when relocate signal changes, 
    // but the signal changes twice at once due to the following useEffect.
    const curZoom = useMemo(() => {
        return INIT_ZOOM + (relocateSignal ? 0.01 : 0)
    }, [relocateSignal])

    useEffect(() => {
        if (!relocateSignal) {
            return
        }

        setRelocateSignal(false)
    }, [relocateSignal, setRelocateSignal])

    return <ComposableMap
        width={worldMapWidth}
        height={worldMapHeight}
    >
        <ZoomableGroup
            center={INIT_CENTER}
            zoom={curZoom}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
        >
            <GeoChartContent />
        </ZoomableGroup>
    </ComposableMap>
})

export default GeoChart
