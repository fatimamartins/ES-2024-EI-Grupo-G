/**
 * @file This is the RoomsTable component of the application.
 */

/** @module react */
import React from 'react'
/** @module react-tabulator */
import { ReactTabulator } from 'react-tabulator'
/**
 * @module @mui/material
 * Material-UI is a popular React UI framework that provides a set of pre-designed components following Material Design guidelines.
 * Here, several components are imported for use in the application.
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
} from '@mui/material'
/**
 * @module @mui/icons-material/Delete
 * Material-UI Icons is a set of pre-designed icons following Material Design guidelines.
 * Here, the Delete icon is imported for use in the application.
 */
import Cancel from '@mui/icons-material/Delete'
/**
 * @module jotai
 * Jotai is a primitive and flexible state management library for React.
 * Here, the useAtomValue hook is imported for use in the application.
 */
import { useAtomValue } from 'jotai'
/**
 * @module atoms/rooms
 * This module exports the atomRooms atom, which is used for managing the state of rooms in the application.
 */
import { atomRooms } from './atoms/rooms'
/**
 * @module constants
 * This module exports constants used throughout the application.
 * Here, ROOM_FEATURES and TYPE_FILTER_COMPARISON are imported for use in the application.
 */
import { ROOM_FEATURES, TYPE_FILTER_COMPARISON, ROOMS } from './constants'
import { atomSchedule } from './atoms/schedule'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

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

/**
 * @constant {Object[]} defaultFilterFields - Default filter fields for the RoomsTable component.
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

    const addFilter = () => {
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

    const deleteTimeFilter = () => {
        setAvailableDecision('Disponível')
        setStartDateTime(null)
        setEndDateTime(null)
        setTimeFilterResult([])
        setSelectedField('')
        setTabulatorFilter(filters)
    }

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

    React.useEffect(() => {
        if (tabulatorFilter.length !== 0) {
            tableRef?.current.setFilter(tabulatorFilter)
        }
    }, [tabulatorFilter])

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

                // setFilters([...filters, ...roomFilters])

                /* if (availableRoomIds.length === 0) {
                    roomFilters.push({
                        field: 'Nome sala',
                        type: '=',
                        value: '', // Add an empty string as a value
                    })
                } */

                // updateTabulatorFilter(roomFilters)
                // setTabulatorFilter([...tabulatorFilter, ...roomFilters])
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

                // setFilters([...filters, ...roomFilters])

                /* if (availableRoomsNotOccupied.length === 0) {
                    roomFilters.push({
                        field: 'Nome sala',
                        type: '=',
                        value: '', // Add an empty string as a value
                    })
                } */

                // updateTabulatorFilter(roomFilters)
                // setTabulatorFilter([...tabulatorFilter, ...roomFilters])
            }
        }
    }

    console.log('filtro local', filters)
    console.log('tabulator', tabulatorFilter)
    console.log('🚀 timeFilterResult:', timeFilterResult)

    return (
        <div>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 8, mb: 3 }}>
                <FormControl sx={{ width: 350 }}>
                    <InputLabel id="simple-select-label1">Tipo de filtro</InputLabel>
                    <Select
                        labelId="simple-select-label1"
                        id="simple-select1"
                        value={selectedField}
                        label="Tipo de filtro"
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
                {selectedField !== 'Data e disponibilidade' && (
                    <FormControl sx={{ width: 90 }}>
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
                )}
                {selectedField === 'Tipo de sala' && (
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
                {selectedField === 'Data e disponibilidade' && (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, mb: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateTimePicker']} sx={{ width: 350 }}>
                                <DateTimePicker
                                    label="Início"
                                    format="DD-MM-YYYY HH:mm"
                                    views={['day', 'month', 'year', 'hours', 'minutes']}
                                    value={startDateTime}
                                    onChange={(newValue) => {
                                        setStartDateTime(newValue)
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateTimePicker']} sx={{ width: 350, marginLeft: 2 }}>
                                <DateTimePicker
                                    label="Fim"
                                    format="DD-MM-YYYY HH:mm"
                                    views={['day', 'month', 'year', 'hours', 'minutes']}
                                    value={endDateTime}
                                    onChange={(newValue) => {
                                        setEndDateTime(newValue)
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                        <Stack direction="row" alignItems="center">
                            <Typography>Ocupado</Typography>
                            <Switch
                                checked={availableDecision === 'Disponível'}
                                inputProps={{ 'aria-label': 'ant design' }}
                                onChange={(e, c) => setAvailableDecision(c ? 'Disponível' : 'Ocupado')}
                            />
                            <Typography>Disponível</Typography>
                        </Stack>
                    </Stack>
                )}
                {selectedField !== 'Tipo de sala' && selectedField !== 'Data e disponibilidade' && (
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
                )}
                {selectedField !== 'Data e disponibilidade' && (
                    <Stack direction="row" alignItems="center">
                        <Typography>OR</Typography>
                        <Switch
                            checked={logicOperator === 'AND'}
                            inputProps={{ 'aria-label': 'ant design' }}
                            onChange={(e, c) => setLogicOperator(c ? 'AND' : 'OR')}
                        />
                        <Typography>AND</Typography>
                    </Stack>
                )}
            </Stack>
            <Stack flexDirection="row" justifyContent="end" marginBottom={4}>
                <Button variant="contained" onClick={addFilter}>
                    Adicionar filtro
                </Button>
                <Button variant="text" onClick={clear}>
                    Limpar filtros
                </Button>
            </Stack>
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
    )
}
