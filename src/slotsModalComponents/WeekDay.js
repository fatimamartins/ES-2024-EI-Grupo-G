/**
 * @file
 * @module WeekDay
 * @description This file contains the `WeekDay` component.
 * @requires module:@mui/material
 * @requires module:react
 * @requires module:../constants
 */
import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { WEEKDAYS } from '../constants'

/**
 * `WeekDay` is a React functional component that renders a form control for selecting a day of the week.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.rules - An object representing the current rules.
 * @param {Function} props.setRules - A function to update the rules.
 *
 * @example
 * <WeekDay rules={currentRules} setRules={updateRules} />
 *
 * @returns {React.Element} The rendered form control.
 */
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
