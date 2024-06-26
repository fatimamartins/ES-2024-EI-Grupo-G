/**
 * @file RoomsTable.js
 * This file defines the RoomsTable component of the application. It imports necessary modules and components from React, react-tabulator, and Material-UI.
 */

/** @module react */
import React from 'react'
/** @module react-tabulator */
import { ReactTabulator } from 'react-tabulator'
/**
 * @module @mui/material
 */
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
    Tooltip,
} from '@mui/material'
/**
 * @module @mui/icons-material/Delete
 */
import Cancel from '@mui/icons-material/Delete'
/**
 * @module jotai
 */
import { useAtomValue } from 'jotai'
/**
 * @module atoms/rooms
 */
import { atomRooms } from './atoms/rooms'
/**
 * @module constants
 */
import { ROOM_FEATURES, TYPE_FILTER_COMPARISON, ROOMS } from './constants'
/**
 * @module atoms/schedule
 */
import { atomSchedule } from './atoms/schedule'
/**
 * @module @mui/x-date-pickers/internals/demo
 */
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
/**
 * @module @mui/x-date-pickers/AdapterDayjs
 */
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
/**
 * @module @mui/x-date-pickers/LocalizationProvider
 */
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
/**
 * @module @mui/x-date-pickers/DateTimePicker
 */
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

/**
 * @constant
 * @type {Array}
 * @description This constant defines the default columns for the table in the application. Each object in the array represents a column in the table.
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
        sorter: 'number',
    },
    {
        title: 'Capacidade Exame',
        field: 'Capacidade Exame',
        hozAlign: 'left',
        sorter: 'number',
    },
    {
        title: 'Nº características',
        field: 'Nº características',
        hozAlign: 'left',
        sorter: 'number',
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

/**
 * @constant
 * @type {Array}
 * @description This constant defines the default fields that are used for filtering in the application. Each string in the array represents a field that can be used for filtering.
 */
const defaultFilterFields = [
    'Edifício',
    'Nome sala',
    'Capacidade Normal',
    'Capacidade Exame',
    'Nº características',
    'Tipo de sala',
    'Data e disponibilidade',
]

/**
 * @function
 * @name RoomsTable
 * @description This function represents a component that renders a table of rooms. It takes in props as parameters and returns a table component.
 * @param {Object} props - The properties passed to the component.
 * @returns {React.Component} Returns a table component that displays the rooms.
 */
export default function RoomsTable() {
    const defaultData = useAtomValue(atomRooms)
    const defaultScheduleData = useAtomValue(atomSchedule)
    const tableRef = React.useRef(null)
    const [selectedField, setSelectedField] = React.useState('')
    const [value, setValue] = React.useState('')
    const [logicOperator, setLogicOperator] = React.useState('AND')
    const [type, setType] = React.useState('=') // type of filter comparison. Example: =, <, >, <=, >=, !=  like starts ends
    const [filters, setFilters] = React.useState([])
    const [timeFilterResult, setTimeFilterResult] = React.useState([])
    const [availableDecision, setAvailableDecision] = React.useState('Disponível')
    const [tabulatorFilter, setTabulatorFilter] = React.useState([])
    const [startDateTime, setStartDateTime] = React.useState(null)
    const [endDateTime, setEndDateTime] = React.useState(null)

    /**
     * @function
     * @name addFilter
     * @description This function is used to add a new filter to the table. It checks if the selected field is 'Data e disponibilidade' and if the start and end date times are available. If so, it applies a time-based filter. If the selected field is not 'Data e disponibilidade' and a value is provided, it adds a new filter to the filters array and updates the tabulator filter.
     * @param {Event} e - The event object.
     */
    const addFilter = (e) => {
        e.preventDefault()
        // If both startDateTime and endDateTime are available, apply time-based filtering
        if (
            selectedField === 'Data e disponibilidade' &&
            startDateTime &&
            endDateTime &&
            startDateTime.diff(endDateTime) !== 0
        ) {
            const roomsToFilter = filterRoomsByTime() // get rooms to filter
            setLogicOperator('AND') // the time filter is always "AND" with the other filters
            setTimeFilterResult(roomsToFilter) // we can only have one time filter
            updateTabulatorFilter(roomsToFilter)
        }
        if (selectedField !== 'Data e disponibilidade' && value) {
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
        }
    }

    /**
     * @function
     * @name updateTabulatorFilter
     * @description This function is used to update the tabulator filter. It checks the logic operator and updates the tabulator filter accordingly. It also resets the table fields filter.
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
        // reset table fields filter
        setSelectedField('')
        setValue('')
        setType('=')
    }

    /**
     * @function
     * @name clear
     * @description This function is used to clear all filters from the table and reset all filter fields.
     */
    const clear = () => {
        tableRef?.current.clearFilter()
        setFilters([])
        setLogicOperator('AND')
        setType('=')
        setValue('')
        setSelectedField('')
        setTabulatorFilter([])
        // time filters fields
        setAvailableDecision('Disponível')
        setStartDateTime(null)
        setEndDateTime(null)
        setTimeFilterResult([])
    }

    /**
     * @function
     * @name deleteTimeFilter
     * @description This function is used to delete the time filter from the table and reset the time filter fields.
     */
    const deleteTimeFilter = () => {
        setAvailableDecision('Disponível')
        setStartDateTime(null)
        setEndDateTime(null)
        setTimeFilterResult([])
        setSelectedField('')
        setTabulatorFilter(filters)
    }

    /**
     * @function
     * @name deleteFilter
     * @description This function is used to delete a specific filter from the table. It takes an index as a parameter and removes the filter at that index from the filters array. It also updates the tabulator filter.
     * @param {number} indexToRemove - The index of the filter to remove.
     */
    const deleteFilter = (indexToRemove) => {
        let tabulatorNewFilter = []
        if (filters.length === 1) {
            setFilters([])
            setLogicOperator('AND')
            setType('=')
            setValue('')
            setSelectedField('')
        } else {
            const newFilters = [...filters.slice(0, indexToRemove), ...filters.slice(indexToRemove + 1)]
            setFilters(newFilters)
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
        }
        timeFilterResult.length !== 0
            ? setTabulatorFilter([...tabulatorNewFilter, timeFilterResult])
            : setTabulatorFilter(tabulatorNewFilter)
    }

    /**
     * @function
     * @name filterRoomsByTime
     * @description This function is used to filter rooms based on the start and end date times. It checks if the start and end date times are available and then filters the rooms accordingly. It returns an array of new filters.
     * @returns {Array} Returns an array of new filters.
     */
    const filterRoomsByTime = () => {
        if (startDateTime && endDateTime) {
            const formattedStartTime = startDateTime.format('HH:mm') + ':00'
            const formattedEndTime = endDateTime.format('HH:mm') + ':00'
            const formattedDate = startDateTime.format('DD/MM/YYYY')

            // Devo validar se amabas as datas coincidem ou se forem datas diferentes deve resultar na mesma?

            if (availableDecision === 'Ocupado') {
                const availableRooms = defaultScheduleData.filter((item) => {
                    const itemStartTime = item['Hora início da aula']
                    const itemEndTime = item['Hora fim da aula']
                    const itemDate = item['Data da aula']

                    const overlaps =
                        (itemStartTime <= formattedStartTime && itemEndTime > formattedStartTime) ||
                        (itemStartTime < formattedEndTime && itemEndTime >= formattedEndTime) ||
                        (itemStartTime >= formattedStartTime && itemEndTime <= formattedEndTime)

                    const onDate = itemDate === formattedDate

                    return overlaps && onDate
                })

                const availableRoomIds = availableRooms.map((item) => item['Sala atribuída à aula'])

                return availableRoomIds.map((roomId) => {
                    const newFilter = {
                        title: 'Nome sala',
                        field: 'Nome sala',
                        type: '=',
                        value: roomId.trim(), // Remove espaços em branco no início e no final da string
                    }

                    return newFilter
                })
            } else if (availableDecision === 'Disponível') {
                const availableRooms = defaultScheduleData.filter((item) => {
                    const itemStartTime = item['Hora início da aula']
                    const itemEndTime = item['Hora fim da aula']
                    const itemDate = item['Data da aula']

                    const overlaps =
                        (itemStartTime <= formattedStartTime && itemEndTime > formattedStartTime) ||
                        (itemStartTime < formattedEndTime && itemEndTime >= formattedEndTime) ||
                        (itemStartTime >= formattedStartTime && itemEndTime <= formattedEndTime)

                    const onDate = itemDate === formattedDate

                    return overlaps && onDate
                })

                const availableRoomIds = availableRooms.map((item) => item['Sala atribuída à aula'].trim())

                // Filter out occupied rooms from available rooms
                const availableRoomsNotOccupied = ROOMS.filter((room) => !availableRoomIds.includes(room))

                return availableRoomsNotOccupied.map((roomId) => {
                    const newFilter = {
                        title: 'Nome sala',
                        field: 'Nome sala',
                        type: '=',
                        value: roomId.trim(), // Remove espaços em branco no início e no final da string
                    }

                    return newFilter
                })
            }
        }
    }

    React.useEffect(() => {
        if (tableRef?.current) {
            tableRef?.current.setFilter(tabulatorFilter)
        }
    }, [tabulatorFilter])

    return (
        <Tooltip title={defaultData.length === 0 ? 'Por favor carregue o ficheiro salas' : ''}>
            <div>
                <form onSubmit={(e) => addFilter(e)}>
                    <div>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 8, mb: 3 }}>
                            <FormControl sx={{ width: 350 }}>
                                <InputLabel id="simple-select-label1">Tipo de filtro</InputLabel>
                                <Select
                                    labelId="simple-select-label1"
                                    id="simple-select1"
                                    value={selectedField}
                                    label="Tipo de filtro"
                                    disabled={defaultData.length === 0}
                                    required
                                    onChange={(event) => setSelectedField(event.target.value)}
                                    sx={{ height: 57 }}
                                >
                                    {defaultFilterFields.map((col, index) => {
                                        const isTimeFilterDisabled =
                                            timeFilterResult.length > 0 && col === 'Data e disponibilidade'
                                        return (
                                            <MenuItem key={index} value={col} disabled={isTimeFilterDisabled}>
                                                <ListItemText
                                                    primary={
                                                        isTimeFilterDisabled
                                                            ? col + ' <>Este filtro só pode ser utilizado uma vez<>'
                                                            : col
                                                    }
                                                />
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            {selectedField !== 'Data e disponibilidade' && (
                                <FormControl sx={{ width: 90 }}>
                                    <InputLabel id="simple-select-label2">Tipo</InputLabel>
                                    <Select
                                        labelId="simple-select-label2"
                                        id="simple-select2"
                                        value={type}
                                        label="Tipo"
                                        required
                                        disabled={defaultData.length === 0}
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
                            )}
                            {selectedField === 'Tipo de sala' && (
                                <FormControl sx={{ ml: 1, width: 350 }}>
                                    <Select
                                        sx={{ height: 65 }}
                                        value={value}
                                        defaultValue=""
                                        displayEmpty
                                        disabled={defaultData.length === 0}
                                        required
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
                            {selectedField === 'Data e disponibilidade' && (
                                <Tooltip
                                    title={
                                        defaultScheduleData.length === 0 ? 'Por favor carregue o ficheiro horário' : ''
                                    }
                                >
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, mb: 2 }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DateTimePicker']} sx={{ width: 350 }}>
                                                <DateTimePicker
                                                    label="Início"
                                                    format="DD-MM-YYYY HH:mm"
                                                    views={['day', 'month', 'year', 'hours', 'minutes']}
                                                    value={startDateTime}
                                                    disabled={defaultScheduleData.length === 0}
                                                    onChange={(newValue) => {
                                                        setStartDateTime(newValue)
                                                    }}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer
                                                components={['DateTimePicker']}
                                                sx={{ width: 350, marginLeft: 2 }}
                                            >
                                                <DateTimePicker
                                                    label="Fim"
                                                    format="DD-MM-YYYY HH:mm"
                                                    views={['day', 'month', 'year', 'hours', 'minutes']}
                                                    value={endDateTime}
                                                    disabled={defaultScheduleData.length === 0}
                                                    onChange={(newValue) => {
                                                        setEndDateTime(newValue)
                                                    }}
                                                    minDateTime={startDateTime}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                        <Stack direction="row" alignItems="center">
                                            <Typography>Ocupado</Typography>
                                            <Switch
                                                checked={availableDecision === 'Disponível'}
                                                inputProps={{ 'aria-label': 'ant design' }}
                                                disabled={defaultScheduleData.length === 0}
                                                onChange={(e, c) => setAvailableDecision(c ? 'Disponível' : 'Ocupado')}
                                            />
                                            <Typography>Disponível</Typography>
                                        </Stack>
                                    </Stack>
                                </Tooltip>
                            )}
                            {selectedField !== 'Tipo de sala' && selectedField !== 'Data e disponibilidade' && (
                                <TextField
                                    sx={{ ml: 1, width: 350 }}
                                    id="outlined-basic"
                                    placeholder="valor"
                                    variant="outlined"
                                    value={value}
                                    disabled={defaultData.length === 0}
                                    required
                                    onChange={(event) => {
                                        setValue(event.target.value)
                                    }}
                                />
                            )}
                            {selectedField !== 'Data e disponibilidade' && (
                                <Stack direction="row" alignItems="center">
                                    <Typography>OR</Typography>
                                    <Switch
                                        checked={logicOperator === 'AND'}
                                        inputProps={{ 'aria-label': 'ant design' }}
                                        onChange={(e, c) => setLogicOperator(c ? 'AND' : 'OR')}
                                        disabled={defaultData.length === 0}
                                    />
                                    <Typography>AND</Typography>
                                </Stack>
                            )}
                        </Stack>
                        <Stack flexDirection="row" justifyContent="end" marginBottom={4}>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={
                                    defaultData.length === 0 ||
                                    (selectedField === 'Data e disponibilidade' && defaultScheduleData.length === 0)
                                }
                            >
                                Adicionar filtro
                            </Button>
                            <Button variant="text" onClick={clear} disabled={defaultData.length === 0}>
                                Limpar filtros
                            </Button>
                        </Stack>
                    </div>
                </form>
                {filters && filters.length > 0 && (
                    <Stack direction="row" spacing={1} alignItems="center" marginBottom={4} sx={{ mt: 2 }}>
                        {filters
                            .filter((item) => !item.isTimeFilter)
                            .map((filter, index) => {
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
                {timeFilterResult && timeFilterResult.length > 0 && (
                    <Stack direction="row" spacing={1} alignItems="center" marginBottom={4} sx={{ mt: 2 }}>
                        <Button variant="outlined" endIcon={<Cancel />} onClick={deleteTimeFilter}>
                            {availableDecision} {'  '} {'  '}
                            {startDateTime.format('DD/MM/YYYY HH:mm')}
                            {'  '} - {'  '}
                            {endDateTime.format('DD/MM/YYYY HH:mm')}
                        </Button>
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
        </Tooltip>
    )
}
