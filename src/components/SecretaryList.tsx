import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import useCharacterStore from '../store/character_store.ts'
import useDialogueStore from '../store/dialogue_store.ts'
import type { CharacterType } from '../types/data.ts'
import MeowscaradaImage from '../assets/img/meowscarada.svg'
import NecoArcImage from '../assets/img/neco_arc.svg'
import LopunnyImage from '../assets/img/lopunny.svg'
import VaporeonImage from '../assets/img/vaporeon.svg'
import NecoArcIcon from '../assets/icon/neco_arc.svg'
import LopunnyIcon from '../assets/icon/lopunny.svg'
import MeowscaradaIcon from '../assets/icon/meowscarada.svg'
import VaporeonIcon from '../assets/icon/vaporeon.svg'
import '../scss/SecretaryList.scss'

interface SecretaryListItem {
    icon: string
    name: CharacterType
    headImage: string
}

interface SecretaryListHandle {
    getHeight: () => number
}

const secretaryList: SecretaryListItem[] = [
    {
        icon: NecoArcIcon,
        name: 'neco_arc',
        headImage: NecoArcImage
    }, {
        icon: VaporeonIcon,
        name: 'vaporeon',
        headImage: VaporeonImage
    }, {
        icon: LopunnyIcon,
        name: 'lopunny',
        headImage: LopunnyImage
    }, {
        icon: MeowscaradaIcon,
        name: 'meowscarada',
        headImage: MeowscaradaImage
    }
]

const SecretaryList = memo(forwardRef((_, ref) => {
    const isFirstTime = useRef<boolean>(true)
    const secretaryListRef = useRef<HTMLDivElement>(null)
    const setCharacter = useCharacterStore((state) => state.setCharacter)
    const prevCharacter = useDialogueStore((state) => state.prevCharacter)

    const getImageByName = useCallback((name: CharacterType) => {
        return secretaryList.find((item) => item.name === name)?.headImage
    }, [])

    useImperativeHandle(ref, (): SecretaryListHandle => {
        return {
            getHeight(): number {
                if (!secretaryListRef.current) { return 0 }
                return secretaryListRef.current.offsetHeight
            }
        }
    }, [])

    useEffect(() => {
        if (!isFirstTime.current) {
            return
        }

        const curHeadImage = getImageByName(prevCharacter)

        if (!curHeadImage) {
            setCharacter(secretaryList[0].name, secretaryList[0].headImage)
        } else {
            setCharacter(prevCharacter, curHeadImage)
        }

        isFirstTime.current = false
    }, [prevCharacter, setCharacter, getImageByName])

    return (
        <div className='secretary_list' ref={secretaryListRef}>
            {secretaryList.map((item, index) => (
                <div className='secretary_list__item' onClick={() => setCharacter(item.name, item.headImage)} key={index}>
                    <img src={item.icon} alt={item.name} />
                </div>
            ))}
        </div>
    )
}))

export type { SecretaryListHandle }
export default SecretaryList
