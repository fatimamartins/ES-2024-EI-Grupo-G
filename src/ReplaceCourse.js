import * as React from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { atomModalReplaceCourse } from './atoms/modalReplaceCourse'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Checkbox, FormControlLabel, ListItemText, Radio, RadioGroup, Stack } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import dayjs from 'dayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { COURSE_END_TIMES, COURSE_START_TIMES, DAY_PERIODS, ROOMS, ROOM_FEATURES, WEEKDAYS } from './constants'
import { getFormattedDateTime } from './utils'
import { atomSchedule } from './atoms/schedule'
import { lookupSlots } from './lib/replaceCourse'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    boxShadow: 20,
    p: 4,
}

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

const ReplaceCourse = () => {
    const schedule = useAtomValue(atomSchedule)
    const selectedCourse = useAtomValue(atomModalReplaceCourse)
    const setOpen = useSetAtom(atomModalReplaceCourse) // function to open/close the modal with the rules to replace a course
    const [rulesToInclude, setRulesToInclude] = React.useState(null) // rules to replace a course
    const [rulesToExclude, setRulesToExclude] = React.useState(null)
    const [slots, setSlots] = React.useState([]) // slots to replace a course
    const formattedDateTime = getFormattedDateTime(
        selectedCourse?.['Data da aula'],
        selectedCourse?.['Hora início da aula'],
        "yyyy-MM-dd'T'HH:mm"
    )
    React.useEffect(() => {
        if (rulesToInclude === null && selectedCourse) {
            setRulesToInclude({
                curso: selectedCourse.Curso,
                turma: selectedCourse.Turma,
            })
        }

        if (formattedDateTime && !rulesToInclude?.dataInicio) {
            setRulesToInclude((old) => ({
                ...old,
                dataInicio: dayjs(formattedDateTime, { timeZone: 'GMT' }),
                dataFim: dayjs(formattedDateTime, { timeZone: 'GMT' }),
            }))
        }
    }, [formattedDateTime, rulesToInclude, selectedCourse])

    const handleCancel = () => {
        setOpen(null)
        setRulesToInclude(null)
        setRulesToExclude(null)
        setSlots([])
    }

    return (
        <div>
            <Modal
                open={selectedCourse !== null}
                onClose={(event, reason) => {
                    // modal should not be closed by clicking outside the modal or pressing the escape key
                    if ((reason && reason === 'backdropClick') || reason === 'escapeKeyDown') return
                    setOpen(null)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h3>Slots para alocação de uma aula de substituição</h3>
                    <Typography variant="body1" color="primary" mb={2} mt={1}>
                        Regras de alocação de uma aula de substituição
                    </Typography>
                    <Typography variant="subtitle2">Excluir</Typography>
                    <Stack direction="row" mt={2}>
                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel id="simple-select-label1">Início aula</InputLabel>
                            <Select
                                labelId="simple-select-label1"
                                id="simple-select1"
                                value={rulesToExclude?.['Hora início da aula'] || ''}
                                label="Início aula"
                                onChange={(e) => {
                                    setRulesToExclude({ ...rulesToExclude, 'Hora início da aula': e.target.value })
                                }}
                            >
                                {COURSE_START_TIMES.map((period, index) => (
                                    <MenuItem key={index} value={period}>
                                        {period}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 150, marginLeft: 2 }}>
                            <InputLabel id="simple-select-label2">Fim aula</InputLabel>
                            <Select
                                labelId="simple-select-label2"
                                id="simple-select2"
                                value={rulesToExclude?.['Hora fim da aula'] || ''}
                                label="Fim aula"
                                onChange={(e) => {
                                    setRulesToExclude({ ...rulesToExclude, 'Hora fim da aula': e.target.value })
                                }}
                            >
                                {COURSE_END_TIMES.map((period, index) => (
                                    <MenuItem key={index} value={period}>
                                        {period}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 150, marginLeft: 2 }}>
                            <InputLabel id="simple-select-label3">Dia da semana</InputLabel>
                            <Select
                                labelId="simple-select-label3"
                                id="simple-select3"
                                value={rulesToExclude?.diaDaSemana || ''}
                                label="Dia da semana"
                                onChange={(e) => {
                                    setRulesToExclude({ ...rulesToExclude, diaDaSemana: e.target.value })
                                }}
                            >
                                {WEEKDAYS.map((day, index) => (
                                    <MenuItem key={index} value={day}>
                                        {day}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 150, marginLeft: 2 }}>
                            <InputLabel id="simple-select-label4">Período dia</InputLabel>
                            <Select
                                labelId="simple-select-label4"
                                id="simple-select4"
                                value={rulesToExclude?.turno || ''}
                                label="Período dia"
                                onChange={(e) => {
                                    setRulesToExclude({ ...rulesToExclude, turno: e.target.value })
                                }}
                            >
                                {DAY_PERIODS.map((turno, index) => (
                                    <MenuItem key={index} value={turno}>
                                        {turno}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: 350, marginLeft: 2 }}>
                            <InputLabel id="multiple-checkbox-label1">Salas</InputLabel>
                            <Select
                                labelId="multiple-checkbox-label1"
                                id="multiple-checkbox1"
                                multiple
                                value={rulesToExclude?.salas || []}
                                onChange={(e) => {
                                    setRulesToExclude({ ...rulesToExclude, salas: e.target.value })
                                }}
                                label="Salas"
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {ROOMS.map((room, index) => (
                                    <MenuItem key={index} value={room}>
                                        <Checkbox checked={rulesToExclude?.salas?.indexOf(room) > -1} />
                                        <ListItemText primary={room} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                    <Typography variant="subtitle2" mt={3}>
                        Incluir
                    </Typography>
                    <Stack direction="row" mt={2}>
                        <FormControl sx={{ width: 350 }}>
                            <InputLabel id="multiple-checkbox-label2">Salas</InputLabel>
                            <Select
                                labelId="multiple-checkbox-label2"
                                id="multiple-checkbox2"
                                multiple
                                value={rulesToInclude?.salas || []}
                                onChange={(e) => {
                                    setRulesToInclude({ ...rulesToInclude, salas: e.target.value })
                                }}
                                label="Salas"
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {ROOMS.map((room) => (
                                    <MenuItem key={room} value={room}>
                                        <Checkbox checked={rulesToInclude?.salas?.indexOf(room) > -1} />
                                        <ListItemText primary={room} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: 350, marginLeft: 2 }}>
                            <InputLabel id="multiple-checkbox-label3">Características</InputLabel>
                            <Select
                                labelId="multiple-checkbox-label3"
                                id="multiple-checkbox3"
                                multiple
                                value={rulesToInclude?.caracteristicas || []}
                                onChange={(e) => {
                                    setRulesToInclude({ ...rulesToInclude, caracteristicas: e.target.value })
                                }}
                                label="Características"
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {ROOM_FEATURES.map((feature) => (
                                    <MenuItem key={feature} value={feature}>
                                        <Checkbox checked={rulesToInclude?.caracteristicas?.indexOf(feature) > -1} />
                                        <ListItemText primary={feature} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                    <FormControl>
                        <Typography variant="subtitle2" mt={3}>
                            Data pretendida para substituição
                        </Typography>
                        <RadioGroup
                            row
                            aria-labelledby="radio-buttons-group-label"
                            name="radio-buttons-group"
                            defaultValue={'nenhuma'}
                            onChange={(e) => {
                                setRulesToInclude({
                                    ...rulesToInclude,
                                    data: {
                                        label: e.target.value,
                                        value: dayjs(formattedDateTime, { timeZone: 'GMT' }),
                                    },
                                })
                            }}
                        >
                            <FormControlLabel value="nenhuma" control={<Radio />} label="nenhuma" />
                            <FormControlLabel value="mesmoDia" control={<Radio />} label="no mesmo dia" />
                            <FormControlLabel value="mesmaSemana" control={<Radio />} label="na mesma semana" />
                            <FormControlLabel value="outro" control={<Radio />} label="outro" />
                        </RadioGroup>
                    </FormControl>
                    {rulesToInclude?.data?.label === 'outro' && (
                        <Stack direction="row">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker']} sx={{ width: 350 }}>
                                    <DateTimePicker
                                        label="Início"
                                        format="DD-MM-YYYY HH:mm"
                                        views={['day', 'month', 'year', 'hours', 'minutes']}
                                        value={
                                            rulesToInclude?.dataInicio || dayjs(formattedDateTime, { timeZone: 'GMT' })
                                        }
                                        onChange={(e) => {
                                            setRulesToInclude({ ...rulesToInclude, dataInicio: e })
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
                                        value={rulesToInclude?.dataFim || dayjs(formattedDateTime, { timeZone: 'GMT' })}
                                        onChange={(e) => setRulesToInclude({ ...rulesToInclude, dataFim: e })}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Stack>
                    )}
                    <Stack direction="row" justifyContent="end" mt={4}>
                        {slots.length === 0 && <Button onClick={handleCancel}>Cancelar</Button>}
                        <Button
                            variant="contained"
                            style={{ marginLeft: '15px', width: '180px' }}
                            onClick={() => {
                                const slots = lookupSlots(rulesToInclude, rulesToExclude, schedule)
                                setSlots(slots)
                            }}
                        >
                            Procurar slots
                        </Button>
                    </Stack>
                    {slots.length > 0 && (
                        // Inserir aqui tabela com slots: slots.map().....
                        <Stack direction="row" justifyContent="end" mt={4}>
                            <Button onClick={handleCancel}>Cancelar</Button>
                            <Button variant="contained" style={{ marginLeft: '15px', width: '180px' }}>
                                Inserir alterações
                            </Button>
                        </Stack>
                    )}
                </Box>
            </Modal>
        </div>
    )
}

export default ReplaceCourse
