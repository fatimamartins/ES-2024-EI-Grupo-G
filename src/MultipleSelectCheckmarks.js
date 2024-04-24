/**
 * @file This is the MultipleSelectCheckmarks component of the application.
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
import { Stack } from '@mui/material'

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

/** @constant {string[]} colName - The names of the columns in the select menu. */
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
 * This is the MultipleSelectCheckmarks component of the application.
 * It manages the selection of multiple items with checkboxes.
 *
 * @function
 * @name MultipleSelectCheckmarks
 * @returns {JSX.Element} The rendered MultipleSelectCheckmarks component.
 */
export default function MultipleSelectCheckmarks({ tableRef, disabled }) {
    const [selectedColumns, setSelectedColumns] = useState(colName) // the default value is all columns because all columns are visible by default

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
