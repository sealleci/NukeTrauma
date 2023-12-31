const availableLanguageList = ['zh_cn', 'en', 'ru'] as const
const availableCharacterList = ['neco_arc', 'meowscarada', 'vaporeon', 'lopunny'] as const
type LanguageType = typeof availableLanguageList[number]
type CharacterType = typeof availableCharacterList[number]
type DialogueType = Record<CharacterType, Record<string, Record<string, Record<LanguageType, string>>>>
type UiTranslationType = Record<string, Record<LanguageType, string>>

export { availableLanguageList, availableCharacterList }
export type { LanguageType, CharacterType, DialogueType, UiTranslationType }
