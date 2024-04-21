/**
 * @file This is a component for a table using react-tabulator.
 */

/** @module react */
import React from 'react'
/** @module react-dom */
import { renderToString } from 'react-dom/server'
/** @module react-tabulator */
import { ReactTabulator } from 'react-tabulator'
/**
 * Utility functions for manipulating and sorting dates.
 * @module utils
 */
import { addSemesterWeekNumber, addWeekNumber, sortWeekDays } from './utils'
/**
 * Custom multiple select component.
 * @module MultipleSelectCheckmarks
 */
import MultipleSelectCheckmarks from './MultipleSelectCheckmarks'
/** @module @mui/material */
import { Button, Stack, Tooltip } from '@mui/material'
/**
 * Custom schedule table filter component.
 * @module ScheduleTableFilter
 */
import ScheduleTableFilter from './ScheduleTableFilter'
/**
 * @module jotai
 * Jotai is a primitive and flexible state management library for React.
 * Here, the useAtomValue and useSetAtom hooks are imported for use in the application.
 */
import { useAtomValue, useSetAtom } from 'jotai'
/**
 * @module atoms/modalReplaceCourse
 * This module exports the atomModalReplaceCourse atom, which is used for managing the state of the modal for replacing a course in the application.
 */
import { atomModalReplaceCourse } from './atoms/modalReplaceCourse'
/**
 * @module @mui/icons-material/FindReplace
 * Material-UI Icons is a set of pre-designed icons following Material Design guidelines.
 * Here, the FindReplace icon is imported for use in the application.
 */
import FindReplaceIcon from '@mui/icons-material/FindReplace'
/**
 * @module constants
 * This module exports constants used throughout the application.
 * Here, ROOM_FEATURES and ROOMS are imported for use in the application.
 */
import { ROOM_FEATURES, ROOMS } from './constants'
/**
 * @module atoms/schedule
 * This module exports the atomSchedule atom, which is used for managing the state of the schedule in the application.
 */
import { atomSchedule } from './atoms/schedule'
import ReplaceCourse from './ReplaceCourse'
import { atomRooms } from './atoms/rooms'
import { atomModalSlotsClass } from './atoms/modalSlotsClass'
import CourseSlotsModal from './CourseSlotsModal'
import AddIcon from '@mui/icons-material/Add'

/**
 * This is the ScheduleTable component of the application.
 * It displays a table of schedules with various properties.
 *
 * @function
 * @name ScheduleTable
 * @param {Object} props - The properties passed to the component.
 * @param {Object[]} props.data - The data to display in the table.
 * @returns {JSX.Element} The rendered ScheduleTable component.
 */
export default function ScheduleTable() {
    const defaultData = useAtomValue(atomSchedule)
    const dataWithWeekAndSemesterNumber = addSemesterWeekNumber(addWeekNumber(defaultData))
    const rooms = useAtomValue(atomRooms)
    const tableRef = React.useRef(null)
    const setOpen = useSetAtom(atomModalReplaceCourse) // function to open/close the modal with the rules to replace a course
    const setModalSlotsToOpen = useSetAtom(atomModalSlotsClass)

    /**
     * @constant {Object[]} defaultColumns - The default columns for the table.
     */
    const columns = [
        {
            field: 'Substituir',
            formatter: (cell, formatterParams, onRendered) => {
                return renderToString(<FindReplaceIcon style={{ fill: '#1976d2' }} />)
            },
            width: 30,
            cellClick: function (e, cell) {
                if (rooms.length === 0) {
                    window.alert('Carregue o ficheiro de salas')
                } else {
                    setOpen(cell.getRow().getData())
                }
            },
        },
        {
            title: 'Curso',
            field: 'Curso',
            hozAlign: 'left',
            sorter: 'string',
            visible: true,
            editor: 'list',
            width: 82,
            editorParams: {
                valuesLookup: true,
                valuesLookupField: 'Curso',
            },
        },
        {
            title: 'UC',
            field: 'Unidade Curricular',
            hozAlign: 'left',
            sorter: 'string',
            visible: true,
            width: 62,
            editor: 'list',
            editorParams: {
                valuesLookup: true,
                valuesLookupField: 'Unidade Curricular',
            },
        },
        {
            title: 'Turno',
            field: 'Turno',
            hozAlign: 'left',
            sorter: 'string',
            visible: true,
            width: 82,
            editor: 'list',
            editorParams: {
                valuesLookup: true,
                valuesLookupField: 'Turno',
            },
        },
        {
            title: 'Turma',
            field: 'Turma',
            hozAlign: 'left',
            sorter: 'string',
            visible: true,
            width: 87,
            editor: 'list',
            editorParams: {
                valuesLookup: true,
                valuesLookupField: 'Turma',
            },
        },
        {
            title: 'Inscritos',
            field: 'Inscritos no turno',
            hozAlign: 'left',
            sorter: 'number',
            visible: true,
            width: 102,
            editor: 'number',
        },
        {
            title: 'Dia',
            field: 'Dia da semana',
            hozAlign: 'left',
            width: 64,
            sorter: function (a, b) {
                return sortWeekDays(a, b)
            },
            visible: true,
            editor: 'list',
            editorParams: {
                values: { Seg: 'Seg', Ter: 'Ter', Qua: 'Qua', Qui: 'Qui', Sex: 'Sex', Sáb: 'Sáb' },
                clearable: true,
            },
        },
        {
            title: 'Início',
            field: 'Hora início da aula',
            hozAlign: 'left',
            visible: true,
            editor: 'time',
            width: 79,
            editorParams: {
                format: 'HH:mm:ss',
            },
        },
        {
            title: 'Fim',
            field: 'Hora fim da aula',
            hozAlign: 'left',
            visible: true,
            width: 66,
            editor: 'time',
            editorParams: {
                format: 'HH:mm:ss',
            },
        },
        {
            title: 'Data',
            field: 'Data da aula',
            hozAlign: 'left',
            sorter: 'date',
            visible: true,
            width: 75,
            editor: 'date',
            editorParams: {
                format: 'dd/MM/yyyy',
            },
        },
        {
            title: 'Características',
            field: 'Características da sala pedida para a aula',
            hozAlign: 'left',
            sorter: 'string',
            visible: true,
            width: 147,
            editor: 'list',
            editorParams: {
                values: ROOM_FEATURES,
            },
            validator: function (cell, value) {
                if (value && value.trim() === '' && cell.getInitialValue() === '') {
                    return false
                } else {
                    return true
                }
            },
            mutator: function (value, data, type, params, component) {
                if (value && value.trim() === '' && type === 'edit') {
                    return component.getInitialValue()
                } else {
                    return value
                }
            },
        },
        {
            title: 'Sala ',
            field: 'Sala atribuída à aula',
            hozAlign: 'left',
            sorter: 'string',
            visible: true,
            width: 75,
            editor: 'list',
            editorParams: {
                values: ROOMS,
            },
            validator: function (cell, value) {
                if (value && value.trim() === '' && cell.getInitialValue() === '') {
                    return false
                } else {
                    return true
                }
            },
            mutator: function (value, data, type, params, component) {
                if (value && value.trim() === '' && type === 'edit') {
                    return component.getInitialValue()
                } else {
                    return value
                }
            },
        },
        {
            title: 'Sem. ano',
            field: 'Semana do ano',
            hozAlign: 'left',
            sorter: 'number',
            visible: true,
            editor: 'number',
            width: 112,
        },
        {
            title: 'Sem. semestre',
            field: 'Semana do semestre',
            hozAlign: 'left',
            sorter: 'number',
            visible: true,
            editor: 'number',
        },
    ]

    return (
        <div>
            <ScheduleTableFilter tableRef={tableRef} />
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center" mb={2}>
                <MultipleSelectCheckmarks tableRef={tableRef} />
                <Tooltip
                    title={
                        defaultData.length === 0 || rooms.length === 0
                            ? 'Verifique se os ficheiros salas e horario estão carregados'
                            : ''
                    }
                >
                    <span>
                        <Button
                            variant="contained"
                            id="slots-uc"
                            disabled={defaultData.length === 0 || rooms.length === 0}
                            onClick={() => setModalSlotsToOpen({ isOpen: true, slots: [] })}
                            style={defaultData.length === 0 || rooms.length === 0 ? { pointerEvents: 'none' } : {}}
                            startIcon={<AddIcon />}
                        >
                            Aulas UC
                        </Button>
                    </span>
                </Tooltip>
            </Stack>
            <ReactTabulator
                onRef={(r) => (tableRef.current = r.current)}
                data={dataWithWeekAndSemesterNumber}
                columns={columns}
                options={{
                    pagination: 'local',
                    paginationSize: 10,
                    paginationSizeSelector: [6, 10, 15, 20],
                    movableColumns: true,
                    paginationCounter: 'rows',
                    layout: 'fitColumns',
                    selectable: true,
                }}
                events={{
                    rowClick: function (e, row) {
                        row.toggleSelect()
                    },
                    rowUpdated: function (row) {
                        row.toggleSelect()
                    },
                    rowAdded: function (row) {
                        row.toggleSelect()
                    },
                }}
            />
            <ReplaceCourse tableRef={tableRef} />
            <CourseSlotsModal tableRef={tableRef} />
            <Stack direction={'row'} mt={2} mb={5} justifyContent={'flex-end'}>
                <Button
                    variant="text"
                    id="download-csv"
                    onClick={() => tableRef?.current.download('csv', 'horario.csv', { delimiter: ';', bom: true })}
                >
                    Download CSV
                </Button>
                <Button
                    variant="text"
                    id="download-json"
                    onClick={() => tableRef?.current.download('json', 'horario.json')}
                >
                    Download JSON
                </Button>
            </Stack>
        </div>
    )
}
