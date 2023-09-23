import { useEffect, useState, memo } from 'react'
import useCounterStore from '../store/counter_store.ts'
import useLaunchStore from '../store/launch_store.ts'
import useWidthStore from '../store/width_stroe.ts'
import GeoChart from './GeoChart.tsx'
import Icon from '@mui/material/Icon'
import LanguageSelect from './LanguageSelect.tsx'
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

const WorldMapMain = memo(() => {
    return (
        <div className='world_map__main'>
            <GeoChart />
        </div>
    )
})

function ExplosionScene() {
    return (
        <div className='explosion_scene'>
            <img src={Cloud} alt="cloud" />
        </div>
    )
}

function RelocateBtn() {
    const setRelocateSignal = useLaunchStore((state) => state.setRelocateSignal)

    function handleClick() {
        setRelocateSignal(true)
    }

    return (
        <div className="relocate_btn" onClick={handleClick}>
            <Icon>zoom_out_map</Icon>
        </div>
    )
}

export default function WorldMap() {
    // In component GeoChart, when launchSignal is true, 
    // it will set it to false immediately.
    const [explosion, setExplosion] = useState<JSX.Element>(<></>)
    const launchSignal = useLaunchStore((state) => state.launchSignal)
    const isSmallScreen = useWidthStore((state) => state.isSmallScreen)

    useEffect(() => {
        if (!launchSignal) { return }

        setExplosion(<ExplosionScene />)
        setTimeout(() => {
            setExplosion(<></>)
        }, animationDuration)
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
            {isSmallScreen && <LanguageSelect />}
            <RelocateBtn />
            {explosion}
            <WorldMapMain />
        </div>
    )
}
