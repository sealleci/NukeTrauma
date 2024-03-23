import WaveImage from '../assets/img/wave.svg'
import '../scss/SecretaryBackground.scss'

export default function SecretaryBackground() {
    return (
        <div className='secretary_bg'>
            <div className="porthole">
                {[...Array(8).keys()].map(
                    (num) =>
                        <div className='porthole__rivet' key={num}></div>
                )}
                <div className="sea_scene">
                    <img src={WaveImage} alt="wave" draggable={false} />
                </div>
            </div>
        </div>
    )
}
