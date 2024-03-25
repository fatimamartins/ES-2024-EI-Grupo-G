/**
 * @file This is a component for a table using react-tabulator.
 */

/** @module react */
import React from 'react'
/** @module react-tabulator */
import { ReactTabulator } from 'react-tabulator'
import { addSemesterWeekNumber, addWeekNumber, sortWeekDays } from './utils'
import MultipleSelectCheckmarks from './MultipleSelectCheckmarks'
/** @module @mui/material */
import { Button, Stack } from '@mui/material'
import ScheduleTableFilter from './ScheduleTableFilter'
import { useSetAtom } from 'jotai'
import { atomModalReplaceCourse } from './atoms/modalReplaceCourse'

/**
 * @constant {Object[]} defaultColumns - The default columns for the table.
 */
const defaultColumns = [
    {
        title: 'Curso',
        field: 'Curso',
        hozAlign: 'left',
        sorter: 'string',
        visible: true,
        editor: 'list',
        editorParams: {
            valuesLookup: true,
            valuesLookupField: 'Curso',
        },
    },
    {
        title: 'Unidade Curricular',
        field: 'Unidade Curricular',
        hozAlign: 'left',
        sorter: 'string',
        visible: true,
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
        editor: 'list',
        editorParams: {
            valuesLookup: true,
            valuesLookupField: 'Turma',
        },
    },
    {
        title: 'Inscritos no turno',
        field: 'Inscritos no turno',
        hozAlign: 'left',
        sorter: 'number',
        visible: true,
        editor: 'number',
    },
    {
        title: 'Dia da semana',
        field: 'Dia da semana',
        hozAlign: 'left',
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
        title: 'Hora início da aula',
        field: 'Hora início da aula',
        hozAlign: 'left',
        visible: true,
        editor: 'time',
        editorParams: {
            format: 'HH:mm:ss',
        },
    },
    {
        title: 'Hora fim da aula',
        field: 'Hora fim da aula',
        hozAlign: 'left',
        visible: true,
        editor: 'time',
        editorParams: {
            format: 'HH:mm:ss',
        },
    },
    {
        title: 'Data da aula',
        field: 'Data da aula',
        hozAlign: 'left',
        sorter: 'date',
        visible: true,
        editor: 'date',
        editorParams: {
            format: 'dd/MM/yyyy',
        },
    },
    {
        title: 'Características da sala pedida para a aula',
        field: 'Características da sala pedida para a aula',
        hozAlign: 'left',
        sorter: 'string',
        visible: true,
    },
    {
        title: 'Sala atribuída à aula',
        field: 'Sala atribuída à aula',
        hozAlign: 'left',
        sorter: 'string',
        visible: true,
    },
    {
        title: 'Semana do ano',
        field: 'Semana do ano',
        hozAlign: 'left',
        sorter: 'number',
        visible: true,
        editor: 'number',
    },
    {
        title: 'Semana do semestre',
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
export default function ScheduleTable({ defaultData, salas }) {
    const dataWithWeekAndSemesterNumber = addSemesterWeekNumber(addWeekNumber(defaultData))
    const [columns, setColumns] = React.useState(defaultColumns)
    const tableRef = React.useRef(null)
    const setOpen = useSetAtom(atomModalReplaceCourse) // function to open the modal with the rules to replace a course

    React.useEffect(() => {
        if (salas.length > 0) {
            const listaSalas = [...new Set(salas.map((sala) => sala['Nome sala']))]
            const listaCaracteristicasSalas = [...Object.keys(salas[0]).slice(5), 'Não necessita de sala']
            const newColumns = defaultColumns.map((col) => {
                if (col.title === 'Sala atribuída à aula') {
                    return {
                        ...col,
                        editor: 'list',
                        editorParams: {
                            values: listaSalas,
                        },
                    }
                } else if (col.title === 'Características da sala pedida para a aula') {
                    return {
                        ...col,
                        editor: 'list',
                        editorParams: {
                            values: listaCaracteristicasSalas,
                        },
                    }
                } else {
                    return col
                }
            })
            setColumns(newColumns)
        }
    }, [salas])

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
                        setOpen(true)
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
