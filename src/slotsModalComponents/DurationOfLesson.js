/**
 * `DurationOfLesson` is a React functional component that renders a form control for selecting the duration of a course.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.rules - An object representing the current rules.
 * @param {Function} props.setRules - A function to update the rules.
 *
 * @example
 * <DurationOfLesson rules={currentRules} setRules={updateRules} />
 *
 * @returns {React.Element} The rendered form control.
 */

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { COURSE_DURATION } from '../constants'

const DurationOfLesson = ({ rules, setRules }) => {
    return (
        <FormControl sx={{ minWidth: 180, marginLeft: 2 }}>
            <InputLabel id="label4">Duração</InputLabel>
            <Select
                labelId="label4"
                required
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
