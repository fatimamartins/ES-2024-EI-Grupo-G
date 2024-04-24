/**
 * `RoomFeatures` is a React functional component that renders a form control for selecting room features.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.rules - An object representing the current rules.
 * @param {Function} props.setRules - A function to update the rules.
 *
 * @example
 * <RoomFeatures rules={currentRules} setRules={updateRules} />
 *
 * @returns {React.Element} The rendered form control.
 */

import React from 'react'
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, Tooltip } from '@mui/material'
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
            <Tooltip
                title={
                    rules?.salas?.length > 0
                        ? 'Pode filtrar por características apenas se não tiver selecionado salas.'
                        : ''
                }
            >
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
                    disabled={rules?.salas ? rules?.salas?.length > 0 : false}
                >
                    {ROOM_FEATURES.map((feature) => (
                        <MenuItem key={feature} value={feature}>
                            <Checkbox checked={rules?.caracteristicas?.indexOf(feature) > -1} />
                            <ListItemText primary={feature} />
                        </MenuItem>
                    ))}
                </Select>
            </Tooltip>
        </FormControl>
    )
}

export default RoomFeatures
