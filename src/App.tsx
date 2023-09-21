import { useEffect, StrictMode } from 'react'
import CaptainCabin from './components/CaptainCabin.tsx'
import CaptainCabinMobile from './components/CaptainCabinMobile.tsx'
import WorldMap from './components/WorldMap.tsx'
import useLanguageStore from './store/language_store.ts'
import useWidthStore from './store/width_stroe.ts'
import uiTranslation from './assets/lang/ui.json'
import dialogue from './assets/lang/dialogue.json'

export default function App() {
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const setUiTranslation = useLanguageStore((state) => state.setUiTranslation)
  const setDialogue = useLanguageStore((state) => state.setDialogue)
  const isSmallScreen = useWidthStore((state) => state.isSmallScreen)
  const setIsSmallScreen = useWidthStore((state) => state.setIsSmallScreen)

  useEffect(() => {
    setUiTranslation(uiTranslation)
    setDialogue(dialogue)
    setLanguage('zh_cn')
  }, [setLanguage, setUiTranslation, setDialogue])

  useEffect(() => {
    const SMALL_SCREEN_THRESHOLD: number = 640

    setIsSmallScreen(document.body.clientWidth <= SMALL_SCREEN_THRESHOLD)
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)

    window.addEventListener('resize', () => {
      setIsSmallScreen(document.body.clientWidth <= SMALL_SCREEN_THRESHOLD)
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    })
  }, [setIsSmallScreen])

  if (isSmallScreen) {
    return (
      <StrictMode>
        <WorldMap />
        <CaptainCabinMobile />
      </StrictMode>
    )
  }

  return (
    <StrictMode>
      <CaptainCabin />
      <WorldMap />
    </StrictMode>
  )
}
