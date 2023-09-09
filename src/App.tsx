import { useEffect } from 'react'
import CaptainCabin from './components/CaptainCabin.tsx'
import WorldMap from './components/WorldMap.tsx'
import useLanguageStore from './store/language_store.ts'
import uiTranslation from './assets/lang/ui.json'

export default function App() {
  const setUiTranslation = useLanguageStore((state) => state.setTranslation)

  useEffect(() => {
    setUiTranslation(uiTranslation)
  }, [setUiTranslation])

  return (
    <>
      <CaptainCabin />
      <WorldMap />
    </>
  )
}
