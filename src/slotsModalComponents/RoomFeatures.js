import React from 'react'
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { ROOM_FEATURES } from '../constants'

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

const RoomFeatures = ({ rules, setRules }) => {
    return (
        <FormControl sx={{ width: 375, marginLeft: 2 }}>
            <InputLabel id="multiple-checkbox-label3">Características</InputLabel>
            <Select
                labelId="multiple-checkbox-label3"
                id="multiple-checkbox3"
                multiple
                value={rules?.caracteristicas || []}
                onChange={(e) => {
                    setRules({ ...rules, caracteristicas: e.target.value })
                }}
                label="Características"
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
            >
                {ROOM_FEATURES.map((feature) => (
                    <MenuItem key={feature} value={feature}>
                        <Checkbox checked={rules?.caracteristicas?.indexOf(feature) > -1} />
                        <ListItemText primary={feature} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default RoomFeatures
