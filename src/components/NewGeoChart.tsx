// Chart.js Geochart doesn't have zoom function.

// import { useRef, useEffect, memo } from 'react'
// import { Chart } from 'chart.js'
// import { ChoroplethController, GeoFeature, ColorScale, ProjectionScale, topojson } from 'chartjs-chart-geo'
// import zoomPlugin from 'chartjs-plugin-zoom'
// import type { GeometryObject, Topology } from 'topojson-specification'
// import type { FeatureCollection } from 'geojson'
// import useRegionStore from '../store/region_store'
// import useLaunchStore from '../store/launch_store.ts'
// import useCounterStore from '../store/counter_store.ts'
// import { getRangeRandom } from '../utils/tool.ts'
// import world from '../assets/map/new_world.json'
// import '../css/NewGeoChart.css'

// Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale, zoomPlugin)

// function getIncrement(regionList: string[]): number {
//     let value = 0

//     regionList.forEach((region) => {
//         switch (region) {
//             case 'Russia':
//                 value += getRangeRandom(0, 5000)
//                 break
//             case 'Greenland':
//                 value += 0
//                 break
//             case 'Venezuela':
//                 value += 666
//                 break
//             default:
//                 value += getRangeRandom(5000, 20000)
//                 break
//         }
//     })

//     return value
// }

// const NewGeoChart = memo(() => {
//     const chartRef = useRef<HTMLCanvasElement>(null)
//     const regionList = useRegionStore((state) => state.regionList)
//     const setRegionList = useRegionStore((state) => state.setRegionList)
//     const launchSignal = useLaunchStore((state) => state.launchSignal)
//     const setLaunchSignal = useLaunchStore((state) => state.setLaunchSignal)
//     const cancelSignal = useLaunchStore((state) => state.cancelSignal)
//     const setCancelSignal = useLaunchStore((state) => state.setCancelSignal)
//     const increase = useCounterStore((state) => state.increase)
//     const relocateSignal = useLaunchStore((state) => state.relocateSignal)
//     const setRelocateSignal = useLaunchStore((state) => state.setRelocateSignal)

//     useEffect(() => {
//         const chartCurrent = chartRef.current
//         let chart: Chart | null = null

//         function resize() {
//             chart?.resize()
//         }

//         if (chartCurrent) {
//             const countries = (topojson.feature(world as unknown as Topology, world.objects.countries as GeometryObject) as FeatureCollection).features

//             chart = new Chart(chartCurrent.getContext('2d')!, {
//                 type: 'choropleth',
//                 data: {
//                     labels: countries.map((d) => d.properties?.name),
//                     datasets: [
//                         {
//                             label: 'Countries',
//                             data: countries.map((d) => ({ feature: d, value: 0 }))
//                         }
//                     ]
//                 },
//                 options: {
//                     showOutline: false,
//                     showGraticule: false,
//                     plugins: {
//                         legend: {
//                             display: false
//                         },
//                         zoom: {
//                             zoom: {
//                                 wheel: {
//                                     enabled: true,
//                                 },
//                                 pinch: {
//                                     enabled: true
//                                 },
//                                 mode: 'xy',
//                             }
//                         }
//                     },
//                     scales: {
//                         projection: {
//                             axis: 'y',
//                             projection: 'mercator'
//                         },
//                         color: {
//                             axis: 'y',
//                             display: false,
//                         }
//                     }
//                 }
//             })
//         }

//         window.addEventListener('resize', resize)

//         return () => {
//             if (chart) {
//                 chart.destroy()
//             }

//             window.removeEventListener('resize', resize)
//         }
//     }, [])

//     useEffect(() => {
//         if (!chartRef.current || (!launchSignal && !cancelSignal)) {
//             return
//         }


//         if (launchSignal) {
//             increase(getIncrement(regionList))
//         }

//         regionList.forEach(() => {
//         })

//         setRegionList([])
//         setLaunchSignal(false)
//         setCancelSignal(false)
//     }, [launchSignal, cancelSignal, regionList, setLaunchSignal, setCancelSignal, setRegionList, increase])

//     useEffect(() => {
//         if (!relocateSignal || !chartRef.current) { return }

//         setRelocateSignal(false)
//     }, [relocateSignal, setRelocateSignal])

//     return (
//         <div className='new_geo_chart'>
//             <canvas id='geo' ref={chartRef} />
//         </div>
//     )
// })

// export default NewGeoChart
