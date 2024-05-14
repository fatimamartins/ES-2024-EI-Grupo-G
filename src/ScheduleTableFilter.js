/**
 * @file ScheduleTableFilter.js
 * This file is a component for a filter of the schedule table using react-tabulator. It imports necessary modules and components such as React, MUI material components, and the Cancel icon from MUI icons. It also defines constants for the default type of filter comparison and the default filter fields.
 */

/** @module react */
import * as React from 'react'
/** @module @mui/material */
import {
    Button,
    Stack,
    Typography,
    Switch,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemText,
    TextField,
} from '@mui/material'
/** @module @mui/icons-material/Delete */
import Cancel from '@mui/icons-material/Delete'

/**
 * @constant
 * @type {Array}
 * @description This constant defines the default types of filter comparisons that can be used in the application.
 */
const defaultTypeOfFilterComparison = ['=', '!=', 'like', 'starts', 'ends', '<', '>', '<=', '>=']

/**
 * @constant
 * @type {Array}
 * @description This constant defines the default fields that can be used for filtering in the application. Each object in the array represents a field that can be used for filtering.
 */
const defaultFilterFields = [
    { title: 'Curso', field: 'Curso' },
    { title: 'Unidade Curricular', field: 'Unidade Curricular' },
    { title: 'Turno', field: 'Turno' },
    { title: 'Turma', field: 'Turma' },
    { title: 'Inscritos no turno', field: 'Inscritos no turno' },
    { title: 'Dia da semana', field: 'Dia da semana' },
    { title: 'Hora início da aula', field: 'Hora início da aula' },
    { title: 'Hora fim da aula', field: 'Hora fim da aula' },
    { title: 'Data da aula', field: 'Data da aula' },
    { title: 'Características da sala pedida para a aula', field: 'Características da sala pedida para a aula' },
    { title: 'Sala atribuída à aula', field: 'Sala atribuída à aula' },
    { title: 'Semana do ano', field: 'Semana do ano' },
    { title: 'Semana do semestre', field: 'Semana do semestre' },
]

/**
 * @function
 * @name ScheduleTableFilter
 * @description This function represents a component that renders a filter for the schedule table. It takes in props as parameters and returns a filter component.
 * @param {Object} props - The properties passed to the component.
 * @returns {React.Component} Returns a filter component that can be used to filter the schedule table.
 */
function ScheduleTableFilter({ tableRef, disabled }) {
    /**
     * @constant
     * @type {Array}
     * @description This constant defines a state variable and a function to update it. The state variable, selectedField, is used to store the currently selected field for filtering.
     */
    const [selectedField, setSelectedField] = React.useState('')
    /**
     * @constant
     * @type {Array}
     * @description This constant defines a state variable and a function to update it. The state variable, value, is used to store the value for the selected field for filtering.
     */
    const [value, setValue] = React.useState('')
    /**
     * @constant
     * @type {Array}
     * @description This constant defines a state variable and a function to update it. The state variable, logicOperator, is used to store the logic operator for filtering.
     */
    const [logicOperator, setLogicOperator] = React.useState('AND')
    /**
     * @constant
     * @type {Array}
     * @description This constant defines a state variable and a function to update it. The state variable, type, is used to store the type of filter comparison.
     */
    const [type, setType] = React.useState('=') // type of filter comparison. Example: =, <, >, <=, >=, !=  like starts ends
    /**
     * @constant
     * @type {Array}
     * @description This constant defines a state variable and a function to update it. The state variable, filters, is used to store the filters applied to the table.
     */
    const [filters, setFilters] = React.useState([])
    /**
     * @constant
     * @type {Array}
     * @description This constant defines a state variable and a function to update it. The state variable, tabulatorFilter, is used to store the tabulator filter applied to the table.
     */
    const [tabulatorFilter, setTabulatorFilter] = React.useState([])

    /**
     * @function
     * @name addFilter
     * @description This function adds a new filter to the filters state and updates the tabulator filter. It also resets the filter form fields.
     * @param {Event} e - The event object.
     */
    const addFilter = (e) => {
        e.preventDefault()
        setFilters([
            ...filters,
            {
                title: selectedField,
                field: selectedField,
                value,
                logic: logicOperator,
                type,
            },
        ])
        const newFilter = { field: selectedField, type, value }
        tableRef?.current.setFilter([newFilter])
        updateTabulatorFilter(newFilter) // update tabulator filter
        setSelectedField('') // reset all states
        setValue('')
        setType('=')
    }

    /**
     * @function
     * @name updateTabulatorFilter
     * @description This function updates the tabulator filter state based on the new filter and the logic operator. It handles the cases for AND and OR logic operators.
     * @param {Object} newFilter - The new filter to be added.
     */
    const updateTabulatorFilter = (newFilter) => {
        if (logicOperator === 'AND') {
            setTabulatorFilter([...tabulatorFilter, newFilter])
        } else if (logicOperator === 'OR' && tabulatorFilter.length === 0) {
            // if logic operator is OR and there are no filters
            setTabulatorFilter([newFilter])
        } else {
            const previousFilter = tabulatorFilter[tabulatorFilter.length - 1] // get last element
            const newFilterArr = tabulatorFilter.slice(0, -1) // remove last element
            Array.isArray(previousFilter)
                ? setTabulatorFilter([...newFilterArr, [...previousFilter, newFilter]])
                : setTabulatorFilter([...newFilterArr, [previousFilter, newFilter]])
        }
    }

    /**
     * @function
     * @name clear
     * @description This function clears all filters and resets the filter form fields.
     */
    const clear = () => {
        tableRef?.current.clearFilter()
        setFilters([]) // clear all filters
        setLogicOperator('AND')
        setType('=')
        setValue('')
        setSelectedField('')
        setTabulatorFilter([])
    }

    /**
     * @function
     * @name deleteFilter
     * @description This function deletes a filter from the filters state and updates the tabulator filter accordingly.
     * @param {number} indexToRemove - The index of the filter to be removed.
     */
    const deleteFilter = (indexToRemove) => {
        if (filters.length === 1) {
            clear()
        } else {
            const newFilters = [...filters.slice(0, indexToRemove), ...filters.slice(indexToRemove + 1)]
            setFilters(newFilters)
            let tabulatorNewFilter = []
            newFilters.forEach((f) => {
                const newFilter = { field: f.field, type: f.type, value: f.value }
                if (f.logic === 'AND') {
                    tabulatorNewFilter = [...tabulatorNewFilter, newFilter]
                } else if (f.logic === 'OR' && tabulatorNewFilter.length === 0) {
                    // if logic operator is OR and there are no filters
                    tabulatorNewFilter = [newFilter]
                } else {
                    const previousFilter = tabulatorNewFilter[tabulatorNewFilter.length - 1] // get last element
                    const newFilterArr = tabulatorNewFilter.slice(0, -1) // remove last element
                    Array.isArray(previousFilter)
                        ? (tabulatorNewFilter = [...newFilterArr, [...previousFilter, newFilter]])
                        : (tabulatorNewFilter = [...newFilterArr, [previousFilter, newFilter]])
                }
            })
            setTabulatorFilter(tabulatorNewFilter)
        }
    }

    React.useEffect(() => {
        if (tabulatorFilter.length !== 0) {
            tableRef?.current.setFilter(tabulatorFilter)
        }
    }, [tableRef, tabulatorFilter])

    return (
        <Stack mt={6} mb={4}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                <Typography>OR</Typography>
                <Switch
                    checked={logicOperator === 'AND'}
                    inputProps={{ 'aria-label': 'ant design' }}
                    onChange={(e, c) => setLogicOperator(c ? 'AND' : 'OR')}
                    disabled={disabled}
                />
                <Typography>AND</Typography>
            </Stack>
            <form onSubmit={(e) => addFilter(e)}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, mb: 2 }}>
                    <FormControl sx={{ width: 350 }}>
                        <InputLabel id="simple-select-label1">Campo a filtrar</InputLabel>
                        <Select
                            labelId="simple-select-label1"
                            id="simple-select1"
                            value={selectedField}
                            label="Campo a filtrar"
                            required
                            onChange={(event) => setSelectedField(event.target.value)}
                            disabled={disabled}
                            sx={{ height: 57 }}
                        >
                            {defaultFilterFields.map((col) => {
                                return (
                                    <MenuItem key={col.title} value={col.field}>
                                        <ListItemText primary={col.title} />
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: 100, ml: 1 }}>
                        <InputLabel id="simple-select-label2">Tipo</InputLabel>
                        <Select
                            labelId="simple-select-label2"
                            id="simple-select2"
                            value={type}
                            label="Tipo"
                            onChange={(event) => setType(event.target.value)}
                            disabled={disabled}
                        >
                            {defaultTypeOfFilterComparison.map((t, index) => {
                                return (
                                    <MenuItem key={index} value={t}>
                                        {t}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <TextField
                        sx={{ ml: 1, width: 350 }}
                        id="outlined-basic"
                        placeholder="valor"
                        variant="outlined"
                        value={value}
                        required
                        onChange={(event) => {
                            setValue(event.target.value)
                        }}
                        disabled={disabled}
                    />
                    <Stack direction="row" alignContent={'center'}>
                        <Button variant="contained" type="submit" sx={{ ml: 1 }} disabled={disabled}>
                            Adicionar filtro
                        </Button>
                        <Button variant="text" onClick={clear} disabled={disabled}>
                            Limpar filtros
                        </Button>
                    </Stack>
                </Stack>
            </form>
            {filters && filters.length > 0 && (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                    {filters.map((filter, index) => {
                        if (index === 0) {
                            return (
                                <Button
                                    key={index}
                                    variant="outlined"
                                    endIcon={<Cancel />}
                                    onClick={(e) => deleteFilter(index)}
                                >
                                    {filters[0].title}: {filters[0].value}
                                </Button>
                            )
                        } else {
                            return (
                                <Stack direction="row" alignItems="center" key={index}>
                                    {filter.logic ? filter.logic : ''}
                                    <Button
                                        variant="outlined"
                                        endIcon={<Cancel />}
                                        onClick={(e) => deleteFilter(index)}
                                        sx={{ ml: 1 }}
                                    >
                                        {filter.title}: {filter.value}
                                    </Button>
                                </Stack>
                            )
                        }
                    })}
                </Stack>
            )}
        </Stack>
    )
}

export default ScheduleTableFilter
