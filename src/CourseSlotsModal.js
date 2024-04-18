/**
 * @file SlotsClass
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
 * @module lib/replaceCourse
 */

import { atomModalSlotsClass } from './atoms/modalSlotsClass'
import { Autocomplete, Box, Button, FormControl, Modal, Stack, TextField, Typography } from '@mui/material'
import { atomSchedule } from './atoms/schedule'
import dayjs from 'dayjs'
import DurationOfLesson from './slotsModalComponents/DurationOfLesson'
import BeginningOfLesson from './slotsModalComponents/BeginingOfLesson'
import EndingOfLesson from './slotsModalComponents/EndingOfLesson'
import WeekDay from './slotsModalComponents/WeekDay'
import TimeOfDay from './slotsModalComponents/TimeOfDay'
import RoomFeatures from './slotsModalComponents/RoomFeatures'
import TargetDate from './slotsModalComponents/TargetDate'
import Rooms from './slotsModalComponents/Rooms'
import { getNextWeekDate, lookupSlots } from './lib/replaceCourse'
import SlotsTable from './SlotsTable'
import { atomRooms } from './atoms/rooms'
import { getDayOfTheWeek, parseDate } from './utils'
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
 * CourseSlotsModal component is responsible for managing the alocation of lessons for a given course.
 * It displays a modal with slots and rules for choosing lessons for a course.
 *
 * @returns {JSX.Element} The SlotsClass component.
 */
const CourseSlotsModal = ({ tableRef }) => {
    const { isOpen } = useAtomValue(atomModalSlotsClass)
    const schedule = useAtomValue(atomSchedule)
    const rooms = useAtomValue(atomRooms)
    const setValue = useSetAtom(atomModalSlotsClass)
    const courses = new Set()
    schedule.map((item) => courses.add(item['Unidade Curricular']))
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
        if (isOpen) {
            setRulesToInclude({
                data: 'mesmaSemana',
                dataInicio: dayjs().set('hour', 9).set('minute', 0).set('second', 0).set('millisecond', 0),
            })
        }
    }, [isOpen])

    const handleSubmit = (e) => {
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
                                {/* FIX */}
                                <Autocomplete
                                    // value={rulesToInclude?.unidadeCurricular}
                                    // disablePortal
                                    id="combo-box-demo"
                                    options={[...courses]}
                                    sx={{ width: 380 }}
                                    value={rulesToInclude?.unidadeCurricular}
                                    onChange={(event, newValue) => {
                                        setRulesToInclude({ ...rulesToInclude, unidadeCurricular: newValue })
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Unidade Curricular" required />
                                    )}
                                    // onChange={(e, value) => {
                                    //     console.log('🚀 ~ CourseSlotsModal ~ value:', value)
                                    //     setRulesToInclude({ ...rulesToInclude, unidadeCurricular: value })
                                    // }}
                                />
                            </FormControl>
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
                                        const slotsAsTableRows = selectedSlots.map((slot) => ({
                                            'Unidade Curricular': rulesToInclude.unidadeCurricular,
                                            'Data da aula': slot['Data da aula'],
                                            'Hora início da aula': slot['Hora início da aula'],
                                            'Hora fim da aula': slot['Hora fim da aula'],
                                            'Sala atribuída à aula': slot['Sala atribuída à aula'],
                                            'Dia da semana': getDayOfTheWeek(slot['Data da aula']),
                                            'Semana do ano': getWeek(parseDate(slot['Data da aula'])),
                                        }))
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
