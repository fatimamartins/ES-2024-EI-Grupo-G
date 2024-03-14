import React, { useState } from 'react'
import { ReactTabulator } from 'react-tabulator'

import { addSemesterWeekNumber, addWeekNumber, sortWeekDays } from './utils'
import MultipleSelectCheckmarks from './MultipleSelectCheckmarks'
import { Button, Stack } from '@mui/material'

const defaultColumns = [
    {
        title: 'Curso',
        field: 'Curso',
        hozAlign: 'left',
        sorter: 'string',
        editor: 'input',
        headerFilter: true,
        visible: true,
    },
    {
        title: 'Unidade Curricular',
        field: 'Unidade Curricular',
        hozAlign: 'left',
        sorter: 'string',
        editor: 'input',
        headerFilter: true,
        visible: true,
    },
    {
        title: 'Turno',
        field: 'Turno',
        hozAlign: 'left',
        sorter: 'string',
        headerFilter: true,
        visible: true,
        editor: 'input',
    },
    {
        title: 'Turma',
        field: 'Turma',
        hozAlign: 'left',
        sorter: 'string',
        headerFilter: true,
        visible: true,
        editor: 'input',
    },
    {
        title: 'Inscritos no turno',
        field: 'Inscritos no turno',
        hozAlign: 'left',
        sorter: 'number',
        headerFilter: true,
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
        editor: 'input',
    },
    {
        title: 'Sala atribuída à aula',
        field: 'Sala atribuída à aula',
        hozAlign: 'left',
        sorter: 'string',
        headerFilter: true,
        visible: true,
        editor: 'input',
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

export default function ScheduleTable({ defaultData }) {
    const dataWithWeekAndSemesterNumber = addSemesterWeekNumber(addWeekNumber(defaultData))
    const [columns, setColumns] = useState(defaultColumns)
    const tableRef = React.useRef(null)

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
