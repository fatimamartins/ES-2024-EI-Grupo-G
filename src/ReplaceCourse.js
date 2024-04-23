/**
 * @file ReplaceCourse
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
 * @external Checkbox
 * @see {@link https://mui.com/api/checkbox/}
 */
/**
 * @external FormControlLabel
 * @see {@link https://mui.com/api/form-control-label/}
 */
/**
 * @external ListItemText
 * @see {@link https://mui.com/api/list-item-text/}
 */
/**
 * @external Radio
 * @see {@link https://mui.com/api/radio/}
 */
/**
 * @external RadioGroup
 * @see {@link https://mui.com/api/radio-group/}
 */

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
import { atomRooms } from './atoms/rooms'
import SlotsTable from './SlotsTable'
import BeginningOfLesson from './slotsModalComponents/BeginingOfLesson'
import EndingOfLesson from './slotsModalComponents/EndingOfLesson'
import WeekDay from './slotsModalComponents/WeekDay'
import TimeOfDay from './slotsModalComponents/TimeOfDay'
import Rooms from './slotsModalComponents/Rooms'
import RoomFeatures from './slotsModalComponents/RoomFeatures'
import DurationOfLesson from './slotsModalComponents/DurationOfLesson'
import TargetDate from './slotsModalComponents/TargetDate'
import { Stack } from '@mui/material'
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
 * ReplaceCourse component is responsible for managing the replacement of a course.
 * It displays a modal with slots and rules for replacing a course.
 *
 * @returns {JSX.Element} The ReplaceCourse component.
 */
const ReplaceCourse = ({ tableRef }) => {
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

    const updateTable = (selectedSlot) => {
        if (isSameDate(selectedCourse['Data da aula'], selectedSlot['Data da aula'])) {
            tableRef.current.updateRow(selectedCourse.id, {
                'Data da aula': selectedSlot['Data da aula'],
                'Hora início da aula': selectedSlot['Hora início da aula'],
                'Hora fim da aula': selectedSlot['Hora fim da aula'],
                'Sala atribuída à aula': selectedSlot['Sala atribuída à aula'],
            })
        } else {
            tableRef.current.updateRow(selectedCourse.id, {
                'Data da aula': selectedSlot['Data da aula'],
                'Hora início da aula': selectedSlot['Hora início da aula'],
                'Hora fim da aula': selectedSlot['Hora fim da aula'],
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
