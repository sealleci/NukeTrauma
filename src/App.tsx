import { useState, useEffect, StrictMode, useCallback } from 'react'
import CaptainCabin from './components/CaptainCabin.tsx'
import CaptainCabinMobile from './components/CaptainCabinMobile.tsx'
import WorldMap from './components/WorldMap.tsx'
import useLanguageStore from './store/language_store.ts'
import useWidthStore from './store/width_stroe.ts'
import uiTranslation from './assets/lang/ui.json'
import dialogue from './assets/lang/dialogue.json'
import CancelIcon from './assets/icon/cancel.svg'
import LaunchIcon from './assets/icon/launch.svg'
import DeathIcon from './assets/icon/death.svg'
import CloudImage from './assets/img/cloud.svg'
import SecretaryBody from './assets/img/body.svg'
import MeowscaradaImage from './assets/img/meowscarada.svg'
import NecoArcImage from './assets/img/neco_arc.svg'
import LopunnyImage from './assets/img/lopunny.svg'
import VaporeonImage from './assets/img/vaporeon.svg'
import NecoArcIcon from './assets/icon/neco_arc.svg'
import LopunnyIcon from './assets/icon/lopunny.svg'
import MeowscaradaIcon from './assets/icon/meowscarada.svg'
import VaporeonIcon from './assets/icon/vaporeon.svg'

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const setUiTranslation = useLanguageStore((state) => state.setUiTranslation)
  const setDialogue = useLanguageStore((state) => state.setDialogue)
  const isSmallScreen = useWidthStore((state) => state.isSmallScreen)
  const setIsSmallScreen = useWidthStore((state) => state.setIsSmallScreen)

  const preloadImages = useCallback(async (imageFileList: string[]): Promise<void> => {
    const promises = imageFileList.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image()

        img.src = src
        img.onload = resolve
        img.onerror = reject
      })
    })

    await Promise.all(promises)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) { return }

    setUiTranslation(uiTranslation)
    setDialogue(dialogue)
    setLanguage('zh_cn')
    preloadImages([
      CancelIcon,
      LaunchIcon,
      DeathIcon,
      CloudImage,
      SecretaryBody,
      NecoArcImage,
      LopunnyImage,
      MeowscaradaImage,
      VaporeonImage,
      NecoArcIcon,
      LopunnyIcon,
      MeowscaradaIcon,
      VaporeonIcon
    ]).catch(console.error)
  }, [isLoading, setLanguage, setUiTranslation, setDialogue, preloadImages])

  useEffect(() => {
    const SMALL_SCREEN_THRESHOLD: number = 640

    setIsSmallScreen(document.body.clientWidth <= SMALL_SCREEN_THRESHOLD)
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)

    window.addEventListener('resize', () => {
      setIsSmallScreen(document.body.clientWidth <= SMALL_SCREEN_THRESHOLD)
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    })
  }, [setIsSmallScreen])

  if (isLoading) {
    return (
      <div className="loading_spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    )
  }

  return (
    <StrictMode>
      {!isSmallScreen && <CaptainCabin />}
      <WorldMap />
      {isSmallScreen && <CaptainCabinMobile />}
    </StrictMode>
  )
}
