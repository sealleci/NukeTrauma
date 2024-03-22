import { memo } from 'react'
import Icon from '@mui/material/Icon'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import useLanguageStore from '../store/language_store.ts'
import type { LanguageType } from '../types/data.ts'
import '../scss/LanguageSelect.scss'

const LanguageSelect = memo(() => {
    const language = useLanguageStore((state) => state.language)
    const setLanguage = useLanguageStore((state) => state.setLanguage)

    function handleChange(event: SelectChangeEvent) {
        setLanguage(event.target.value as LanguageType)
    }

    return (
        <div className='language_select'>
            <Icon>translate</Icon>
            <Select
                value={language}
                onChange={handleChange}
            >
                <MenuItem value={'en'}>English</MenuItem>
                <MenuItem value={'zh_cn'}>中文</MenuItem>
                <MenuItem value={'ru'}>Русский</MenuItem>
            </Select>
        </div>
    )
})

export default LanguageSelect