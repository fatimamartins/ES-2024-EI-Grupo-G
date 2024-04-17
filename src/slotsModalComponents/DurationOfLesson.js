import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { COURSE_DURATION } from '../constants'

const DurationOfLesson = ({ rules, setRules }) => {
    return (
        <FormControl sx={{ minWidth: 180, marginLeft: 2 }}>
            <InputLabel id="label4">Duração</InputLabel>
            <Select
                labelId="label4"
                id="select4"
                value={rules?.duracao || ''}
                label="Duração"
                onChange={(e) => {
                    setRules({ ...rules, duracao: parseInt(e.target.value) })
                }}
            >
                {COURSE_DURATION.map((time, index) => (
                    <MenuItem key={index} value={time.value} name={time.key}>
                        {time.key}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default DurationOfLesson
