import { } from 'react'
import useCharacterStore from '../store/character_store.ts'
import useRegionStore from '../store/region_store.ts'
import SecretaryList from "./SecretaryList"
import DialogueBubble from "./DialogueBubble"
import { LaunchCancelBtn, LaunchConfirmBtn } from "./CaptainConsoleButton"
import '../css/CaptainCabinMobile.css'

function CaptainConsoleMobile({ regionListLength }: { regionListLength: number }) {
    return (
        <>
            <div className={regionListLength > 0 ? 'console_wrapper console_wrapper__l' : 'console_wrapper console_wrapper__l console_wrapper--invisible'}>
                <LaunchCancelBtn isWithLabel={false} />
            </div >
            <div className={regionListLength > 0 ? 'console_wrapper console_wrapper__r' : 'console_wrapper console_wrapper__r console_wrapper--invisible'}>
                <LaunchConfirmBtn isWithLabel={false} />
            </div >
        </>
    )
}

function SecretarySceneMobile() {
    const headImage = useCharacterStore((state) => state.headImage)

    return (
        <div className='secretary_scene--mobile'>
            <div className="secretary__head--mobile">
                <img src={headImage} alt='head' />
            </div>
            <DialogueBubble />
        </div>
    )
}

export default function CaptainCabinMobile() {
    const regionList = useRegionStore((state) => state.regionList)

    return (
        <div className='captain_cabin--mobile'>
            <CaptainConsoleMobile regionListLength={regionList.length} />
            <SecretarySceneMobile />
            <SecretaryList />
        </div>
    )
}
