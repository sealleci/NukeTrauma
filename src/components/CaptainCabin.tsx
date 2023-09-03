import '../css/CaptainCabin.css'

function DialogueBubble() {
    return (
        <div className='dialogue_bubble'>
        </div>
    )
}

function SecretaryCharacter() {
    return (
        <div className='secretary_character'>
        </div>
    )
}

function SecretaryMain() {
    return (
        <div>
            <DialogueBubble />
            <SecretaryCharacter />
        </div>
    )
}

function SecretaryBackground() {
    return (
        <div>
        </div>
    )
}

function SecretaryDisplay() {
    return (
        <div>
            <SecretaryMain />
            <SecretaryBackground />
        </div>
    )
}

function SecretaryChangeBar() {
    return (
        <div>
        </div>
    )
}

function SecretaryScene() {
    return (
        <div>
            <SecretaryDisplay />
            <SecretaryChangeBar />
        </div>
    )
}

function LaunchCancelBtn() {
    return (
        <div>
        </div>
    )
}

function SelectedRegionsCountDisplay() {
    return (
        <div>
        </div>
    )
}

function LaunchConfirmBtn() {
    return (
        <div>
        </div>
    )
}

function CaptainConsole() {
    return (
        <div>
            <LaunchCancelBtn />
            <SelectedRegionsCountDisplay />
            <LaunchConfirmBtn />
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
