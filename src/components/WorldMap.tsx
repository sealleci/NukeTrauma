import GeoChart from './GeoChart.tsx'
import useCounterStore from '../store/counter_store.ts'
import DeathIcon from '../assets/icon/death.svg'
import '../css/WorldMap.css'

function DeathCnt() {
    const count = useCounterStore((state) => state.count)

    return (
        <div className='death_cnt'>
            <div className='death_cnt__icon'>
                <img src={DeathIcon} alt='death' />
            </div>
            <div className='death_cnt__value'>{count}</div>
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

export default function WorldMap() {
    return (
        <div className='world_map'>
            <DeathCnt />
            <WorldMapMain />
        </div>
    )
}
