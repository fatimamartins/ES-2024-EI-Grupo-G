import React, { useState } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import { InputLabel, Stack } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 50,
        },
    },
}

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

export default function MultipleSelectCheckmarks({ defaultColumns, setColumns }) {
    const [selectedColumns, setSelectedColumns] = useState(colName)

    const handleChange = (event) => {
        const {
            target: { value },
        } = event
        setSelectedColumns(typeof value === 'string' ? value.split(',') : value)

        const newValue = defaultColumns.map((col) => {
            return { ...col, visible: value.includes(col.title) }
        })
        setColumns(newValue)
    }

    return (
        <Stack direction={'row'} mb={1} justifyContent="flex-end">
            <FormControl sx={{ width: 350 }}>
                <InputLabel id="multiple-checkbox-label">Colunas</InputLabel>
                <Select
                    labelId="multiple-checkbox-label"
                    id="multiple-checkbox"
                    multiple
                    value={selectedColumns}
                    onChange={handleChange}
                    input={<OutlinedInput label="Colunas" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
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
