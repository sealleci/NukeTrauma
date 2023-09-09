import { useRef, useEffect } from 'react'
import { init, getInstanceByDom, registerMap } from 'echarts'
import useRegionStore from '../store/region_store'
import useLaunchStore from '../store/launch_store.ts'
import world from '../assets/map/world.json'
import type { CSSProperties } from 'react'
import type { EChartsOption, ECharts, SetOptionOpts, GeoJSON } from 'echarts'

interface ReactEChartsProps {
    style?: CSSProperties
    settings?: SetOptionOpts
    loading?: boolean
    theme?: 'light' | 'dark'
}

interface GeoSelectChangedEvent {
    type: string
    name: string,
    allSelected: { geoIndex: number, name: string[] }[]
    selected: Record<string, boolean>
    seriesId?: string
}

const geoOption: EChartsOption = {
    backgroundColor: 'transparent',
    geo: {
        show: true,
        roam: true,
        map: 'world',
        selectedMode: 'multiple',
        itemStyle: {
            areaColor: '#DAD4B5'
        },
        label: {
            color: 'white'
        },
        emphasis: {
            label: {
                color: 'white',
                show: true,
                textBorderWidth: 3,
                textBorderColor: 'black',
                fontSize: '1.5rem',
                fontFamily: 'Times New Roman'
            },
            itemStyle: {
                areaColor: '#E25E3E'
            }
        },
        select: {
            label: {
                color: 'white',
                show: true,
                textBorderWidth: 3,
                textBorderColor: 'black',
                fontSize: '1.5rem',
                fontFamily: 'Times New Roman'
            },
            itemStyle: {
                areaColor: '#C63D2F'
            }
        },
        center: [37.6175, 55.7519],
        zoom: 5
    }
}

const defaultStyle: CSSProperties = {
    width: '100%',
    height: '99%',
    border: 'none',
    padding: '0',
    margin: '0'
}

export default function GeoCharts({ style, settings, loading, theme }: ReactEChartsProps) {
    const chartRef = useRef<HTMLDivElement>(null)
    const regionList = useRegionStore((state) => state.regionList)
    const setRegionList = useRegionStore((state) => state.setRegionList)
    const launchSignal = useLaunchStore((state) => state.launchSignal)
    const setLaunchSignal = useLaunchStore((state) => state.setLaunchSignal)
    const cancelSignal = useLaunchStore((state) => state.cancelSignal)
    const setCancelSignal = useLaunchStore((state) => state.setCancelSignal)

    useEffect(() => {
        let chart: ECharts | null = null

        function resizeChart() {
            chart?.resize()
        }

        if (chartRef.current) {
            chart = init(chartRef.current, theme)
            chart.on('geoselectchanged', (params) => {
                setRegionList((params as GeoSelectChangedEvent).allSelected[0].name)
            })
        }

        if (chart) {
            registerMap('world', world as unknown as GeoJSON)
        }

        window.addEventListener('resize', resizeChart)

        return () => {
            chart?.dispose()
            window.removeEventListener('resize', resizeChart)
        }
    }, [theme, setRegionList])

    useEffect(() => {
        if (!chartRef.current) {
            return
        }

        const chart = getInstanceByDom(chartRef.current)!
        chart.setOption(geoOption, settings)
    }, [settings, theme])

    useEffect(() => {
        if (!chartRef.current) {
            return
        }

        const chart = getInstanceByDom(chartRef.current)!

        if (loading) {
            chart.showLoading()
        } else {
            chart.hideLoading()
        }
    }, [loading, theme])

    useEffect(() => {
        if (!chartRef.current || (!launchSignal && !cancelSignal)) {
            return
        }

        const chart = getInstanceByDom(chartRef.current)!

        regionList.forEach((region) => {
            chart.dispatchAction({
                type: 'geoUnSelect',
                name: region
            })
        })
        setRegionList([])
        setLaunchSignal(false)
        setCancelSignal(false)
    }, [launchSignal, setLaunchSignal, cancelSignal, setCancelSignal, regionList, setRegionList])

    return <div ref={chartRef} style={{ ...defaultStyle, ...style }} />
}
