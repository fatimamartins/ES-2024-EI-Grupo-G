/**
 * @file MultipleSelectCheckmarks.js
 * This is the MultipleSelectCheckmarks component of the application.
 */

/** @module react */
import React, { useState } from 'react'
/** @module @mui/material/Checkbox */
import Checkbox from '@mui/material/Checkbox'
/** @module @mui/material/MenuItem */
import MenuItem from '@mui/material/MenuItem'
/** @module @mui/material/FormControl */
import FormControl from '@mui/material/FormControl'
/** @module @mui/material/Select */
import Select from '@mui/material/Select'
/** @module @mui/material/InputLabel */
import InputLabel from '@mui/material/InputLabel'
/** @module @mui/material/ListItemText */
import ListItemText from '@mui/material/ListItemText'
/** @module @mui/material/Stack */
import { Stack } from '@mui/material'

/**
 * @constant {number} ITEM_HEIGHT
 * @description The height of each item in the select menu.
 */
const ITEM_HEIGHT = 48
/**
 * @constant {number} ITEM_PADDING_TOP
 * @description The padding at the top of each item in the select menu.
 */
const ITEM_PADDING_TOP = 8
/**
 * @constant {object} MenuProps
 * @description The properties for the select menu. It includes the style properties for the Paper component used in the menu.
 * The maxHeight is calculated based on the ITEM_HEIGHT and ITEM_PADDING_TOP constants, and the width is set to 50.
 */
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 50,
        },
    },
}

/**
 * @constant {string[]} colName
 * @description The names of the columns in the select menu. These names represent different aspects of a course schedule, such as the course name, the day of the week, the start and end time of the class, the date of the class, the characteristics of the requested room for the class, the room assigned to the class, the week of the year, and the week of the semester.
 */
const colName = [
    'Curso',
    'Unidade Curricular',
    'Turno',
    'Turma',
    'Inscritos no turno',
    'Dia da semana',
    'Hora início da aula',
    'Hora fim da aula',
    'Data da aula',
    'Características da sala pedida para a aula',
    'Sala atribuída à aula',
    'Semana do ano',
    'Semana do semestre',
]

/**
 * @description This is the MultipleSelectCheckmarks component of the application.
 * It manages the selection of multiple items with checkboxes.
 *
 * @function
 * @name MultipleSelectCheckmarks
 * @param {object} props - The properties passed to the component.
 * @param {React.MutableRefObject} props.tableRef - The reference to the table.
 * @param {boolean} props.disabled - The state of the component's interactivity.
 * @returns {JSX.Element} The rendered MultipleSelectCheckmarks component.
 */
export default function MultipleSelectCheckmarks({ tableRef, disabled }) {
    /**
     * @description The state and setter for the selectedColumns state variable.
     * The default value is all columns because all columns are visible by default.
     * @constant {Array} selectedColumns
     * @function setSelectedColumns
     */
    const [selectedColumns, setSelectedColumns] = useState(colName) // the default value is all columns because all columns are visible by default

    /**
     * @description Handles the change event of the select menu.
     * It checks if the selected columns have changed and toggles their visibility accordingly.
     * @function handleChange
     * @param {Event} event - The change event.
     */
    const handleChange = (event) => {
        const {
            target: { value },
        } = event
        colName.forEach((col) => {
            if (
                // if selectedColumns doesn't have the column it means it has not visible.
                // if the value has the column it means it should be visible now
                (value.includes(col) && !selectedColumns.includes(col)) ||
                // if selectedColumns has the column it means it has visible
                // if the value doesn't have the column it means it should be hidden now
                (!value.includes(col) && selectedColumns.includes(col))
            ) {
                return tableRef.current.toggleColumn(col)
            }
        })
        setSelectedColumns(value)
    }

    return (
        <Stack direction={'row'}>
            <FormControl sx={{ width: 350 }}>
                <InputLabel id="multiple-checkbox-label">Colunas visíveis</InputLabel>
                <Select
                    labelId="multiple-checkbox-label"
                    id="multiple-checkbox"
                    multiple
                    value={selectedColumns}
                    onChange={handleChange}
                    label="Colunas visíveis"
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                    disabled={disabled}
                >
                    {colName.map((col) => (
                        <MenuItem key={col} value={col}>
                            <Checkbox checked={selectedColumns.indexOf(col) > -1} />
                            <ListItemText primary={col} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack>
    )
}
