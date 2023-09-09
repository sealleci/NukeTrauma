import { useRef, useState, useEffect, useMemo } from 'react'
import useHeadImageStore from '../store/image_store.ts'
import useLanguageStore from '../store/language_store.ts'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { LanguageType, CharacterType } from '../types/data.ts'
import Icon from '@mui/material/Icon'
import CancelIcon from '../assets/icon/cancel.svg'
import LaunchIcon from '../assets/icon/launch.svg'
import SecretaryBody from '../assets/img/body.svg'
import Meowscarada from '../assets/img/meowscarada.svg'
import NecoArc from '../assets/img/neco_arc.svg'
import Lopunny from '../assets/img/lopunny.svg'
import Vaporeon from '../assets/img/vaporeon.svg'
import NecoArcIcon from '../assets/icon/neco_arc.svg'
import LopunnyIcon from '../assets/icon/lopunny.svg'
import MeowscaradaIcon from '../assets/icon/meowscarada.svg'
import VaporeonIcon from '../assets/icon/vaporeon.svg'
import '../css/CaptainCabin.css'

function LanguageSelect() {
    const language = useLanguageStore((state) => state.language)
    const setLanguage = useLanguageStore((state) => state.setLanguage)

    function handleChange(event: SelectChangeEvent) {
        setLanguage(event.target.value as LanguageType)
    }

    useEffect(() => {
        setLanguage('zh_cn')
    }, [setLanguage])

    return (
        <div className='language_select'>
            <Select
                value={language}
                onChange={handleChange}
            >
                <MenuItem value={'en'}>English</MenuItem>
                <MenuItem value={'zh_cn'}>中文</MenuItem>
                <MenuItem value={'ru'}>Русский</MenuItem>
            </Select>
        </div>
    )
}

function DialogueBubble() {
    const bubbleRef = useRef<HTMLDivElement>(null)

    function handleClick() {
        if (!bubbleRef.current) return

        bubbleRef.current.classList.toggle('dialogue_bubble--collapsed')
    }

    return (
        <div className='dialogue_bubble' ref={bubbleRef}>
            <div className='dialogue_bubble__switch' onClick={handleClick}>
                <Icon>visibility</Icon>
                <Icon>forward</Icon>
                <Icon>visibility_off</Icon>
            </div>
            <div className='dialogue_bubble__content'>
                <span>喵。123，哈哈</span>
            </div>
        </div>
    )
}

function Secretary() {
    const headImage = useHeadImageStore((state) => state.headImage)

    return (
        <div className='secretary' style={{ opacity: 1 }}>
            <div className='secretary__head'>
                <img src={headImage} alt="head" />
            </div>
            <div className='secretary__body'>
                <img src={SecretaryBody} alt="body" />
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

function SecretaryList() {
    interface SecretaryListItem {
        icon: string
        name: CharacterType
        headImage: string
    }

    const setHeadImage = useHeadImageStore((state) => state.setHeadImage)
    const secretaryList = useMemo<SecretaryListItem[]>(() => [
        {
            icon: NecoArcIcon,
            name: 'neco_arc',
            headImage: NecoArc
        }, {
            icon: VaporeonIcon,
            name: 'vaporeon',
            headImage: Vaporeon
        }, {
            icon: LopunnyIcon,
            name: 'lopunny',
            headImage: Lopunny
        }, {
            icon: MeowscaradaIcon,
            name: 'meowscarada',
            headImage: Meowscarada
        }
    ], [])

    useEffect(() => {
        setHeadImage(secretaryList[0].name, secretaryList[0].headImage)
    }, [setHeadImage, secretaryList])

    return (
        <div className='secretary_list'>
            {secretaryList.map((item, index) => (
                <div className='secretary_list__item' onClick={() => setHeadImage(item.name, item.headImage)} key={index}>
                    <img src={item.icon} alt={item.name} />
                </div>
            ))}
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

function LaunchCancelBtn({ text }: { text: string }) {

    return (
        <div className='launch_cancel_btn launch_btn'>
            <div className='launch_btn__circle'>
                <div>
                    <img src={CancelIcon} alt="cancel" />
                </div>
            </div>
            <div className='console_label'>{text}</div>
        </div>
    )
}

function SelectedRegionCnt({ text }: { text: string }) {
    return (
        <div className='selected_region_cnt'>
            <div className='selected_region_cnt__value'>0</div>
            <div className='console_label'>{text}</div>
        </div>
    )
}

function LaunchConfirmBtn({ text }: { text: string }) {
    return (
        <div className='launch_confirm_btn launch_btn'>
            <div className='launch_btn__circle'>
                <div>
                    <img src={LaunchIcon} alt="launch" />
                </div>
            </div>
            <div className='console_label'>{text}</div>
        </div>
    )
}

function CaptainConsole() {
    const language = useLanguageStore((state) => state.language)
    const uiTranslation = useLanguageStore((state) => state.uiTranslation)

    return (
        <div className='captain_console'>
            <LaunchCancelBtn text={uiTranslation['launch_cancel'][language]} />
            <SelectedRegionCnt text={uiTranslation['selected_region'][language]} />
            <LaunchConfirmBtn text={uiTranslation['launch_confirm'][language]} />
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
