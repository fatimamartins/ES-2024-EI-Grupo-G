/**
 * @file This is the RoomsTable component of the application.
 */

/** @module react */
import React from 'react'
/** @module react-tabulator */
import { ReactTabulator } from 'react-tabulator'
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
import Cancel from '@mui/icons-material/Delete'
import { useAtomValue } from 'jotai'
import { atomRooms } from './atoms/rooms'
import { atomSchedule } from './atoms/schedule'
import { ROOM_FEATURES, TYPE_FILTER_COMPARISON } from './constants'

/**
 * @constant {Object[]} defaultColumns - The default columns for the table.
 */
const defaultColumns = [
    {
        title: 'Edifício',
        field: 'Edifício',
        hozAlign: 'left',
    },
    {
        title: 'Nome sala',
        field: 'Nome sala',
        hozAlign: 'left',
        sorter: 'string',
    },
    {
        title: 'Capacidade Normal',
        field: 'Capacidade Normal',
        hozAlign: 'left',
        sorter: 'string',
    },
    {
        title: 'Capacidade Exame',
        field: 'Capacidade Exame',
        hozAlign: 'left',
        sorter: 'string',
    },
    {
        title: 'Nº características',
        field: 'Nº características',
        hozAlign: 'left',
    },
    { title: 'Anfiteatro aulas', field: 'Anfiteatro aulas', visible: false },
    { title: 'Arq 1', field: 'Arq 1', visible: false },
    { title: 'Arq 2', field: 'Arq 2', visible: false },
    { title: 'Arq 3', field: 'Arq 3', visible: false },
    { title: 'Arq 4', field: 'Arq 4', visible: false },
    { title: 'Arq 5', field: 'Arq 5', visible: false },
    { title: 'Arq 6', field: 'Arq 6', visible: false },
    { title: 'Arq 9', field: 'Arq 9', visible: false },
    { title: 'BYOD (Bring Your Own Device)', field: 'BYOD (Bring Your Own Device)', visible: false },
    { title: 'Focus Group', field: 'Focus Group', visible: false },
    {
        title: 'Laboratório de Arquitectura de Computadores I',
        field: 'Laboratório de Arquitectura de Computadores I',
        visible: false,
    },
    {
        title: 'Laboratório de Arquitectura de Computadores II',
        field: 'Laboratório de Arquitectura de Computadores II',
        visible: false,
    },
    { title: 'Laboratório de Bases de Engenharia', field: 'Laboratório de Bases de Engenharia', visible: false },
    { title: 'Laboratório de Electrónica', field: 'Laboratório de Electrónica', visible: false },
    { title: 'Laboratório de Informática', field: 'Laboratório de Informática', visible: false },
    { title: 'Laboratório de Jornalismo', field: 'Laboratório de Jornalismo', visible: false },
    {
        title: 'Laboratório de Redes de Computadores I',
        field: 'Laboratório de Redes de Computadores I',
        visible: false,
    },
    {
        title: 'Laboratório de Redes de Computadores II',
        field: 'Laboratório de Redes de Computadores II',
        visible: false,
    },
    { title: 'Laboratório de Telecomunicações', field: 'Laboratório de Telecomunicações', visible: false },
    { title: 'Sala Aulas Mestrado', field: 'Sala Aulas Mestrado', visible: false },
    { title: 'Sala Aulas Mestrado Plus', field: 'Sala Aulas Mestrado Plus', visible: false },
    { title: 'Sala NEE', field: 'Sala NEE', visible: false },
    { title: 'Sala Provas', field: 'Sala Provas', visible: false },
    { title: 'Sala Reunião', field: 'Sala Reunião', visible: false },
    { title: 'Sala de Arquitectura', field: 'Sala de Arquitectura', visible: false },
    { title: 'Sala de Aulas normal', field: 'Sala de Aulas normal', visible: false },
    { title: 'Videoconferência', field: 'Videoconferência', visible: false },
    { title: 'Átrio', field: 'Átrio', visible: false },
]

const defaultFilterFields = [
    'Edifício',
    'Nome sala',
    'Capacidade Normal',
    'Capacidade Exame',
    'Nº características',
    'Tipo de sala',
]

/**
 * This is the RoomsTable component of the application.
 * It displays a table of rooms with various properties.
 *
 * @function
 * @name RoomsTable
 * @param {Object} props - The properties passed to the component.
 * @param {Object[]} props.data - The data to display in the table.
 * @returns {JSX.Element} The rendered RoomsTable component.
 */
export default function RoomsTable() {
    const defaultData = useAtomValue(atomRooms)
    const defaultDataSchedule = useAtomValue(atomSchedule)
    const tableRef = React.useRef(null)
    const [selectedField, setSelectedField] = React.useState('')
    const [value, setValue] = React.useState('')
    const [logicOperator, setLogicOperator] = React.useState('AND')
    const [type, setType] = React.useState('=') // type of filter comparison. Example: =, <, >, <=, >=, !=  like starts ends
    const [filters, setFilters] = React.useState([])
    console.log('🚀 ~ RoomsTable ~ filters:', filters)
    const [tabulatorFilter, setTabulatorFilter] = React.useState([])

    const addFilter = () => {
        setFilters([
            ...filters,
            {
                title: defaultFilterFields.find((f) => f === selectedField),
                field: selectedField,
                value,
                logic: logicOperator,
                type,
            },
        ])
        // if selectedField is 'Tipo de sala' then field is equal to value (room type) and value is equal to 'X'
        const newFilter =
            selectedField === 'Tipo de sala'
                ? { field: value, type: '=', value: 'X' }
                : { field: selectedField, type, value }

        updateTabulatorFilter(newFilter) // update tabulator filter
        setSelectedField('') // reset all states
        setValue('')
        setType('=')
    }

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

    const clear = () => {
        tableRef?.current.clearFilter()
        setFilters([]) // clear all filters
        setLogicOperator('AND')
        setType('=')
        setValue('')
        setSelectedField('')
        setTabulatorFilter([])
    }

    const deleteFilter = (indexToRemove) => {
        if (filters.length === 1) {
            clear()
        } else {
            const newFilters = [...filters.slice(0, indexToRemove), ...filters.slice(indexToRemove + 1)]
            setFilters(newFilters)
            let tabulatorNewFilter = []
            newFilters.forEach((f) => {
                const newFilter =
                    f.title === 'Tipo de sala'
                        ? { field: f.value, type: '=', value: 'X' }
                        : { field: f.field, type: f.type, value: f.value }
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
    }, [tabulatorFilter])

    return (
        <div>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                <Typography>OR</Typography>
                <Switch
                    defaultChecked
                    inputProps={{ 'aria-label': 'ant design' }}
                    onChange={(e, c) => setLogicOperator(c ? 'AND' : 'OR')}
                />
                <Typography>AND</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, mb: 2 }}>
                <FormControl sx={{ width: 350 }}>
                    <InputLabel id="simple-select-label1">Campo a filtrar</InputLabel>
                    <Select
                        labelId="simple-select-label1"
                        id="simple-select1"
                        value={selectedField}
                        label="Campo a filtrar"
                        onChange={(event) => setSelectedField(event.target.value)}
                    >
                        {defaultFilterFields.map((col, index) => {
                            return (
                                <MenuItem key={index} value={col}>
                                    <ListItemText primary={col} />
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <FormControl sx={{ width: 100 }}>
                    <InputLabel id="simple-select-label2">Tipo</InputLabel>
                    <Select
                        labelId="simple-select-label2"
                        id="simple-select2"
                        value={type}
                        label="Tipo"
                        onChange={(event) => setType(event.target.value)}
                    >
                        {TYPE_FILTER_COMPARISON.map((t, index) => {
                            return (
                                <MenuItem key={index} value={t}>
                                    {t}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                {selectedField !== 'Tipo de sala' ? (
                    <TextField
                        sx={{ ml: 1, width: 350 }}
                        id="outlined-basic"
                        placeholder="valor"
                        variant="outlined"
                        value={value}
                        onChange={(event) => {
                            setValue(event.target.value)
                        }}
                    />
                ) : (
                    <FormControl sx={{ ml: 1, width: 350 }}>
                        <Select
                            sx={{ height: 65 }}
                            value={value}
                            defaultValue=""
                            displayEmpty
                            onChange={(event) => {
                                setValue(event.target.value)
                            }}
                        >
                            {ROOM_FEATURES.map((col) => (
                                <MenuItem key={col} value={col}>
                                    <ListItemText primary={col} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                <Button variant="contained" onClick={addFilter} sx={{ ml: 1 }}>
                    Adicionar filtro
                </Button>
                <Button variant="text" onClick={clear}>
                    Limpar filtros
                </Button>
            </Stack>
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
            <ReactTabulator
                onRef={(r) => (tableRef.current = r.current)}
                data={defaultData}
                columns={defaultColumns}
                options={{
                    pagination: 'local',
                    paginationSize: 10,
                    paginationSizeSelector: [6, 10, 15, 20],
                    movableColumns: true,
                    paginationCounter: 'rows',
                    layout: 'fitColumns',
                }}
            />
        </div>
    )
}
