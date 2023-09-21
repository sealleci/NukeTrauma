import { useRef, useState } from 'react'
import useCharacterStore from '../store/character_store.ts'
import useLanguageStore from '../store/language_store.ts'
import useRegionStore from '../store/region_store.ts'
import DialogueBubble from './DialogueBubble.tsx'
import LanguageSelect from './LanguageSelect.tsx'
import ConsoleLabel from './ConsoleLabel.tsx'
import SecretaryList from './SecretaryList.tsx'
import { LaunchCancelBtn, LaunchConfirmBtn } from './CaptainConsoleButton.tsx'
import Icon from '@mui/material/Icon'
import SecretaryBody from '../assets/img/body.svg'
import '../css/CaptainCabin.css'

function Secretary() {
    const headImage = useCharacterStore((state) => state.headImage)

    return (
        <div className='secretary' style={{ opacity: 1 }}>
            <div className='secretary__head'>
                <img src={headImage} alt='head' />
            </div>
            <div className='secretary__body'>
                <img src={SecretaryBody} alt='body' />
            </div>
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
                    <Icon>arrow_back_ios_new</Icon>
                </div>
                <div>
                    <Icon>favorite</Icon>
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

function SelectedRegionCnt({ text }: { text: string }) {
    const regionList = useRegionStore((state) => state.regionList)

    return (
        <div className='selected_region_cnt'>
            <div className='selected_region_cnt__value'>{regionList.length}</div>
            <ConsoleLabel text={text} />
        </div>
    )
}

function CaptainConsole() {
    const language = useLanguageStore((state) => state.language)
    const uiTranslation = useLanguageStore((state) => state.uiTranslation)

    return (
        <div className='captain_console'>
            <LaunchCancelBtn isWithLabel={true} text={!uiTranslation ? '' : uiTranslation['launch_cancel'][language]} />
            <SelectedRegionCnt text={!uiTranslation ? '' : uiTranslation['selected_region'][language]} />
            <LaunchConfirmBtn isWithLabel={true} text={!uiTranslation ? '' : uiTranslation['launch_confirm'][language]} />
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
