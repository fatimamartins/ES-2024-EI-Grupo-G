import React, { useState } from 'react'
import { ReactTabulator } from 'react-tabulator'
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
import { addSemesterWeekNumber, addWeekNumber, sortWeekDays, sortDate } from './utils'
import MultipleSelectCheckmarks from './MultipleSelectCheckmarks'

const defaultColumns = [
    {
        title: 'Curso',
        field: 'Curso',
        hozAlign: 'left',
        sorter: 'string',
        // editor: 'input',
        headerFilter: true,
        visible: true,
    },
    {
        title: 'Unidade Curricular',
        field: 'Unidade Curricular',
        hozAlign: 'left',
        sorter: 'string',
        headerFilter: true,
        visible: true,
    },
    { title: 'Turno', field: 'Turno', hozAlign: 'left', sorter: 'string', headerFilter: true, visible: true },
    { title: 'Turma', field: 'Turma', hozAlign: 'left', sorter: 'string', headerFilter: true, visible: true },
    {
        title: 'Inscritos no turno',
        field: 'Inscritos no turno',
        hozAlign: 'left',
        sorter: 'number',
        headerFilter: true,
        visible: true,
    },
    {
        title: 'Dia da semana',
        field: 'Dia da semana',
        hozAlign: 'left',
        sorter: function (a, b) {
            return sortWeekDays(a, b)
        },
        headerFilter: 'list',
        headerFilterParams: {
            values: { Seg: 'Seg', Ter: 'Ter', Qua: 'Qua', Qui: 'Qui', Sex: 'Sex', Sáb: 'Sáb' },
        },
        visible: true,
    },
    {
        title: 'Hora início da aula',
        field: 'Hora início da aula',
        hozAlign: 'left',
        headerFilter: true,
        visible: true,
    },
    {
        title: 'Hora fim da aula',
        field: 'Hora fim da aula',
        hozAlign: 'left',
        headerFilter: true,
        visible: true,
    },
    {
        title: 'Data da aula',
        field: 'Data da aula',
        hozAlign: 'left',
        sorter: function (a, b) {
            return sortDate(a, b)
        },
        headerFilter: true,
        visible: true,
    },
    {
        title: 'Características da sala pedida para a aula',
        field: 'Características da sala pedida para a aula',
        hozAlign: 'left',
        sorter: 'string',
        headerFilter: true,
        visible: true,
    },
    {
        title: 'Sala atribuída à aula',
        field: 'Sala atribuída à aula',
        hozAlign: 'left',
        sorter: 'string',
        headerFilter: true,
        visible: true,
    },
    {
        title: 'Semana do ano',
        field: 'Semana do ano',
        hozAlign: 'left',
        sorter: 'number',
        headerFilter: true,
        visible: true,
    },
    {
        title: 'Semana do semestre',
        field: 'Semana do semestre',
        hozAlign: 'left',
        sorter: 'number',
        headerFilter: true,
        visible: true,
    },
]

//https://github.com/ngduc/react-tabulator/blob/master/src/ReactTabulatorExample.tsx#L83
//neste link tem um exemplo de como fazer o download de um arquivo csv e como editar uma celula
export default function Table({ defaultData }) {
    const dataWithWeekAndSemesterNumber = addSemesterWeekNumber(addWeekNumber(defaultData))
    const [columns, setColumns] = useState(defaultColumns)

    return (
        <div>
            <MultipleSelectCheckmarks defaultColumns={defaultColumns} setColumns={setColumns} />
            <ReactTabulator
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
        </div>
    )
}
