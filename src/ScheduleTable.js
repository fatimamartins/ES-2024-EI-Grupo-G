/**
 * @file This is a component for a table using react-tabulator.
 */

/** @module react */
import React from 'react'
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
import { Button, Stack } from '@mui/material'
/**
 * Custom schedule table filter component.
 * @module ScheduleTableFilter
 */
import ScheduleTableFilter from './ScheduleTableFilter'
import { useAtomValue, useSetAtom } from 'jotai'
import { atomModalReplaceCourse } from './atoms/modalReplaceCourse'
import FindReplaceIcon from '@mui/icons-material/FindReplace'
import { ROOM_FEATURES, ROOMS } from './constants'
import { atomSchedule } from './atoms/schedule'

/**
 * @constant {Object[]} defaultColumns - The default columns for the table.
 */
const defaultColumns = [
    {
        field: 'Substituir',
        formatter: (cell, formatterParams, onRendered) => {
            return renderToString(<FindReplaceIcon id="substituirAula" style={{ fill: '#1976d2' }} />)
        },
        width: 10,
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
            if (value.trim() === '' && cell.getInitialValue() === '') {
                return false
            } else {
                return true
            }
        },
        mutator: function (value, data, type, params, component) {
            if (value.trim() === '' && type === 'edit') {
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
            if (value.trim() === '' && cell.getInitialValue() === '') {
                return false
            } else {
                return true
            }
        },
        mutator: function (value, data, type, params, component) {
            if (value.trim() === '' && type === 'edit') {
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
    const [columns] = React.useState(defaultColumns)
    const tableRef = React.useRef(null)
    const setOpen = useSetAtom(atomModalReplaceCourse) // function to open/close the modal with the rules to replace a course

    return (
        <div>
            <MultipleSelectCheckmarks tableRef={tableRef} />
            <ScheduleTableFilter tableRef={tableRef} />
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
                }}
                events={{
                    rowClick: (e, row) => {
                        const className = e.target.getAttribute('id')
                        if (className === 'substituirAula') {
                            setOpen(row.getData())
                        }
                    },
                }}
            />
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
