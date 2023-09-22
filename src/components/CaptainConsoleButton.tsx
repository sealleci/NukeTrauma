import useLaunchStore from '../store/launch_store.ts'
import useRegionStore from '../store/region_store.ts'
import ConsoleLabel from './ConsoleLabel.tsx'
import CancelIcon from '../assets/icon/cancel.svg'
import LaunchIcon from '../assets/icon/launch.svg'
import '../css/CaptainConsoleButton.css'

function LaunchCancelBtn({ isWithLabel, text = '' }: { isWithLabel: boolean, text?: string }) {
    const setCancelSignal = useLaunchStore((state) => state.setCancelSignal)

    function handleClick() {
        setCancelSignal(true)
    }

    return (
        <div className='launch_cancel_btn launch_btn' onClick={handleClick}>
            <div className='launch_btn__circle'>
                <div>
                    <img src={CancelIcon} alt='cancel' />
                </div>
            </div>
            {isWithLabel && <ConsoleLabel text={text} />}
        </div>
    )
}

function LaunchConfirmBtn({ isWithLabel, text = '' }: { isWithLabel: boolean, text?: string }) {
    const setLaunchSignal = useLaunchStore((state) => state.setLaunchSignal)
    const regionList = useRegionStore((state) => state.regionList)
    const updateFinalRegionList = useRegionStore((state) => state.updateFinalRegionList)

    function handleClick() {
        updateFinalRegionList()

        if (regionList.length === 0) { return }

        setLaunchSignal(true)
    }

    return (
        <div className='launch_confirm_btn launch_btn' onClick={handleClick}>
            <div className='launch_btn__circle'>
                <div>
                    <img src={LaunchIcon} alt='launch' />
                </div>
            </div>
            {isWithLabel && <ConsoleLabel text={text} />}
        </div>
    )
}

export { LaunchCancelBtn, LaunchConfirmBtn }
