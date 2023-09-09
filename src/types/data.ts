const availableLanguageList = ['zh_cn', 'en', 'ru'] as const
const availableCharacterList = ['neco_arc', 'meowscarada', 'vaporeon', 'lopunny'] as const
const availableRegionList = ['general', 'US'] as const

type LanguageType = typeof availableLanguageList[number]
type CharacterType = typeof availableCharacterList[number]
type RegionType = typeof availableRegionList[number]
type DialogueType = Record<CharacterType, Record<RegionType, Record<string, Record<LanguageType, string>>>>
type UiTranslationType = Record<string, Record<LanguageType, string>>

export { availableLanguageList, availableCharacterList, availableRegionList }
export type { LanguageType, CharacterType, RegionType, DialogueType, UiTranslationType }
