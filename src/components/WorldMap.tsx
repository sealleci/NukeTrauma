import '../css/WorldMap.css'

function DeathCnt() {
    return (
        <div className='death_cnt'>
            <div className="death_cnt__icon">icon</div>
            <div className="death_cnt__value">0</div>
        </div>
    )
}

function WorldMapMain() {
    return (
        <div className='world_map__main'>
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
