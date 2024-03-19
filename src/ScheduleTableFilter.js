import React from 'react'
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

const defaultTypeOfFilterComparison = ['=', '!=', 'like', 'starts', 'ends', '<', '>', '<=', '>=']

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

export default function MultipleSelectCheckmarks({ tableRef }) {
    const [selectedField, setSelectedField] = React.useState('')
    const [value, setValue] = React.useState('')
    const [logicOperator, setLogicOperator] = React.useState('AND')
    const [type, setType] = React.useState('=') //type of filter comparison. Example: =, <, >, <=, >=, !=  like starts ends
    const [filters, setFilters] = React.useState([])
    const [tabulatorFilter, setTabulatorFilter] = React.useState([])

    const addFilter = () => {
        setFilters([
            ...filters,
            {
                title: selectedField,
                field: selectedField,
                value: value,
                logic: logicOperator,
                type: type,
            },
        ])
        const newFilter = { field: selectedField, type: type, value: value }
        tableRef?.current.setFilter([newFilter])
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
                        {defaultFilterFields.map((col) => {
                            return (
                                <MenuItem key={col.title} value={col.field}>
                                    <ListItemText primary={col.title} />
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
                    onChange={(event) => {
                        setValue(event.target.value)
                    }}
                />
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
        </div>
    )
}
