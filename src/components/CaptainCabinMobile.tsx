import { } from 'react'
import useCharacterStore from '../store/character_store.ts'
import SecretaryList from "./SecretaryList"
import DialogueBubble from "./DialogueBubble"
import { LaunchCancelBtn, LaunchConfirmBtn } from "./CaptainConsoleButton"
import '../css/CaptainCabinMobile.css'

function CaptainConsoleMobile() {

    return (
        <div className='captain_console--mobile'>
            <LaunchCancelBtn isWithLabel={false} />
            <LaunchConfirmBtn isWithLabel={false} />
        </div>
    )
}

function SecretarySceneMobile() {
    const headImage = useCharacterStore((state) => state.headImage)

    return (
        <div className='secretary_scene--mobile'>
            <div className="secretary__head--mobile">
                <img src={headImage} alt='head' />
            </div>
            <DialogueBubble></DialogueBubble>
        </div>
    )
}

export default function CaptainCabinMobile() {
    return (
        <div className='captain_cabin--mobile'>
            <CaptainConsoleMobile></CaptainConsoleMobile>
            <SecretarySceneMobile></SecretarySceneMobile>
            <SecretaryList></SecretaryList>
        </div>
    )
}
