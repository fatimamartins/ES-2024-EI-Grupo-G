import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { DAY_PERIODS } from '../constants'

const TimeOfDay = ({ rules, setRules }) => {
    return (
        <FormControl sx={{ minWidth: 180, marginLeft: 2 }}>
            <InputLabel id="simple-select-label4">Período dia</InputLabel>
            <Select
                labelId="simple-select-label4"
                id="simple-select4"
                value={rules?.turno || ''}
                label="Período dia"
                onChange={(e) => {
                    setRules({ ...rules, turno: e.target.value })
                }}
            >
                {DAY_PERIODS.map((turno, index) => (
                    <MenuItem key={index} value={turno}>
                        {turno}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default TimeOfDay
