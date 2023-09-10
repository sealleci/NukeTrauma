import { useEffect, useState } from 'react'
import GeoChart from './GeoChart.tsx'
import useCounterStore from '../store/counter_store.ts'
import useLaunchStore from '../store/launch_store.ts'
import DeathIcon from '../assets/icon/death.svg'
import Cloud from '../assets/img/cloud.svg'
import '../css/WorldMap.css'

const animationDuration: number = 3000

function DeathCnt() {
    const [prevCount, setPrevCount] = useState<number>(0)
    const [tmpCount, setTmpCount] = useState<number>(0)
    const count = useCounterStore((state) => state.count)

    useEffect(() => {
        if (count <= prevCount) return

        const interval: number = 50
        const times = Math.floor(animationDuration / interval / 2)
        const diff = count - prevCount
        const tmpIncrement = Math.floor(diff / times)
        const remain = diff % times

        function tick(step: number) {
            if (step >= times) {
                setPrevCount(count)
                return
            }

            setTmpCount(prev => prev + tmpIncrement)
            setTimeout(() => tick(step + 1), interval)
        }

        setTmpCount(prev => prev + remain)
        setTimeout(() => tick(0), interval)
    }, [count, prevCount])

    return (
        <div className='death_cnt'>
            <div className='death_cnt__icon'>
                <img src={DeathIcon} alt='death' />
            </div>
            <div className='death_cnt__value'>{tmpCount}</div>
        </div>
    )
}

function WorldMapMain() {
    return (
        <div className='world_map__main'>
            <GeoChart />
        </div>
    )
}

function ExplosionScene() {
    return (
        <div className='explosion_scene'>
            <img src={Cloud} alt="cloud" />
        </div>
    )
}

export default function WorldMap() {
    const [explosion, setExplosion] = useState<JSX.Element>(<></>)
    const launchSignal = useLaunchStore((state) => state.launchSignal)

    useEffect(() => {
        if (launchSignal) {
            setExplosion(<ExplosionScene />)
            setTimeout(() => {
                setExplosion(<></>)
            }, animationDuration)
        }

    }, [launchSignal])

    // useEffect(() => {
    //     setExplosion(<ExplosionScene />)
    //     setTimeout(() => {
    //         setExplosion(<></>)
    //     }, animationDuraion)
    // }, [])

    return (
        <div className='world_map'>
            <DeathCnt />
            {explosion}
            <WorldMapMain />
        </div>
    )
}
