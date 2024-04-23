import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'

const Shift = ({ options, rules, setRules }) => {
    return (
        <FormControl sx={{ minWidth: 180, marginLeft: 2 }}>
            <InputLabel id="labelTurno">Turno</InputLabel>
            <Select
                labelId="labelTurno"
                required
                id="selectTurno"
                value={rules?.turno || ''}
                label="Turno"
                onChange={(e) => {
                    setRules({ ...rules, turno: e.target.value })
                }}
            >
                {options.map((shift, index) => (
                    <MenuItem key={index} value={shift} name={shift}>
                        {shift}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default Shift
