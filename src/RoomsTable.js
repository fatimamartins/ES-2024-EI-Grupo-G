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

/**
 * @constant {Object[]} defaultColumns - The default columns for the table.
 */
const defaultColumns = [
    {
        title: 'Edifício',
        field: 'Edif�cio',
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
        field: 'N� caracter�sticas',
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
        field: 'Laborat�rio de Arquitectura de Computadores I',
        visible: false,
    },
    {
        title: 'Laboratório de Arquitectura de Computadores II',
        field: 'Laborat�rio de Arquitectura de Computadores II',
        visible: false,
    },
    { title: 'Laboratório de Bases de Engenharia', field: 'Laborat�rio de Bases de Engenharia', visible: true },
    { title: 'Laboratório de Electrónica', field: 'Laborat�rio de Electr�ica', visible: false },
    { title: 'Laboratório de Informática', field: 'Laborat�rio de Inform�tica', visible: false },
    { title: 'Laboratório de Jornalismo', field: 'Laborat�rio de Jornalismo', visible: false },
    {
        title: 'Laboratório de Redes de Computadores I',
        field: 'Laborat�rio de Redes de Computadores I',
        visible: false,
    },
    {
        title: 'Laboratório de Redes de Computadores II',
        field: 'Laborat�rio de Redes de Computadores II',
        visible: false,
    },
    { title: 'Laboratório de Telecomunicações', field: 'Laborat�rio de Telecomunica��es', visible: false },
    { title: 'Sala Aulas Mestrado', field: 'Sala Aulas Mestrado', visible: false },
    { title: 'Sala Aulas Mestrado Plus', field: 'Sala Aulas Mestrado Plus', visible: false },
    { title: 'Sala NEE', field: 'Sala NEE', visible: false },
    { title: 'Sala Provas', field: 'Sala Provas', visible: false },
    { title: 'Sala Reunião', field: 'Sala Reuni�o', visible: false },
    { title: 'Sala de Arquitectura', field: 'Sala de Arquitectura', visible: false },
    { title: 'Sala de Aulas normal', field: 'Sala de Aulas normal', visible: false },
    { title: 'Videoconferência', field: 'videoconfer�ncia', visible: false },
    { title: 'Átrio', field: '�trio', visible: false },
]

const defaultFilterFields = [
    { title: 'Edifício', field: 'Edif�cio' },
    { title: 'Nome sala', field: 'Nome sala' },
    { title: 'Capacidade Normal', field: 'Capacidade Normal' },
    { title: 'Capacidade Exame', field: 'Capacidade Exame' },
    { title: 'Nº características', field: 'N� caracter�sticas' },
    { title: 'Tipo de sala', field: 'Tipo de sala' },
]

const defaultRoomTypes = [
    { title: 'Anfiteatro aulas', field: 'Anfiteatro aulas' },
    { title: 'Arq 1', field: 'Arq 1' },
    { title: 'Arq 2', field: 'Arq 2' },
    { title: 'Arq 3', field: 'Arq 3' },
    { title: 'Arq 4', field: 'Arq 4' },
    { title: 'Arq 5', field: 'Arq 5' },
    { title: 'Arq 6', field: 'Arq 6' },
    { title: 'Arq 9', field: 'Arq 9' },
    { title: 'BYOD (Bring Your Own Device)', field: 'BYOD (Bring Your Own Device)' },
    { title: 'Focus Group', field: 'Focus Group', visible: false },
    { title: 'Laboratório de Arquitectura de Computadores I', field: 'Laborat�rio de Arquitectura de Computadores I' },
    {
        title: 'Laboratório de Arquitectura de Computadores II',
        field: 'Laborat�rio de Arquitectura de Computadores II',
    },
    { title: 'Laboratório de Bases de Engenharia', field: 'Laborat�rio de Bases de Engenharia' },
    { title: 'Laboratório de Electrónica', field: 'Laborat�rio de Electr�ica' },
    { title: 'Laboratório de Informática', field: 'Laborat�rio de Inform�tica' },
    { title: 'Laboratório de Jornalismo', field: 'Laborat�rio de Jornalismo' },
    { title: 'Laboratório de Redes de Computadores I', field: 'Laborat�rio de Redes de Computadores I' },
    { title: 'Laboratório de Redes de Computadores II', field: 'Laborat�rio de Redes de Computadores II' },
    { title: 'Laboratório de Telecomunicações', field: 'Laborat�rio de Telecomunica��es' },
    { title: 'Sala Aulas Mestrado', field: 'Sala Aulas Mestrado' },
    { title: 'Sala Aulas Mestrado Plus', field: 'Sala Aulas Mestrado Plus' },
    { title: 'Sala NEE', field: 'Sala NEE' },
    { title: 'Sala Provas', field: 'Sala Provas' },
    { title: 'Sala Reunião', field: 'Sala Reuni�o' },
    { title: 'Sala de Arquitectura', field: 'Sala de Arquitectura' },
    { title: 'Sala de Aulas normal', field: 'Sala de Aulas normal' },
    { title: 'Videoconferência', field: 'videoconfer刃cia' },
    { title: 'Átrio', field: '�trio' },
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
export default function RoomsTable({ defaultData }) {
    const tableRef = React.useRef(null)
    const [selectedField, setSelectedField] = React.useState('')
    const [value, setValue] = React.useState('')
    const [logicOperator, setLogicOperator] = React.useState('AND')
    const [filters, setFilters] = React.useState([])
    const [tabulatorFilter, setTabulatorFilter] = React.useState([])

    const handleFieldChange = (event) => {
        setSelectedField(event.target.value)
    }

    const addFilter = () => {
        setFilters([
            ...filters,
            {
                title: defaultFilterFields.find((f) => f.field === selectedField).title,
                field: selectedField,
                value: value,
                logic: logicOperator,
            },
        ])
        setSelectedField('')
        setValue('')

        const newFilter =
            selectedField === 'Tipo de sala'
                ? { field: value, type: '=', value: 'X' }
                : { field: selectedField, type: '=', value: value }

        if (logicOperator === 'AND') {
            setTabulatorFilter([...tabulatorFilter, newFilter])
        } else {
            const previousFilter = tabulatorFilter[tabulatorFilter.length - 1] // get last element
            const newFilterArr = tabulatorFilter.slice(0, -1) // remove last element
            setTabulatorFilter([...newFilterArr, [previousFilter, newFilter]])
        }
    }

    React.useEffect(() => {
        if (tabulatorFilter.length !== 0) {
            tableRef?.current.setFilter(tabulatorFilter)
        }
    }, [tabulatorFilter])

    const clear = () => {
        tableRef?.current.clearFilter()
        setFilters([])
    }

    const deleteFilter = (filter) => {
        const newFilters = filters.filter((f) => f.field !== filter.field)
        setFilters(newFilters)
        tableRef?.current.removeFilter(filter.field, '=', filter.value)
    }

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
                    <InputLabel id="simple-select-label">Campo a filtrar</InputLabel>
                    <Select
                        labelId="simple-select-label"
                        id="simple-select"
                        value={selectedField}
                        label="Campo a filtrar"
                        onChange={handleFieldChange}
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
                {selectedField !== 'Tipo de sala' && (
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
                {selectedField && selectedField === 'Tipo de sala' && (
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
                            {defaultRoomTypes.map((col) => (
                                <MenuItem key={col.title} value={col.field}>
                                    <ListItemText primary={col.title} />
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
                    <Button
                        key={filters[0].field}
                        variant="outlined"
                        endIcon={<Cancel />}
                        onClick={(e) => deleteFilter(filters[0])}
                    >
                        {filters[0].title}: {filters[0].value}
                    </Button>
                    {filters.slice(1).map((filter) => (
                        <Stack direction="row" alignItems="center" key={filter.field}>
                            {filter.logic ? filter.logic : ''}
                            <Button
                                variant="outlined"
                                endIcon={<Cancel />}
                                onClick={(e) => deleteFilter(filter)}
                                sx={{ ml: 1 }}
                            >
                                {filter.title}: {filter.value}
                            </Button>
                        </Stack>
                    ))}
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
