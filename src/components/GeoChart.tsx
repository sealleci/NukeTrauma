import { useRef, useEffect, useMemo } from 'react'
import { init, getInstanceByDom, registerMap } from 'echarts'
import world from '../assets/map/world.json'
import type { CSSProperties } from 'react'
import type { EChartsOption, ECharts, SetOptionOpts, GeoJSON } from 'echarts'

export interface ReactEChartsProps {
    style?: CSSProperties
    settings?: SetOptionOpts
    loading?: boolean
    theme?: 'light' | 'dark'
}

export default function GeoCharts({ style, settings, loading, theme }: ReactEChartsProps) {
    const chartRef = useRef<HTMLDivElement>(null)
    const option = useMemo<EChartsOption>(() => ({
        backgroundColor: 'transparent',
        geo: {
            show: true,
            roam: true,
            map: 'world',
            itemStyle: {
                areaColor: '#DAD4B5'
            },
            label: {
                color: 'white',
            },
            emphasis: {
                label: {
                    color: 'white',
                    show: true,
                    textBorderWidth: 4,
                    textBorderColor: 'black',
                    fontSize: '1.5rem',
                    fontFamily: 'Times New Roman',
                },
                itemStyle: {
                    areaColor: '#A73121',
                }
            },
            center: [37.6175, 55.7519],
            zoom: 6
        },
        series: [
            {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                symbolSize: 8,
                rippleEffect: {
                    brushType: 'stroke'
                }
            }
        ]
    }), [])


    const defaultStyle = useMemo<CSSProperties>(() => ({
        width: '100%',
        height: '99%',
        border: 'none',
        padding: '0',
        margin: '0'
    }), [])

    useEffect(() => {
        let chart: ECharts | null = null

        function resizeChart() {
            chart?.resize()
        }

        if (chartRef.current !== null) {
            chart = init(chartRef.current, theme)
        }

        if (chart) {
            registerMap('world', world as unknown as GeoJSON)
        }

        window.addEventListener('resize', resizeChart)

        return () => {
            chart?.dispose()
            window.removeEventListener('resize', resizeChart)
        }
    }, [theme])

    useEffect(() => {
        if (!chartRef.current) {
            return
        }

        const chart = getInstanceByDom(chartRef.current)!
        chart.setOption(option, settings)
    }, [option, settings, theme])

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

    return <div ref={chartRef} style={{
        ...defaultStyle,
        ...style
    }} />
}
