import { useRef, useState, useEffect, useCallback } from 'react'
import useLanguageStore from './store/language_store.ts'
import useWidthStore from './store/width_stroe.ts'
import CaptainCabin from './components/CaptainCabin'
import CaptainCabinMobile from './components/CaptainCabinMobile'
import WorldMap from './components/WorldMap'
import type { WorldMapHandle } from './components/WorldMap'
import LoadingSpinner from './components/LoadingSpinner'
import type { CaptainCabinMobileHandle } from './components/CaptainCabinMobile'
import dialogue from './assets/lang/dialogue.json'
import uiTranslation from './assets/lang/ui.json'
import CancelIcon from './assets/icon/cancel.svg'
import DeathIcon from './assets/icon/death.svg'
import LaunchIcon from './assets/icon/launch.svg'
import LopunnyIcon from './assets/icon/lopunny.svg'
import LopunnyImage from './assets/img/lopunny.svg'
import MushroomHeadImage from './assets/img/mushroom_head.png'
import MushroomRootImage from './assets/img/mushroom_root.png'
import MeowscaradaIcon from './assets/icon/meowscarada.svg'
import MeowscaradaImage from './assets/img/meowscarada.svg'
import NecoArcIcon from './assets/icon/neco_arc.svg'
import NecoArcImage from './assets/img/neco_arc.svg'
import SecretaryBody from './assets/img/body.svg'
import VaporeonIcon from './assets/icon/vaporeon.svg'
import VaporeonImage from './assets/img/vaporeon.svg'
import WaveImage from './assets/img/wave.svg'

export default function App() {
  const SMALL_SCREEN_THRESHOLD: number = 640
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const setUiTranslation = useLanguageStore((state) => state.setUiTranslation)
  const setDialogue = useLanguageStore((state) => state.setDialogue)
  const isSmallScreen = useWidthStore((state) => state.isSmallScreen)
  const setWorldMapWidth = useWidthStore((state) => state.setWorldMapWidth)
  const setIsSmallScreen = useWidthStore((state) => state.setIsSmallScreen)
  const captainCabinMobileRef = useRef<CaptainCabinMobileHandle>(null)
  const worldMapRef = useRef<WorldMapHandle>(null)

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

  const resizeCb = useCallback(() => {
    setIsSmallScreen(document.body.clientWidth <= SMALL_SCREEN_THRESHOLD)
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    setWorldMapWidth(worldMapRef.current?.getWidth() ?? window.innerWidth)
  }, [setIsSmallScreen, setWorldMapWidth])
  const mouseUpCb = useCallback(() => {
    captainCabinMobileRef.current?.onMouseUp()
  }, [])
  const mouseMoveCb = useCallback(function (this: Window, event: globalThis.MouseEvent) {
    captainCabinMobileRef.current?.onMouseMove(event.clientY)
  }, [])

  useEffect(() => {
    if (!isLoading) { return }

    setUiTranslation(uiTranslation)
    setDialogue(dialogue)
    setLanguage('zh_cn')
    preloadImages([
      CancelIcon,
      DeathIcon,
      LaunchIcon,
      LopunnyIcon,
      LopunnyImage,
      MushroomHeadImage,
      MushroomRootImage,
      MeowscaradaIcon,
      MeowscaradaImage,
      NecoArcIcon,
      NecoArcImage,
      SecretaryBody,
      VaporeonIcon,
      VaporeonImage,
      WaveImage
    ]).catch(console.error)
  }, [isLoading, setLanguage, setUiTranslation, setDialogue, preloadImages])

  useEffect(() => {
    resizeCb()
    window.addEventListener('resize', resizeCb)
    window.addEventListener('mouseup', mouseUpCb)
    window.addEventListener('mousemove', mouseMoveCb)

    return () => {
      window.removeEventListener('resize', resizeCb)
      window.removeEventListener('mouseup', mouseUpCb)
      window.removeEventListener('mousemove', mouseMoveCb)
    }
  }, [setIsSmallScreen, resizeCb, mouseUpCb, mouseMoveCb])

  if (isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    <>
      {!isSmallScreen && <CaptainCabin />}
      <WorldMap ref={worldMapRef} />
      {isSmallScreen && <CaptainCabinMobile ref={captainCabinMobileRef} />}
    </>
  )
}
