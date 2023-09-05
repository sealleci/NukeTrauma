import { useRef, useState } from 'react'
import '../css/CaptainCabin.css'

function LanguageSelect() {
    return (
        <div className='language_select'></div>
    )
}

function DialogueBubble() {
    return (
        <div className='dialogue_bubble'>
            <span>喵。123，哈哈</span>
        </div>
    )
}

function Secretary() {
    return (
        <div className='secretary'>
            <div className='secretary__head'></div>
            <div className='secretary__body'></div>
        </div>
    )
}

function SecretaryMain() {
    return (
        <div className='secretary_main'>
            <LanguageSelect />
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
        <div className='secretary_list'>
            <div className='secretary_list__item'></div>
            <div className='secretary_list__item'></div>
            <div className='secretary_list__item'></div>
            <div className='secretary_list__item'></div>
        </div>
    )
}

function SecretaryChangeBar() {
    const [isExtended, setIsExtended] = useState<boolean>(false)
    const barRef = useRef<HTMLDivElement>(null)

    function handleClick() {
        if (!barRef.current) { return }

        if (isExtended) {
            barRef.current.classList.remove('secretary_change_bar--extended')
        } else {
            barRef.current.classList.add('secretary_change_bar--extended')
        }

        setIsExtended(!isExtended)
    }

    return (
        <div className='secretary_change_bar' ref={barRef}>
            <SecretaryList />
            <div className='secretary_change_bar__icon' onClick={handleClick}>
                <div>
                    <span>&lt;</span>
                </div>
                <div>
                    <span>bow</span>
                </div>
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
                <div></div>
            </div>
            <div className='launch_btn__text'>终止</div>
        </div>
    )
}

function SelectedRegionCnt() {
    return (
        <div className='selected_region_cnt'>
            <div className='selected_region_cnt__value'>200</div>
            <div className='selected_region_cnt__text'>SELECTED</div>
        </div>
    )
}

function LaunchConfirmBtn() {
    return (
        <div className='launch_confirm_btn launch_btn'>
            <div className='launch_btn__circle'>
                <div></div>
            </div>
            <div className='launch_btn__text'>ЗПУСК</div>
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
