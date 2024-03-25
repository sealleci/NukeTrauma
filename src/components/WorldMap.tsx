import { memo, useEffect, useState } from 'react'
import Icon from '@mui/material/Icon'
import useCounterStore from '../store/counter_store.ts'
import useLaunchStore from '../store/launch_store.ts'
import useWidthStore from '../store/width_stroe.ts'
import GeoChart from './GeoChart'
import LanguageSelect from './LanguageSelect'
import MushroomHeadImage from '../assets/img/mushroom_head.png'
import MushroomRootImage from '../assets/img/mushroom_root.png'
import DeathIcon from '../assets/icon/death.svg'
import '../scss/WorldMap.scss'

const animationDuration: number = 3000

function DeathCounter() {
    const [prevCount, setPrevCount] = useState<number>(0)
    const [displayCount, setDisplayCount] = useState<number>(0)
    const count = useCounterStore((state) => state.count)

    useEffect(() => {
        if (count <= prevCount) return

        const COMPENSATION: number = 2
        const interval: number = 50
        const times = Math.floor(animationDuration / interval / COMPENSATION)
        const diff = count - prevCount
        const tmpIncrement = Math.floor(diff / times)
        const remain = diff % times

        function tick(step: number) {
            if (step >= times) {
                setPrevCount(count)
                return
            }

            setDisplayCount(prev => prev + tmpIncrement)
            setTimeout(() => tick(step + 1), interval)
        }

        setDisplayCount(prev => prev + remain)
        setTimeout(() => tick(0), interval)
    }, [count, prevCount])

    return (
        <div className='death_counter'>
            <div className='death_counter__icon'>
                <img src={DeathIcon} alt='death' draggable={false} />
            </div>
            <div className='death_counter__value'>{displayCount}</div>
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
            <img src={MushroomHeadImage}
                alt='mushroom head'
                draggable={false} />
            <img src={MushroomRootImage}
                alt='mushroom root'
                draggable={false} />
        </div>
    )
}

function RelocateBtn() {
    const setRelocateSignal = useLaunchStore((state) => state.setRelocateSignal)

    function handleClick() {
        setRelocateSignal(true)
    }

    return (
        <div className='relocate_btn' onClick={handleClick}>
            <Icon>zoom_out_map</Icon>
        </div>
    )
}

export default function WorldMap() {
    /**  
     * In component GeoChart, when launchSignal is true, 
     * it will set it to false immediately.
    */
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
    //     }, animationDuration)
    // }, [])

    return (
        <div className='world_map'>
            <DeathCounter />
            {isSmallScreen && <LanguageSelect />}
            <RelocateBtn />
            {explosion}
            <WorldMapMain />
        </div>
    )
}
