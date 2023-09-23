import { memo } from 'react'
import useLanguageStore from '../store/language_store.ts'
import MenuItem from '@mui/material/MenuItem'
import Icon from '@mui/material/Icon'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { LanguageType } from '../types/data.ts'
import '../css/LanguageSelect.css'

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