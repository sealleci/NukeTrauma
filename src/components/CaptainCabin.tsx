import { useRef, useState, useEffect, useMemo } from 'react'
import useCharacterStore from '../store/character_store.ts'
import useLanguageStore from '../store/language_store.ts'
import useLaunchStore from '../store/launch_store.ts'
import useCounterStore from '../store/counter_store.ts'
// import useRegionStore from '../store/region_store.ts'
import { shuffle, getRangeRandom } from '../utils/tool.ts'
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
import useRegionStore from '../store/region_store.ts'

function LanguageSelect() {
    const language = useLanguageStore((state) => state.language)
    const setLanguage = useLanguageStore((state) => state.setLanguage)

    function handleChange(event: SelectChangeEvent) {
        setLanguage(event.target.value as LanguageType)
    }

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
    // const [prevCharacter, setPrevCharacter] = useState<string>('')
    // const [prevRegion, setPrevRegion] = useState<string>('')
    // const [prevSubNumeric, setPrevNumeric] = useState<string>('')
    // const [curSentence, setCurSentence] = useState<string>('')
    // const dialogueData = useLanguageStore((state) => state.dialogue)
    // const character = useCharacterStore((state) => state.type)
    // const finalRegionList = useRegionStore((state) => state.finalRegionList)
    // const language = useLanguageStore((state) => state.language)
    // const setFinalRegionList = useRegionStore((state) => state.setFinalRegionList)


    function handleClick() {
        if (!bubbleRef.current) return

        bubbleRef.current.classList.toggle('dialogue_bubble--collapsed')
    }

    // function getSentence(characterName: string, region: string, subNumeric: string, language: string): string {
    //     if (!dialogueData) return ''

    //     const curCharacterDialogue = dialogueData[characterName]
    //     if (!curCharacterDialogue) return curSentence

    //     let selectedRegionList = Array.from(finalRegionList)
    //     let selectedRegion: string = ''

    //     while (selectedRegionList.length > 0) {
    //         selectedRegionList = shuffle(selectedRegionList)
    //         if (curCharacterDialogue[selectedRegionList[0]]) {
    //             selectedRegion = selectedRegionList[0]
    //             break
    //         }
    //         selectedRegionList.shift()
    //     }

    //     if (!curCharacterDialogue[selectedRegion]) return curSentence

    //     const curRegionDialogue = curCharacterDialogue[selectedRegion]
    //     const subNumericList = shuffle(Object.keys(curRegionDialogue))

    //     setPrevRegion(selectedRegion)
    //     if (subNumericList.length <= 0) return curSentence
    //     setPrevNumeric(subNumericList[0])

    //     const curSubNumericDialogue = curRegionDialogue[subNumericList[0]]

    //     if (!curSubNumericDialogue || !curSubNumericDialogue[language]) return curSentence
    //     // setCurSentence(curSubNumericDialogue[language])

    //     return curSubNumericDialogue[language]
    // }

    // useEffect(() => {
    //     setCurSentence(() => getSentence(character, prevRegion, prevSubNumeric, language))
    // }, [character])

    // useEffect(() => {
    //     setCurSentence(() => getSentence())
    // }, [finalRegionList])

    // useEffect(() => {
    //     setCurSentence(() => getSentence(prevCharacter, prevRegion, prevSubNumeric, language))
    // }, [language])

    return (
        <div className='dialogue_bubble' ref={bubbleRef}>
            <div className='dialogue_bubble__switch' onClick={handleClick}>
                <Icon>visibility</Icon>
                <Icon>forward</Icon>
                <Icon>visibility_off</Icon>
            </div>
            <div className='dialogue_bubble__content'>
                {/* <span>{curSentence}</span> */}
            </div>
        </div>
    )
}

function Secretary() {
    const headImage = useCharacterStore((state) => state.headImage)

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

    const setHeadImage = useCharacterStore((state) => state.setHeadImage)
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
    const setCancelSignal = useLaunchStore((state) => state.setCancelSignal)

    function handleClick() {
        setCancelSignal(true)
    }

    return (
        <div className='launch_cancel_btn launch_btn' onClick={handleClick}>
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
    const regionList = useRegionStore((state) => state.regionList)
    return (
        <div className='selected_region_cnt'>
            <div className='selected_region_cnt__value'>{regionList.length}</div>
            <div className='console_label'>{text}</div>
        </div>
    )
}

function getIncrement(regionList: string[]): number {
    let value = 0

    regionList.forEach((region) => {
        switch (region) {
            case 'Russia':
                value += getRangeRandom(0, 5000)
                break
            case 'Greenland':
                value += 0
                break
            case 'Venezuela':
                value += 666
                break
            default:
                value += getRangeRandom(1000, 50000)
                break
        }
    })

    return value
}

function LaunchConfirmBtn({ text }: { text: string }) {
    const setLaunchSignal = useLaunchStore((state) => state.setLaunchSignal)
    const regionList = useRegionStore((state) => state.regionList)
    const clearFinalRegionList = useRegionStore((state) => state.clearFinalRegionList)
    const increase = useCounterStore((state) => state.increase)

    function handleClick() {
        setLaunchSignal(true)
        increase(getIncrement(regionList))
        clearFinalRegionList()
    }

    return (
        <div className='launch_confirm_btn launch_btn' onClick={handleClick}>
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
            <LaunchCancelBtn text={!uiTranslation ? '' : uiTranslation['launch_cancel'][language]} />
            <SelectedRegionCnt text={!uiTranslation ? '' : uiTranslation['selected_region'][language]} />
            <LaunchConfirmBtn text={!uiTranslation ? '' : uiTranslation['launch_confirm'][language]} />
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
