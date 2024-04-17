import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { COURSE_START_TIMES } from '../constants'

const BeginningOfLesson = ({ rules, setRules }) => {
    return (
        <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="simple-select-label1">Início aula</InputLabel>
            <Select
                labelId="simple-select-label1"
                id="simple-select1"
                value={rules?.['Hora início da aula'] || ''}
                label="Início aula"
                onChange={(e) => {
                    setRules({ ...rules, 'Hora início da aula': e.target.value })
                }}
            >
                {COURSE_START_TIMES.map((period, index) => (
                    <MenuItem key={index} value={period}>
                        {period}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default BeginningOfLesson
