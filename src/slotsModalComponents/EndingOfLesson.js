import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { COURSE_END_TIMES } from '../constants'

const EndingOfLesson = ({ rules, setRules }) => {
    return (
        <FormControl sx={{ minWidth: 180, marginLeft: 2 }}>
            <InputLabel id="simple-select-label2">Fim aula</InputLabel>
            <Select
                labelId="simple-select-label2"
                id="simple-select2"
                value={rules?.['Hora fim da aula'] || ''}
                label="Fim aula"
                onChange={(e) => {
                    setRules({ ...rules, 'Hora fim da aula': e.target.value })
                }}
            >
                {COURSE_END_TIMES.map((period, index) => (
                    <MenuItem key={index} value={period}>
                        {period}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default EndingOfLesson
