import { useEffect, useMemo, useCallback, useRef } from 'react'
import useCharacterStore from '../store/character_store.ts'
import useDialogueStore from '../store/dialogue_store.ts'
import type { CharacterType } from '../types/data.ts'
import Meowscarada from '../assets/img/meowscarada.svg'
import NecoArc from '../assets/img/neco_arc.svg'
import Lopunny from '../assets/img/lopunny.svg'
import Vaporeon from '../assets/img/vaporeon.svg'
import NecoArcIcon from '../assets/icon/neco_arc.svg'
import LopunnyIcon from '../assets/icon/lopunny.svg'
import MeowscaradaIcon from '../assets/icon/meowscarada.svg'
import VaporeonIcon from '../assets/icon/vaporeon.svg'
import '../css/SecretaryList.css'

export default function SecretaryList() {
    interface SecretaryListItem {
        icon: string
        name: CharacterType
        headImage: string
    }

    const isFirstTime = useRef<boolean>(true)
    const setCharacter = useCharacterStore((state) => state.setCharacter)
    const prevCharacter = useDialogueStore((state) => state.prevCharacter)
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

    const getImageByName = useCallback((name: CharacterType) => {
        return secretaryList.find((item) => item.name === name)?.headImage
    }, [secretaryList])

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
    }, [secretaryList, prevCharacter, setCharacter, getImageByName])

    return (
        <div className='secretary_list'>
            {secretaryList.map((item, index) => (
                <div className='secretary_list__item' onClick={() => setCharacter(item.name, item.headImage)} key={index}>
                    <img src={item.icon} alt={item.name} />
                </div>
            ))}
        </div>
    )
}
