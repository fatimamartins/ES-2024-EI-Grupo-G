import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { WEEKDAYS } from '../constants'

const WeekDay = ({ rules, setRules }) => {
    return (
        <FormControl sx={{ minWidth: 180, marginLeft: 2 }}>
            <InputLabel id="simple-select-label3">Dia da semana</InputLabel>
            <Select
                labelId="simple-select-label3"
                id="simple-select3"
                value={rules?.diaDaSemana || ''}
                label="Dia da semana"
                onChange={(e) => {
                    setRules({ ...rules, diaDaSemana: e.target.value })
                }}
            >
                {WEEKDAYS.map((day, index) => (
                    <MenuItem key={index} value={day}>
                        {day}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default WeekDay
