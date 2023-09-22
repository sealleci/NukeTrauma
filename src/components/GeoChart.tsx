import { useRef, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { init, getInstanceByDom, registerMap, use } from 'echarts/core'
import { MapChart } from 'echarts/charts'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { getRangeRandom } from '../utils/tool.ts'
import type { MapSeriesOption } from 'echarts/charts'
import type { ComposeOption, EChartsType, SetOptionOpts } from 'echarts/core'
import useRegionStore from '../store/region_store'
import useLaunchStore from '../store/launch_store.ts'
import useCounterStore from '../store/counter_store.ts'
import world from '../assets/map/world.json'

type ECOption = ComposeOption<MapSeriesOption>

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

use([
    MapChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
])

const geoOption: ECOption = {
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
    height: '100%',
    border: 'none',
    padding: '0',
    margin: '0'
}

function getIncrement(regionList: string[]): number {
    let value = 0

    regionList.forEach((region) => {
        switch (region) {
            case 'Russia':
                value += getRangeRandom(0, 5000)
                break
            case 'Greenland':
                value += 0
                break
            case 'Venezuela':
                value += 666
                break
            default:
                value += getRangeRandom(5000, 20000)
                break
        }
    })

    return value
}

export default function GeoCharts({ style, settings, loading, theme }: ReactEChartsProps) {
    const chartRef = useRef<HTMLDivElement>(null)
    const regionList = useRegionStore((state) => state.regionList)
    const setRegionList = useRegionStore((state) => state.setRegionList)
    const launchSignal = useLaunchStore((state) => state.launchSignal)
    const setLaunchSignal = useLaunchStore((state) => state.setLaunchSignal)
    const cancelSignal = useLaunchStore((state) => state.cancelSignal)
    const setCancelSignal = useLaunchStore((state) => state.setCancelSignal)
    const increase = useCounterStore((state) => state.increase)

    useEffect(() => {
        let chart: EChartsType | null = null

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
            // eslint-disable-next-line
            registerMap('world', world as any)
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

        if (launchSignal) {
            increase(getIncrement(regionList))
        }

        regionList.forEach((region) => {
            chart.dispatchAction({
                type: 'geoUnSelect',
                name: region
            })
        })

        setRegionList([])
        setLaunchSignal(false)
        setCancelSignal(false)
    }, [launchSignal, cancelSignal, regionList, setLaunchSignal, setCancelSignal, setRegionList, increase])

    return <div ref={chartRef} style={{ ...defaultStyle, ...style }} />
}
