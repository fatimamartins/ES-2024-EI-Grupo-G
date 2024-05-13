/**
 * @file
 * @module TimeOfDay
 * @description This file contains the `TimeOfDay` component.
 * @requires module:@mui/material
 * @requires module:react
 * @requires module:../constants
 */
import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { DAY_PERIODS } from '../constants'

/**
 * `TimeOfDay` is a React functional component that renders a form control for selecting a time of day.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.rules - An object representing the current rules.
 * @param {Function} props.setRules - A function to update the rules.
 *
 * @example
 * <TimeOfDay rules={currentRules} setRules={updateRules} />
 *
 * @returns {React.Element} The rendered form control.
 */
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
