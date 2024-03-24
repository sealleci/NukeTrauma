import { useEffect, useRef, useState } from 'react'
import useCharacterStore from '../store/character_store.ts'
import useLanguageStore from '../store/language_store.ts'
import useRegionStore from '../store/region_store.ts'
import { LaunchCancelBtn, LaunchConfirmBtn } from './CaptainConsoleButton'
import ConsoleLabel from './ConsoleLabel'
import DialogueBubble from './DialogueBubble'
import LanguageSelect from './LanguageSelect'
import SecretaryBackground from './SecretaryBackground'
import SecretaryList from './SecretaryList'
import Icon from '@mui/material/Icon'
import SecretaryBody from '../assets/img/body.svg'
import '../scss/CaptainCabin.scss'

function Secretary() {
    const [prevHeadImage, setPrevHeadImage] = useState<string>('')
    const timerRef = useRef<number>(-1)
    const prevSecretaryRef = useRef<HTMLDivElement>(null)
    const curSecretaryRef = useRef<HTMLDivElement>(null)
    const headImage = useCharacterStore((state) => state.headImage)

    useEffect(() => {
        if (prevHeadImage === '') {
            setPrevHeadImage(headImage)
            return
        }

        if (prevHeadImage === headImage
            || prevSecretaryRef.current === null
            || curSecretaryRef.current === null) { return }

        if (timerRef.current !== -1) {
            clearTimeout(timerRef.current)
        }

        curSecretaryRef.current.classList.remove('secretary--moving')
        prevSecretaryRef.current.classList.remove('secretary--moving')

        curSecretaryRef.current.classList.remove('secretary--shaking')
        curSecretaryRef.current.classList.add('secretary--moving')
        prevSecretaryRef.current.classList.add('secretary--moving')

        timerRef.current = setTimeout(() => {
            curSecretaryRef.current?.classList.remove('secretary--moving')
            prevSecretaryRef.current?.classList.remove('secretary--moving')
            curSecretaryRef.current?.classList.add('secretary--shaking')

            setPrevHeadImage(headImage)
        }, 300)
    }, [headImage, prevHeadImage])

    return (
        <>
            <div className='secretary secretary--shaking' ref={curSecretaryRef}>
                <div className='secretary__head'>
                    <img src={headImage} alt='head' draggable={false} />
                </div>
                <div className='secretary__body'>
                    <img src={SecretaryBody} alt='body' draggable={false} />
                </div>
            </div>
            <div className='secretary prev_secretary' ref={prevSecretaryRef}>
                <div className='secretary__head'>
                    <img src={prevHeadImage} alt='head' draggable={false} />
                </div>
                <div className='secretary__body'>
                    <img src={SecretaryBody} alt='body' draggable={false} />
                </div>
            </div>
        </>
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

function SecretaryDisplay() {
    return (
        <div className='secretary_display'>
            <SecretaryMain />
            <SecretaryBackground />
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
