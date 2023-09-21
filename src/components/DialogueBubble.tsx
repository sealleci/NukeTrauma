import { useRef, useState, useEffect, useCallback } from 'react'
import useCharacterStore from '../store/character_store.ts'
import useLanguageStore from '../store/language_store.ts'
import useRegionStore from '../store/region_store.ts'
import useWidthStore from '../store/width_stroe.ts'
import { shuffle } from '../utils/tool.ts'
import Icon from '@mui/material/Icon'
import type { LanguageType, CharacterType } from '../types/data.ts'
import '../css/DialogueBubble.css'

export default function DialogueBubble() {
    const bubbleRef = useRef<HTMLDivElement>(null)
    const dialogueData = useLanguageStore((state) => state.dialogue)
    // const [prevCharacter, setPrevCharacter] = useState<CharacterType>('neco_arc')
    // const [prevRegion, setPrevRegion] = useState<string>('greeting')
    // const [prevSubNumeric, setPrevSubNumeric] = useState<string>('')
    // const [prevLanguage, setPrevLanguage] = useState<LanguageType>('zh_cn')
    const [curSentence, setCurSentence] = useState<string>('')
    const prevCharacter = useRef<CharacterType>('neco_arc')
    const prevRegion = useRef<string>('greeting')
    const prevSubNumeric = useRef<string>('')
    const prevLanguage = useRef<LanguageType>('zh_cn')
    const character = useCharacterStore((state) => state.type)
    const finalRegionList = useRegionStore((state) => state.finalRegionList)
    const language = useLanguageStore((state) => state.language)
    const clearFinalRegionList = useRegionStore((state) => state.clearFinalRegionList)
    const isSmallScreen = useWidthStore((state) => state.isSmallScreen)

    function handleClick() {
        if (!bubbleRef.current) { return }

        bubbleRef.current.classList.toggle('dialogue_bubble--invisible')
    }

    function showBubble() {
        if (!bubbleRef.current) { return }

        bubbleRef.current.classList.remove('dialogue_bubble--invisible')
    }

    const getSentence = useCallback((_character: CharacterType, _regionList: string[], _subNumeric: string, _language: LanguageType): string => {
        if (!dialogueData) return ''

        const curCharacterDialogue = dialogueData[_character]
        if (!curCharacterDialogue) {
            return ''
        }

        let selectedRegion: string = ''

        while (_regionList.length > 0) {
            _regionList = shuffle(_regionList)
            if (curCharacterDialogue[_regionList[0]]) {
                selectedRegion = _regionList[0]
                break
            }
            _regionList.shift()
        }

        if (!curCharacterDialogue[selectedRegion]) {
            selectedRegion = 'general'
        }

        const curRegionDialogue = curCharacterDialogue[selectedRegion]
        let curSubNumeric = ''

        if (_subNumeric === '') {
            const subNumericList = shuffle(Object.keys(curRegionDialogue))
            if (subNumericList.length <= 0) {
                return ''
            }
            curSubNumeric = subNumericList[0]
        } else {
            curSubNumeric = _subNumeric
        }

        const curSubNumericDialogue = curRegionDialogue[curSubNumeric]

        if (!curSubNumericDialogue || !curSubNumericDialogue[_language]) {
            return ''
        }

        // setPrevRegion(selectedRegion)
        // setPrevSubNumeric(curSubNumeric)
        prevRegion.current = selectedRegion
        prevSubNumeric.current = curSubNumeric

        return curSubNumericDialogue[_language]
    }, [dialogueData])

    useEffect(() => {
        if (!dialogueData) return

        setCurSentence(() => dialogueData['neco_arc']['greeting']['0']['zh_cn'])
    }, [dialogueData])

    useEffect(() => {
        // if (character === prevCharacter.current) return

        // setCurSentence(() => getSentence(character, ['greeting'], '', prevLanguage))
        // setPrevCharacter(character)
        setCurSentence(() => getSentence(character, ['greeting'], '', prevLanguage.current))
        prevCharacter.current = character
    }, [character, getSentence])

    useEffect(() => {
        if (finalRegionList.length <= 0) return

        // setCurSentence(() => getSentence(prevCharacter, finalRegionList, '', prevLanguage))
        setCurSentence(() => getSentence(prevCharacter.current, finalRegionList, '', prevLanguage.current))
        clearFinalRegionList()
    }, [finalRegionList, getSentence, clearFinalRegionList])

    useEffect(() => {
        // if (language === prevLanguage) return

        // setCurSentence(() => getSentence(prevCharacter, [prevRegion], prevSubNumeric, language))
        // setPrevLanguage(language)
        setCurSentence(() => getSentence(prevCharacter.current, [prevRegion.current], prevSubNumeric.current, language))
        prevLanguage.current = language
    }, [language, getSentence])

    useEffect(() => {
        if (isSmallScreen) {
            showBubble()
        }
    }, [isSmallScreen])

    return (
        <div className='dialogue_bubble' ref={bubbleRef}>
            <div className='dialogue_bubble__switch' onClick={handleClick}>
                <Icon>visibility</Icon>
                <Icon>forward</Icon>
                <Icon>visibility_off</Icon>
            </div>
            <div className='dialogue_bubble__content'>
                <span>{curSentence}</span>
            </div>
        </div>
    )
}
