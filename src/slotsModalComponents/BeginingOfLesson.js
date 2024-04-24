/**
 * `BeginningOfLesson` is a React functional component that renders a form control for selecting the start time of a course.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.rules - An object representing the current rules.
 * @param {Function} props.setRules - A function to update the rules.
 *
 * @example
 * <BeginningOfLesson rules={currentRules} setRules={updateRules} />
 *
 * @returns {React.Element} The rendered form control.
 */
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
