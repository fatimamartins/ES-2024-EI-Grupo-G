import React from 'react'
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
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
            >
                {ROOMS.map((room, index) => (
                    <MenuItem key={index} value={room}>
                        <Checkbox checked={rules?.salas?.indexOf(room) > -1} />
                        <ListItemText primary={room} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default Rooms
