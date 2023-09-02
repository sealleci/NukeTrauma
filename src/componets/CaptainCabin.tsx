import '../css/CaptainCabin.css'

function DialogueBubble() {
    return <></>;
}

function SecretaryCharacter() {
    return <></>;
}

function SecretaryMain() {
    return (
        <>
            <DialogueBubble />
            <SecretaryCharacter />
        </>
    );
}

function SecretaryBackground() {
    return <></>;
}

function SecretaryDisplay() {
    return (
        <>
            <SecretaryMain />
            <SecretaryBackground />
        </>
    );
}

function SecretaryChangeBar() {
    return <></>;
}

function SecretaryScene() {
    return (
        <>
            <SecretaryDisplay />
            <SecretaryChangeBar />
        </>
    );
}

function LaunchCancelBtn() {
    return <></>;
}

function SelectedRegionsCountDisplay() {
    return <></>;
}

function LaunchConfirmBtn() {
    return <></>;
}

function CaptainConsole() {
    return (
        <>
            <LaunchCancelBtn />
            <SelectedRegionsCountDisplay />
            <LaunchConfirmBtn />
        </>
    );
}

export default function CaptainCabin() {
    return (
        <>
            <SecretaryScene />
            <CaptainConsole />
        </>
    );
}
