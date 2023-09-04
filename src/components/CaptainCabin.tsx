import '../css/CaptainCabin.css'

function DialogueBubble() {
    return (
        <div className='dialogue_bubble'>
            <div className="dialogue_bubble__body">text</div>
            <div className="dialogue_bubble__tail"></div>
        </div>
    )
}

function Secretary() {
    return (
        <div className='secretary'>
            <div className="secretary__head"></div>
            <div className="secretary__body"></div>
        </div>
    )
}

function SecretaryMain() {
    return (
        <div className='secretary_main'>
            <DialogueBubble />
            <Secretary />
        </div>
    )
}

function SecretaryBg() {
    return (
        <div className='secretary_bg'>
        </div>
    )
}

function SecretaryDisplay() {
    return (
        <div className='secretary_display'>
            <SecretaryMain />
            <SecretaryBg />
        </div>
    )
}

function SecretaryList() {
    return (
        <div className="secretary_list">
            <div className="secretary_list__item">1</div>
            <div className="secretary_list__item">2</div>
            <div className="secretary_list__item">3</div>
            <div className="secretary_list__item">4</div>
        </div>
    )
}

function SecretaryChangeBar() {
    return (
        <div className='secretary_change_bar'>
            <SecretaryList />
            <div className="secretary_change_bar__icon">
                <div>&lt;</div>
                <div>bow</div>
                <div>&gt;</div>
            </div>
        </div>
    )
}

function SecretaryScene() {
    return (
        <div className='secretary_scene'>
            <SecretaryDisplay />
            <SecretaryChangeBar />
        </div>
    )
}

function LaunchCancelBtn() {
    return (
        <div className='launch_cancel_btn launch_btn'>
            <div className='launch_btn__circle'>
                <div>icon</div>
            </div>
            <div className='launch_btn__text'>终止</div>
        </div>
    )
}

function SelectedRegionCnt() {
    return (
        <div className='selected_region_cnt'>
            <div className="selected_region_cnt__value">0</div>
            <div className="selected_region_cnt__text">已选区域</div>
        </div>
    )
}

function LaunchConfirmBtn() {
    return (
        <div className='launch_confirm_btn launch_btn'>
            <div className='launch_btn__circle'>
                <div>icon</div>
            </div>
            <div className='launch_btn__text'>发射</div>
        </div>
    )
}

function CaptainConsole() {
    return (
        <div className='captain_console'>
            <LaunchCancelBtn />
            <SelectedRegionCnt />
            <LaunchConfirmBtn />
        </div>
    )
}

export default function CaptainCabin() {
    return (
        <div className='captain_cabin'>
            <SecretaryScene />
            <CaptainConsole />
        </div>
    )
}
