/**
 * @file ReplaceCourse.js
 * This file contains the ReplaceCourse component of the application. This component is responsible for handling the replacement of a course in the application.
 */

/**
 * @external React
 * @see {@link https://reactjs.org/}
 */
import * as React from 'react'

/**
 * @external jotai
 * @see {@link https://jotai.pmnd.rs/}
 */
import { useAtomValue, useSetAtom } from 'jotai'

/**
 * @module atoms/modalReplaceCourse
 */
import { atomModalReplaceCourse } from './atoms/modalReplaceCourse'

/**
 * @external Box
 * @see {@link https://mui.com/api/box/}
 */
import Box from '@mui/material/Box'

/**
 * @external Button
 * @see {@link https://mui.com/api/button/}
 */
import Button from '@mui/material/Button'

/**
 * @external Typography
 * @see {@link https://mui.com/api/typography/}
 */
import Typography from '@mui/material/Typography'

/**
 * @external Modal
 * @see {@link https://mui.com/api/modal/}
 */
import Modal from '@mui/material/Modal'

/**
 * @external dayjs
 * @see {@link https://day.js.org/}
 */
import dayjs from 'dayjs'

/**
 * @module utils
 */
import {
    getCourseDurationToMilliseconds,
    getDayOfTheWeek,
    getFormattedDateTime,
    getSemesterWeek,
    isSameDate,
    parseDate,
} from './utils'

/**
 * @module atoms/schedule
 */
import { atomSchedule } from './atoms/schedule'

/**
 * @module lib/replaceCourse
 */
import { lookupSlots } from './lib/replaceCourse'
/**
 * @module atoms/rooms
 */
import { atomRooms } from './atoms/rooms'
/**
 * @module SlotsTable
 */
import SlotsTable from './SlotsTable'
/**
 * @module slotsModalComponents/BeginingOfLesson
 */
import BeginningOfLesson from './slotsModalComponents/BeginingOfLesson'
/**
 * @module slotsModalComponents/EndingOfLesson
 */
import EndingOfLesson from './slotsModalComponents/EndingOfLesson'
/**
 * @module slotsModalComponents/WeekDay
 */
import WeekDay from './slotsModalComponents/WeekDay'
/**
 * @module slotsModalComponents/TimeOfDay
 */
import TimeOfDay from './slotsModalComponents/TimeOfDay'
/**
 * @module slotsModalComponents/Rooms
 */
import Rooms from './slotsModalComponents/Rooms'
/**
 * @module slotsModalComponents/RoomFeatures
 */
import RoomFeatures from './slotsModalComponents/RoomFeatures'
/**
 * @module slotsModalComponents/DurationOfLesson
 */
import DurationOfLesson from './slotsModalComponents/DurationOfLesson'
/**
 * @module slotsModalComponents/TargetDate
 */
import TargetDate from './slotsModalComponents/TargetDate'
/**
 * @module @mui/material
 */
import { Stack } from '@mui/material'
/**
 * @module date-fns
 */
import { getWeek } from 'date-fns'

/**
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
 * `ReplaceCourse` is a React functional component used to replace a course in a schedule.
 *
 * @component
 * @param {Object} props - The properties that define the `ReplaceCourse` component.
 * @param {Object} props.tableRef - A reference to a table in the parent component.
 *
 * @returns {React.Element} A React element that represents a form inside a modal for replacing a course.
 */
const ReplaceCourse = ({ tableRef }) => {
    /**
     * @type {Object} schedule
     * @type {Object} rooms
     * @type {Object} selectedCourse
     * @type {Function} setOpen
     * @type {Array} rulesToInclude
     * @type {Array} rulesToExclude
     * @type {Array} slots
     * @type {String} formattedDateTime
     */
    const schedule = useAtomValue(atomSchedule)
    const rooms = useAtomValue(atomRooms)
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
                duracao: getCourseDurationToMilliseconds(
                    selectedCourse['Hora início da aula'],
                    selectedCourse['Hora fim da aula']
                ),
                salas: [selectedCourse['Sala atribuída à aula']],
                data: 'mesmoDia',
                dataInicio: dayjs(formattedDateTime, { timeZone: 'GMT' }),
            })
        }
    }, [formattedDateTime, rulesToInclude, selectedCourse])

    const handleCancel = () => {
        setOpen(null)
        setRulesToInclude(null)
        setRulesToExclude(null)
        setSlots([])
    }

    /**
     * @function
     * @name updateTable
     * @description This function updates the table with the selected slot's details. If the room is different, it gets the features of the new room. If the date is the same, it updates the row with the new slot's details. If the date is different, it updates the row with the new slot's details and additional information. After updating, it calls the handleCancel function.
     * @param {Object} selectedSlot - The selected slot to replace a course.
     *
     * @property {string} roomFeatures - The features of the room. If the room is different, it gets the features of the new room.
     * @property {Function} handleCancel - A function that resets the states and closes the modal.
     */
    const updateTable = (selectedSlot) => {
        const roomFeatures = // if room is different, get the features of the new room
            selectedSlot['Sala atribuída à aula'] !== selectedCourse['Sala atribuída à aula']
                ? schedule.find(
                      (row) =>
                          row['Sala atribuída à aula'] === selectedSlot['Sala atribuída à aula'] &&
                          row['Características da sala pedida para a aula'] !== 'Não necessita de sala'
                  )['Características da sala pedida para a aula']
                : selectedCourse['Características da sala pedida para a aula']

        if (isSameDate(selectedCourse['Data da aula'], selectedSlot['Data da aula'])) {
            tableRef.current.updateRow(selectedCourse.id, {
                'Data da aula': selectedSlot['Data da aula'],
                'Hora início da aula': selectedSlot['Hora início da aula'],
                'Hora fim da aula': selectedSlot['Hora fim da aula'],
                'Características da sala pedida para a aula': roomFeatures,
                'Sala atribuída à aula': selectedSlot['Sala atribuída à aula'],
            })
        } else {
            tableRef.current.updateRow(selectedCourse.id, {
                'Data da aula': selectedSlot['Data da aula'],
                'Hora início da aula': selectedSlot['Hora início da aula'],
                'Hora fim da aula': selectedSlot['Hora fim da aula'],
                'Características da sala pedida para a aula': roomFeatures,
                'Sala atribuída à aula': selectedSlot['Sala atribuída à aula'],
                'Dia da semana': getDayOfTheWeek(selectedSlot['Data da aula']),
                'Semana do ano': getWeek(parseDate(selectedSlot['Data da aula'])),
                'Semana do semestre': getSemesterWeek(
                    selectedCourse['Data da aula'],
                    selectedCourse['Semana do semestre'],
                    selectedSlot['Data da aula']
                ),
            })
        }
        handleCancel()
    }

    /**
     * @function
     * @name handleSubmit
     * @description This function handles form submission. It prevents the default form submission event, looks up slots based on the rules, and sets the slots state.
     * @param {Event} e - The form submission event.
     *
     * @property {Array} slots - The slots to replace a course.
     * @property {Function} setSlots - A function that sets the slots state.
     */
    const handleSubmit = (e) => {
        e.preventDefault()
        const slots = lookupSlots(rulesToInclude, rulesToExclude, schedule, rooms, selectedCourse.id)
        setSlots(slots)
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
                    <form onSubmit={handleSubmit}>
                        <h3>Slots para alocação de uma aula de substituição</h3>
                        <Typography variant="body1" color="primary" mb={2} mt={1}>
                            Regras de alocação de uma aula de substituição
                        </Typography>
                        <Typography variant="subtitle2">Excluir</Typography>
                        <Stack direction="row" mt={2} mb={2}>
                            <BeginningOfLesson rules={rulesToExclude} setRules={setRulesToExclude} />
                            <EndingOfLesson rules={rulesToExclude} setRules={setRulesToExclude} />
                            <WeekDay rules={rulesToExclude} setRules={setRulesToExclude} />
                            <TimeOfDay rules={rulesToExclude} setRules={setRulesToExclude} />
                        </Stack>
                        <Rooms rules={rulesToExclude} setRules={setRulesToExclude} />
                        <Typography variant="subtitle2" mt={3}>
                            Incluir
                        </Typography>
                        <Stack direction="row" mt={2}>
                            <Rooms rules={rulesToInclude} setRules={setRulesToInclude} />
                            <RoomFeatures rules={rulesToInclude} setRules={setRulesToInclude} />
                            <DurationOfLesson rules={rulesToInclude} setRules={setRulesToInclude} />
                        </Stack>
                        <Typography variant="subtitle2" mt={3}>
                            Data pretendida para substituição
                        </Typography>
                        <TargetDate
                            rules={rulesToInclude}
                            setRules={setRulesToInclude}
                            options={[
                                { value: 'mesmoDia', label: 'no mesmo dia' },
                                { value: 'mesmaSemana', label: 'na mesma semana' },
                                { value: 'outro', label: 'outro' },
                            ]}
                            defaultValue="mesmoDia"
                        />
                        <Stack direction="row" justifyContent="end" alignItems="center" mt={4}>
                            {slots.length === 0 && <Button onClick={handleCancel}>Cancelar</Button>}
                            <Button type="submit" variant="contained" style={{ marginLeft: '15px', width: '180px' }}>
                                Procurar slots
                            </Button>
                        </Stack>
                        {slots.length > 0 && (
                            <SlotsTable
                                tableRef={tableRef}
                                selectedCourse={selectedCourse}
                                slots={slots}
                                handleCancel={handleCancel}
                                handleSelection={(selectedSlot) => updateTable(selectedSlot)}
                                buttonTitle="Inserir alterações"
                                top={20}
                            />
                        )}
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

/**
 * Represents a class for replacing a course.
 * @class
 * @exports ReplaceCourse
 */
export default ReplaceCourse
