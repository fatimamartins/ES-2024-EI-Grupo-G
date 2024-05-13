/**
 * @file
 * @module Shift
 * @description This file contains the `Shift` component.
 * @requires module:@mui/material
 * @requires module:react
 */

import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

/**
 * `Shift` is a React functional component that renders a form control for selecting a shift.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.options - An array of shift options.
 * @param {Object} props.rules - An object representing the current rules.
 * @param {Function} props.setRules - A function to update the rules.
 *
 * @example
 * <Shift options={shiftOptions} rules={currentRules} setRules={updateRules} />
 *
 * @returns {React.Element} The rendered form control.
 */
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
