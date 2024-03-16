/**
 * @file This is a component for a table using react-tabulator.
 */

/** @module react */
import React, { useState, useEffect } from 'react'
/** @module react-tabulator */
import { ReactTabulator } from 'react-tabulator'
import { addSemesterWeekNumber, addWeekNumber, sortWeekDays } from './utils'
import MultipleSelectCheckmarks from './MultipleSelectCheckmarks'
/** @module @mui/material */
import { Button, Stack } from '@mui/material'

/**
 * @constant {Object[]} defaultColumns - The default columns for the table.
 */
const defaultColumns = (salas, defaultData) => [
    {
        title: 'Curso',
        field: 'Curso',
        hozAlign: 'left',
        sorter: 'string',
        headerFilter: true,
        visible: true,
        editor: 'list',
        editorParams:
            defaultData && defaultData.length > 0
                ? {
                      values: [...new Set(defaultData.map((defaultData) => defaultData['Curso']))],
                  }
                : undefined,
    },
    {
        title: 'Unidade Curricular',
        field: 'Unidade Curricular',
        hozAlign: 'left',
        sorter: 'string',
        headerFilter: true,
        visible: true,
        editor: 'list',
        editorParams:
            defaultData && defaultData.length > 0
                ? {
                      values: [...new Set(defaultData.map((defaultData) => defaultData['Unidade Curricular']))],
                  }
                : undefined,
    },
    {
        title: 'Turno',
        field: 'Turno',
        hozAlign: 'left',
        sorter: 'string',
        headerFilter: true,
        visible: true,
        editor: 'list',
        editorParams:
            defaultData && defaultData.length > 0
                ? {
                      values: [...new Set(defaultData.map((defaultData) => defaultData['Turno']))],
                  }
                : undefined,
    },
    {
        title: 'Turma',
        field: 'Turma',
        hozAlign: 'left',
        sorter: 'string',
        headerFilter: true,
        visible: true,
        editor: 'list',
        editorParams:
            defaultData && defaultData.length > 0
                ? {
                      values: [...new Set(defaultData.map((defaultData) => defaultData['Turma']))],
                  }
                : undefined,
    },
    {
        title: 'Inscritos no turno',
        field: 'Inscritos no turno',
        hozAlign: 'left',
        sorter: 'number',
        headerFilter: true,
        visible: true,
        editor: 'number',
        editorParams: {
            min: 0,
        },
    },
    {
        title: 'Dia da semana',
        field: 'Dia da semana',
        hozAlign: 'left',
        sorter: function (a, b) {
            return sortWeekDays(a, b)
        },
        headerFilter: true,
        headerFilterParams: {
            values: { Seg: 'Seg', Ter: 'Ter', Qua: 'Qua', Qui: 'Qui', Sex: 'Sex', Sáb: 'Sáb' },
            clearable: true,
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
        headerFilter: 'input',
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
        headerFilter: 'input',
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
        headerFilter: 'input',
    },
    {
        title: 'Características da sala pedida para a aula',
        field: 'Características da sala pedida para a aula',
        hozAlign: 'left',
        sorter: 'string',
        headerFilter: true,
        visible: true,
        editor: salas && salas.length > 0 ? 'list' : undefined,
        editorParams:
            salas && salas.length > 0
                ? {
                      values: [...Object.keys(salas[0]).slice(5), 'Não necessita de sala'],
                  }
                : undefined,
    },
    {
        title: 'Sala atribuída à aula',
        field: 'Sala atribuída à aula',
        hozAlign: 'left',
        sorter: 'string',
        headerFilter: true,
        visible: true,
        editor: salas && salas.length > 0 ? 'list' : undefined,
        editorParams:
            salas && salas.length > 0
                ? {
                      values: [...new Set(salas.map((sala) => sala['Nome sala']))],
                  }
                : undefined,
    },
    {
        title: 'Semana do ano',
        field: 'Semana do ano',
        hozAlign: 'left',
        sorter: 'number',
        headerFilter: true,
        visible: true,
        editor: 'number',
    },
    {
        title: 'Semana do semestre',
        field: 'Semana do semestre',
        hozAlign: 'left',
        sorter: 'number',
        headerFilter: true,
        visible: true,
        editor: 'number',
    },
]

//https://github.com/ngduc/react-tabulator/blob/master/src/ReactTabulatorExample.tsx#L83
//neste link tem um exemplo de como fazer o download de um arquivo csv e como editar uma celula
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
    const [columns, setColumns] = useState(defaultColumns(salas, defaultData))
    const tableRef = React.useRef(null)

    useEffect(() => {
        setColumns(defaultColumns(salas, defaultData))
    }, [salas, defaultData])

    return (
        <div>
            <MultipleSelectCheckmarks defaultColumns={defaultColumns} setColumns={setColumns} />
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
