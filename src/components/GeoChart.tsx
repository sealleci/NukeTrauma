import { useRef, useEffect, useCallback, memo } from 'react'
import type { CSSProperties } from 'react'
import { init, getInstanceByDom, registerMap, use } from 'echarts/core'
import { MapChart } from 'echarts/charts'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { getRangeRandom } from '../utils/tool.ts'
import type { EChartsType, ElementEvent, SetOptionOpts } from 'echarts/core'
import type { EChartsOption, GeoOption } from 'echarts/types/dist/shared.d.ts'
import useRegionStore from '../store/region_store'
import useLaunchStore from '../store/launch_store.ts'
import useCounterStore from '../store/counter_store.ts'
import world from '../assets/map/world.json'

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

interface Coordinate {
    x: number
    y: number
}

use([
    MapChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
])

const SCALE_MIN: number = 1
const SCALE_MAX: number = 50
const INIT_ZOOM: number = 5
const INIT_CENTER: [number, number] = [37.6175, 55.7519]
const EVENT_INTERVAL: number = 68

const geoOption: EChartsOption = {
    backgroundColor: 'transparent',
    animationDelayUpdate: 0,
    animationDurationUpdate: EVENT_INTERVAL,
    geo: {
        show: true,
        roam: false,
        map: 'world',
        selectedMode: 'multiple',
        scaleLimit: {
            min: SCALE_MIN,
            max: SCALE_MAX
        },
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
        center: INIT_CENTER,
        zoom: INIT_ZOOM
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

function getDistance(p1: Coordinate, p2: Coordinate): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

const GeoCharts = memo(({ style, settings, loading, theme }: ReactEChartsProps) => {
    const isScaling = useRef<boolean>(false)
    const touchScaleThrottlingSignal = useRef<boolean>(true)
    const wheelScaleThrottlingSignal = useRef<boolean>(true)
    const blankMoveThrottlingSignal = useRef<boolean>(true)
    const scaleCoef = useRef<number>(5)
    const prevDist = useRef<number>(0)
    const chartRef = useRef<HTMLDivElement>(null)
    const prevMoveCoord = useRef<Coordinate | null>(null)
    const regionList = useRegionStore((state) => state.regionList)
    const setRegionList = useRegionStore((state) => state.setRegionList)
    const launchSignal = useLaunchStore((state) => state.launchSignal)
    const setLaunchSignal = useLaunchStore((state) => state.setLaunchSignal)
    const cancelSignal = useLaunchStore((state) => state.cancelSignal)
    const setCancelSignal = useLaunchStore((state) => state.setCancelSignal)
    const increase = useCounterStore((state) => state.increase)
    const relocateSignal = useLaunchStore((state) => state.relocateSignal)
    const setRelocateSignal = useLaunchStore((state) => state.setRelocateSignal)

    const scaleForTouch = useCallback((event: TouchEvent) => {
        if (event.targetTouches.length < 2 || !chartRef.current || !touchScaleThrottlingSignal.current) { return }

        const chart = getInstanceByDom(chartRef.current)!

        const touch1 = event.targetTouches[0]
        const touch2 = event.targetTouches[1]
        const p1: Coordinate = {
            x: touch1.clientX,
            y: touch1.clientY
        }
        const p2: Coordinate = {
            x: touch2.clientX,
            y: touch2.clientY
        }
        const curDist = getDistance(p1, p2)

        if (prevDist.current === 0) {
            prevDist.current = curDist
        }

        const newScale = scaleCoef.current * (curDist / prevDist.current)

        scaleCoef.current = Math.min(Math.max(newScale, SCALE_MIN), SCALE_MAX)

        if (Math.abs(curDist - prevDist.current) > 1e-6) {
            chart.setOption({
                geo: {
                    zoom: scaleCoef.current
                }
            }, {
                lazyUpdate: true,
                silent: true
            })

            touchScaleThrottlingSignal.current = false
            setTimeout(() => {
                touchScaleThrottlingSignal.current = true
            }, EVENT_INTERVAL)
            isScaling.current = true
        }

        prevDist.current = curDist
    }, [])

    const scaleForTouchEnd = useCallback(() => {
        prevDist.current = 0
        isScaling.current = false
    }, [])

    const scaleForWheel = useCallback((event: WheelEvent) => {
        if (!chartRef.current || !wheelScaleThrottlingSignal.current) { return }

        const SCALE_PROC: number = 1.4
        const chart = getInstanceByDom(chartRef.current)!

        if (event.deltaY < 0) {
            scaleCoef.current *= SCALE_PROC
        } else {
            scaleCoef.current /= SCALE_PROC
        }

        scaleCoef.current = Math.min(Math.max(scaleCoef.current, SCALE_MIN), SCALE_MAX)

        chart.setOption({
            geo: {
                zoom: scaleCoef.current
            }
        }, {
            lazyUpdate: true,
            silent: true
        })

        wheelScaleThrottlingSignal.current = false
        setTimeout(() => {
            wheelScaleThrottlingSignal.current = true
        }, 20)
    }, [])

    const handleBlankMove = useCallback((params: ElementEvent) => {
        if (!chartRef.current || !prevMoveCoord.current || isScaling.current) { return }

        const COMPENSATION: number = 6
        const chart = getInstanceByDom(chartRef.current)!
        const center = ((chart.getOption() as unknown as EChartsOption).geo as GeoOption[])[0].center as number[]
        const dist = getDistance(
            { x: params.offsetX, y: params.offsetY },
            { x: prevMoveCoord.current.x, y: prevMoveCoord.current.y }
        )
        const convertedPrev = chart.convertFromPixel({ geoIndex: 0 }, [prevMoveCoord.current.x, prevMoveCoord.current.y])
        const convertedCur = chart.convertFromPixel({ geoIndex: 0 }, [params.offsetX, params.offsetY])

        if (dist > 1e-6 && blankMoveThrottlingSignal.current) {
            chart.setOption({
                geo: {
                    center: [
                        center[0] - (convertedCur[0] - convertedPrev[0]) * COMPENSATION,
                        center[1] - (convertedCur[1] - convertedPrev[1]) * COMPENSATION
                    ]
                }
            }, {
                lazyUpdate: true,
                silent: true
            })

            blankMoveThrottlingSignal.current = false
            setTimeout(() => {
                blankMoveThrottlingSignal.current = true
            }, EVENT_INTERVAL)
        }

        prevMoveCoord.current = {
            x: params.offsetX,
            y: params.offsetY
        }
    }, [])

    useEffect(() => {
        const chartCurrent = chartRef.current
        let chart: EChartsType | null = null

        function resizeChart() {
            chart?.resize()
        }

        if (chartCurrent) {
            chart = init(chartRef.current, theme)
            chart.on('geoselectchanged', (params) => {
                setRegionList((params as GeoSelectChangedEvent).allSelected[0].name)
            })
            chart.getZr().on('mousemove', handleBlankMove)
            chart.getZr().on('mousedown', (params) => {
                prevMoveCoord.current = {
                    x: params.offsetX,
                    y: params.offsetY
                }
            })
            chart.getZr().on('mouseup', () => {
                prevMoveCoord.current = null
            })
            chart.getZr().on('mousewheel', (params) => {
                scaleForWheel(params.event as unknown as WheelEvent)
            })

            chartCurrent.addEventListener('touchmove', scaleForTouch)
            chartCurrent.addEventListener('touchend', scaleForTouchEnd)
            chartCurrent.addEventListener('wheel', scaleForWheel)

            // eslint-disable-next-line
            registerMap('world', world as any)
        }

        window.addEventListener('resize', resizeChart)

        return () => {
            chartCurrent?.removeEventListener('touchmove', scaleForTouch)
            chartCurrent?.removeEventListener('touchend', scaleForTouchEnd)
            chartCurrent?.removeEventListener('wheel', scaleForWheel)
            chart?.off('geoselectchanged')
            chart?.getZr()?.off('mousemove')
            chart?.getZr()?.off('mouseup')
            chart?.getZr()?.off('mousedown')
            chart?.dispose()
            window.removeEventListener('resize', resizeChart)

        }
    }, [theme, setRegionList, scaleForTouch, scaleForTouchEnd, scaleForWheel, handleBlankMove])

    useEffect(() => {
        if (!chartRef.current) { return }

        const chart = getInstanceByDom(chartRef.current)!
        chart.setOption(geoOption, settings)
    }, [settings, theme])

    useEffect(() => {
        if (!chartRef.current) { return }

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

    useEffect(() => {
        if (!relocateSignal || !chartRef.current) { return }


        const chart = getInstanceByDom(chartRef.current)!

        chart.setOption({
            geo: {
                center: INIT_CENTER,
                zoom: INIT_ZOOM
            }
        })
        setRelocateSignal(false)
    }, [relocateSignal, setRelocateSignal])

    return <div ref={chartRef} style={{ ...defaultStyle, ...style }} />
})

export default GeoCharts
