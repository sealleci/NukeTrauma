import { useEffect, StrictMode } from 'react'
import CaptainCabin from './components/CaptainCabin.tsx'
import WorldMap from './components/WorldMap.tsx'
import useLanguageStore from './store/language_store.ts'
import uiTranslation from './assets/lang/ui.json'
import dialogue from './assets/lang/dialogue.json'

export default function App() {
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const setUiTranslation = useLanguageStore((state) => state.setUiTranslation)
  const setDialogue = useLanguageStore((state) => state.setDialogue)

  useEffect(() => {
    setUiTranslation(uiTranslation)
    setDialogue(dialogue)
    setLanguage('zh_cn')
  }, [setLanguage, setUiTranslation, setDialogue])

  return (
    <StrictMode>
      <CaptainCabin />
      <WorldMap />
    </StrictMode>
  )
}
