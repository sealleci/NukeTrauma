import { useRef, useEffect, useCallback } from 'react'
import useCharacterStore from '../store/character_store.ts'
import useLanguageStore from '../store/language_store.ts'
import useRegionStore from '../store/region_store.ts'
import useDialogueStore from '../store/dialogue_store.ts'
import { shuffle } from '../utils/tool.ts'
import Icon from '@mui/material/Icon'
import type { LanguageType, CharacterType } from '../types/data.ts'
import '../scss/DialogueBubble.scss'

export default function DialogueBubble() {
    const bubbleRef = useRef<HTMLDivElement>(null)
    const dialogueData = useLanguageStore((state) => state.dialogue)
    const isFirstTime = useRef<boolean>(true)
    const prevCharacter = useDialogueStore((state) => state.prevCharacter)
    const prevRegion = useDialogueStore((state) => state.prevRegion)
    const prevSubNumeric = useDialogueStore((state) => state.prevSubNumeric)
    const prevLanguage = useDialogueStore((state) => state.prevLanguage)
    const curSentence = useDialogueStore((state) => state.curSentence)
    const setPrevCharacter = useDialogueStore((state) => state.setPrevCharacter)
    const setPrevRegion = useDialogueStore((state) => state.setPrevRegion)
    const setPrevSubNumeric = useDialogueStore((state) => state.setPrevSubNumeric)
    const setPrevLanguage = useDialogueStore((state) => state.setPrevLanguage)
    const setCurSentence = useDialogueStore((state) => state.setCurSentence)
    const character = useCharacterStore((state) => state.type)
    const finalRegionList = useRegionStore((state) => state.finalRegionList)
    const language = useLanguageStore((state) => state.language)
    const clearFinalRegionList = useRegionStore((state) => state.clearFinalRegionList)
    // const isSmallScreen = useWidthStore((state) => state.isSmallScreen)

    function handleClick() {
        if (!bubbleRef.current) { return }

        bubbleRef.current.classList.toggle('dialogue_bubble--invisible')
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

        setPrevRegion(selectedRegion)
        setPrevSubNumeric(curSubNumeric)

        return curSubNumericDialogue[_language]
    }, [dialogueData, setPrevRegion, setPrevSubNumeric])

    useEffect(() => {
        if (!isFirstTime.current || !dialogueData) {
            return
        }

        setCurSentence(getSentence(prevCharacter, [prevRegion], prevSubNumeric, prevLanguage))
        isFirstTime.current = false
    }, [dialogueData, prevCharacter, prevRegion, prevSubNumeric, prevLanguage, setCurSentence, getSentence])

    useEffect(() => {
        if (character === prevCharacter) { return }

        setCurSentence(getSentence(character, ['greeting'], '', prevLanguage))
        setPrevCharacter(character)
    }, [character, prevCharacter, prevLanguage, setCurSentence, getSentence, setPrevCharacter])

    useEffect(() => {
        if (finalRegionList.length <= 0) { return }

        setCurSentence(getSentence(prevCharacter, finalRegionList, '', prevLanguage))
        clearFinalRegionList()
    }, [finalRegionList, prevCharacter, prevLanguage, setCurSentence, getSentence, clearFinalRegionList])

    useEffect(() => {
        if (language === prevLanguage) { return }

        setCurSentence(getSentence(prevCharacter, [prevRegion], prevSubNumeric, language))
        setPrevLanguage(language)
    }, [language, prevCharacter, prevRegion, prevSubNumeric, prevLanguage, setCurSentence, getSentence, setPrevLanguage])

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
