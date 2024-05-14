/**
 * @file
 * @module EndingOfLesson
 * @description This file contains the `EndingOfLesson` component.
 * @requires module:@mui/material
 * @requires module:react
 * @requires module:../constants
 */

import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { COURSE_END_TIMES } from '../constants'

/**
 * `EndingOfLesson` is a React functional component that renders a form control for selecting the end time of a course.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.rules - An object representing the current rules.
 * @param {Function} props.setRules - A function to update the rules.
 *
 * @example
 * <EndingOfLesson rules={currentRules} setRules={updateRules} />
 *
 * @returns {React.Element} The rendered form control.
 */
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
