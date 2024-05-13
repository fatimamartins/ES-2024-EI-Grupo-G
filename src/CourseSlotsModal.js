/**
 * @file CourseSlotsModal.js
 */

/**
 * External React library.
 * @external React
 * @see {@link https://reactjs.org/}
 */
import * as React from 'react'

/**
 * External jotai library.
 * @external jotai
 * @see {@link https://jotai.pmnd.rs/}
 */
import { useAtomValue, useSetAtom } from 'jotai'

/**
 * Module for managing modal slots class atoms.
 * @module ./atoms/modalSlotsClass
 */
import { atomModalSlotsClass } from './atoms/modalSlotsClass'

/**
 * Module for managing schedule atoms.
 * @module ./atoms/schedule
 */
import { atomSchedule } from './atoms/schedule'

/**
 * Module for managing room atoms.
 * @module ./atoms/rooms
 */
import { atomRooms } from './atoms/rooms'

/**
 * External MUI components for building UI.
 * @module @mui/material
 */
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material'

/**
 * External date manipulation library.
 * @module dayjs
 */
import dayjs from 'dayjs'

/**
 * Utility functions for slot management.
 * @module ./lib/replaceCourse
 */
import { getNextWeekDate, lookupSlots } from './lib/replaceCourse'
import { getDayOfTheWeek, parseDate } from './utils'

/**
 * External date-fns library for date manipulation.
 * @module date-fns
 */
import { getWeek } from 'date-fns'

/**
 * Custom components for slots modal.
 * @module ./slotsModalComponents
 */
import DurationOfLesson from './slotsModalComponents/DurationOfLesson'
import BeginningOfLesson from './slotsModalComponents/BeginingOfLesson'
import EndingOfLesson from './slotsModalComponents/EndingOfLesson'
import WeekDay from './slotsModalComponents/WeekDay'
import TimeOfDay from './slotsModalComponents/TimeOfDay'
import RoomFeatures from './slotsModalComponents/RoomFeatures'
import TargetDate from './slotsModalComponents/TargetDate'
import Rooms from './slotsModalComponents/Rooms'
import Shift from './slotsModalComponents/Shift'
import SlotsTable from './SlotsTable'

/**
 * A style object used for positioning a modal at the center of the screen.
 * @constant
 * @name style
 * @type {Object}
 * @property {string} position - The position property of the style object.
 * @property {string} top - The top property of the style object.
 * @description A style object used for positioning a modal at the center of the screen.
 */
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    height: 600,
    bgcolor: 'background.paper',
    boxShadow: 20,
    p: 4,
    overflow: 'scroll',
}

/**
 * CourseSlotsModal component is responsible for managing the allocation of lessons for a given course.
 * It displays a modal with slots and rules for choosing lessons for a course.
 * @param {object} props - Component props.
 * @param {React.Ref} props.tableRef - Ref for the SlotsTable component.
 * @returns {JSX.Element} The CourseSlotsModal component.
 */
const CourseSlotsModal = ({ tableRef }) => {
    const { isOpen } = useAtomValue(atomModalSlotsClass)
    const schedule = useAtomValue(atomSchedule)
    const rooms = useAtomValue(atomRooms)
    const setValue = useSetAtom(atomModalSlotsClass)
    const [courses, setCourses] = React.useState([])
    const [shifts, setShifts] = React.useState(null)
    const [rulesToInclude, setRulesToInclude] = React.useState(null)
    const [rulesToExclude, setRulesToExclude] = React.useState(null)
    const [slots, setSlots] = React.useState([]) // list of possible slots
    const [selectedSlots, setSelectedSlots] = React.useState([]) // list of selected slots for the course
    const handleCancel = () => {
        setValue({ isOpen: false, slots: [] })
        setRulesToInclude(null)
        setRulesToExclude(null)
        setSlots([])
        setSelectedSlots([])
    }

    React.useEffect(() => {
        if (schedule?.length > 0) {
            const set = new Set()
            schedule.map((item) => set.add(item['Unidade Curricular']))
            setCourses([...set])
        }
    }, [schedule, setCourses])

    React.useEffect(() => {
        // get shifts after choosing a course
        if (rulesToInclude?.unidadeCurricular) {
            const set = new Set()
            schedule.forEach((item) => {
                if (item['Unidade Curricular'] === rulesToInclude?.unidadeCurricular) set.add(item.Turno)
            })
            setShifts([...set])
        }
    }, [rulesToInclude?.unidadeCurricular, schedule])

    React.useEffect(() => {
        if (isOpen) {
            setRulesToInclude({
                data: 'mesmaSemana',
                dataInicio: dayjs().set('hour', 9).set('minute', 0).set('second', 0).set('millisecond', 0),
            })
        }
    }, [isOpen])

    const handleSubmit = (e) => {
        e.preventDefault()
        const newSlots = lookupSlots(rulesToInclude, rulesToExclude, schedule, rooms)
        setSlots(newSlots)
    }

    return (
        <div>
            <Modal
                open={isOpen}
                onClose={(event, reason) => {
                    // modal should not be closed by clicking outside the modal or pressing the escape key
                    if ((reason && reason === 'backdropClick') || reason === 'escapeKeyDown') return
                    setValue({ isOpen: false, slots: [] })
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit={handleSubmit}>
                        <h3>Slots para alocação de aulas de Unidade Curricular</h3>
                        <Stack direction="row" mt={4} mb={4}>
                            <FormControl sx={{ minWidth: 380 }}>
                                <InputLabel id="label">Unidade Curricular *</InputLabel>
                                <Select
                                    labelId="label"
                                    required
                                    id="select4"
                                    value={rulesToInclude?.unidadeCurricular || ''}
                                    label="Unidade Curricular *"
                                    onChange={(e) => {
                                        setRulesToInclude({ ...rulesToInclude, unidadeCurricular: e.target.value })
                                    }}
                                >
                                    {courses.map((course, index) => (
                                        <MenuItem key={index} value={course} name={course}>
                                            {course}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {rulesToInclude?.unidadeCurricular && shifts?.length > 0 && (
                                <Shift options={shifts} rules={rulesToInclude} setRules={setRulesToInclude} />
                            )}
                            <TextField
                                sx={{ width: 180, marginLeft: 2 }}
                                variant="outlined"
                                required
                                label="Número de aulas"
                                value={rulesToInclude?.numeroAulas || ''}
                                onChange={(e) => {
                                    setRulesToInclude({ ...rulesToInclude, numeroAulas: parseInt(e.target.value) })
                                }}
                            />
                            <DurationOfLesson rules={rulesToInclude} setRules={setRulesToInclude} />
                        </Stack>
                        <Typography mt={3} variant="subtitle2">
                            Excluir
                        </Typography>
                        <Stack direction="row" mt={1}>
                            <BeginningOfLesson rules={rulesToExclude} setRules={setRulesToExclude} />
                            <EndingOfLesson rules={rulesToExclude} setRules={setRulesToExclude} />
                            <WeekDay rules={rulesToExclude} setRules={setRulesToExclude} />
                            <TimeOfDay rules={rulesToExclude} setRules={setRulesToExclude} />
                        </Stack>
                        <Stack direction="row" mt={2}>
                            <Rooms rules={rulesToExclude} setRules={setRulesToExclude} />
                            <RoomFeatures rules={rulesToExclude} setRules={setRulesToExclude} left={2} />
                        </Stack>
                        <Typography variant="subtitle2" mt={4}>
                            Incluir
                        </Typography>
                        <Stack direction="row" mt={1}>
                            <Rooms rules={rulesToInclude} setRules={setRulesToInclude} />
                            <RoomFeatures rules={rulesToInclude} setRules={setRulesToInclude} />
                        </Stack>
                        <Typography variant="subtitle2" mt={4}>
                            Data pretendida para as aulas
                        </Typography>
                        <TargetDate
                            rules={rulesToInclude}
                            setRules={setRulesToInclude}
                            options={[
                                { value: 'umaEmCadaSemana', label: 'uma aula em cada semana' },
                                { value: 'mesmaSemana', label: 'na mesma semana' },
                                { value: 'outro', label: 'outro' },
                            ]}
                            defaultValue="umaEmCadaSemana"
                        />
                        <Stack direction="row" justifyContent="end" alignItems="center" mt={4}>
                            {slots.length === 0 && <Button onClick={handleCancel}>Cancelar</Button>}
                            {selectedSlots.length === 0 && (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{ marginLeft: '15px', width: '180px' }}
                                >
                                    Procurar slots
                                </Button>
                            )}
                        </Stack>
                        {(selectedSlots
                            ? slots.length > 0 && selectedSlots.length < rulesToInclude.numeroAulas
                            : slots.length > 0) && (
                            <div>
                                <Typography variant="subtitle2" mt={3}>
                                    Selecione a slot para a aula {selectedSlots.length + 1}/{rulesToInclude.numeroAulas}
                                </Typography>
                                <SlotsTable
                                    tableRef={tableRef}
                                    slots={slots}
                                    handleCancel={handleCancel}
                                    handleSelection={(selectedSlot) => {
                                        const aulasSelecionadas = [...selectedSlots, selectedSlot]
                                        setSelectedSlots(aulasSelecionadas)
                                        // if the user wants to select the slot with a week apart from the previous slot then we change the "dateInicio" of the rulesToInclude to the next week and use the algorithm to find the slots within the given week date
                                        const rulesToIncludeWithNewDate =
                                            rulesToInclude.data === 'umaEmCadaSemana'
                                                ? {
                                                      ...rulesToInclude,
                                                      dataInicio: getNextWeekDate(
                                                          selectedSlot['Data da aula'],
                                                          rulesToInclude.dataInicio.format('HH:mm:ss') // keep the time
                                                      ),
                                                  }
                                                : rulesToInclude
                                        // update the rulesToInclude with the new date
                                        setRulesToInclude(rulesToIncludeWithNewDate)
                                        // find the slots for the week with the new date
                                        const newSlots = lookupSlots(
                                            { ...rulesToIncludeWithNewDate, data: 'mesmaSemana' },
                                            { ...rulesToExclude, aulasSelecionadas },
                                            [...schedule, ...aulasSelecionadas],
                                            rooms
                                        )
                                        setSlots(newSlots)
                                    }}
                                    buttonTitle="Escolher slot"
                                />
                            </div>
                        )}
                        {selectedSlots.length > 0 && (
                            <Typography variant="subtitle2" mt={3} mb={3}>
                                Aulas selecionadas
                            </Typography>
                        )}
                        {selectedSlots.map((slot, index) => (
                            <Typography key={index} variant="subtitle2" mt={1}>
                                {slot['Data da aula']} - {slot['Hora início da aula']} - {slot['Hora fim da aula']}
                            </Typography>
                        ))}
                        {slots.length > 0 && selectedSlots.length === rulesToInclude?.numeroAulas && (
                            <Stack flexDirection="row" justifyContent="flex-end">
                                <Button onClick={handleCancel}>Cancelar</Button>
                                <Button
                                    onClick={() => {
                                        const appointment = schedule.find(
                                            (row) =>
                                                row['Unidade Curricular'] === rulesToInclude?.unidadeCurricular &&
                                                row.Turno === rulesToInclude?.turno
                                        )

                                        const slotsAsTableRows = selectedSlots.map((slot) => {
                                            const roomFeatures = schedule.find(
                                                (row) =>
                                                    row['Sala atribuída à aula'] === slot['Sala atribuída à aula'] &&
                                                    row['Características da sala pedida para a aula'] !==
                                                        'Não necessita de sala'
                                            )['Características da sala pedida para a aula']

                                            return {
                                                Curso: appointment.Curso,
                                                'Unidade Curricular': rulesToInclude.unidadeCurricular,
                                                Turno: rulesToInclude.turno,
                                                'Inscritos no turno': appointment['Inscritos no turno'],
                                                'Data da aula': slot['Data da aula'],
                                                'Hora início da aula': slot['Hora início da aula'],
                                                'Hora fim da aula': slot['Hora fim da aula'],
                                                'Características da sala pedida para a aula': roomFeatures,
                                                'Sala atribuída à aula': slot['Sala atribuída à aula'],
                                                'Dia da semana': getDayOfTheWeek(slot['Data da aula']),
                                                'Semana do ano': getWeek(parseDate(slot['Data da aula'])),
                                            }
                                        })
                                        tableRef.current.updateOrAddData(slotsAsTableRows)
                                        handleCancel()
                                    }}
                                    variant="contained"
                                    style={{ marginLeft: '15px', width: '180px' }}
                                >
                                    Inserir alterações
                                </Button>
                            </Stack>
                        )}
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

export default CourseSlotsModal
