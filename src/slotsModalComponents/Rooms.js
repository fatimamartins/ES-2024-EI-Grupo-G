/**
 * `Rooms` is a React functional component that renders a form control for selecting rooms.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.rules - An object representing the current rules.
 * @param {Function} props.setRules - A function to update the rules.
 * @param {number} props.left - The left margin of the form control.
 *
 * @example
 * <Rooms rules={currentRules} setRules={updateRules} left={2} />
 *
 * @returns {React.Element} The rendered form control.
 */
import React from 'react'
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, Tooltip } from '@mui/material'
import { ROOMS } from '../constants'

/** @constant {number} ITEM_HEIGHT - The height of each item in the select menu. */
const ITEM_HEIGHT = 48
/** @constant {number} ITEM_PADDING_TOP - The padding at the top of each item in the select menu. */
const ITEM_PADDING_TOP = 8
/** @constant {object} MenuProps - The properties for the select menu. */
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 50,
        },
    },
}
const Rooms = ({ rules, setRules, left }) => {
    return (
        <FormControl sx={{ width: 375, marginLeft: left }}>
            <InputLabel id="multiple-checkbox-label1">Salas</InputLabel>
            <Tooltip
                title={
                    rules?.caracteristicas?.length > 0
                        ? 'Pode filtrar por salas apenas se não tiver selecionado características.'
                        : ''
                }
            >
                <Select
                    labelId="multiple-checkbox-label1"
                    id="multiple-checkbox1"
                    multiple
                    value={rules?.salas || []}
                    onChange={(e) => {
                        setRules({ ...rules, salas: e.target.value })
                    }}
                    label="Salas"
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                    disabled={rules?.caracteristicas ? rules?.caracteristicas?.length > 0 : false}
                >
                    {ROOMS.map((room, index) => (
                        <MenuItem key={index} value={room}>
                            <Checkbox checked={rules?.salas?.indexOf(room) > -1} />
                            <ListItemText primary={room} />
                        </MenuItem>
                    ))}
                </Select>
            </Tooltip>
        </FormControl>
    )
}

export default Rooms
