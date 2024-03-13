import React, { useState } from 'react'
import { ReactTabulator } from 'react-tabulator'
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'

const defaultColumns = [
    {
        title: 'Curso',
        field: 'Curso',
        hozAlign: 'left',
    },
    {
        title: 'Unidade Curricular',
        field: 'Unidade Curricular',
        hozAlign: 'left',
    },
    { title: 'Turno', field: 'Turno', hozAlign: 'left' },
    { title: 'Turma', field: 'Turma', hozAlign: 'left' },
    {
        title: 'Inscritos no turno',
        field: 'Inscritos no turno',
        hozAlign: 'left',
    },
    {
        title: 'Dia da semana',
        field: 'Dia da semana',
        hozAlign: 'left',
    },
    {
        title: 'Hora início da aula',
        field: 'Hora início da aula',
        hozAlign: 'left',
    },
    {
        title: 'Hora fim da aula',
        field: 'Hora fim da aula',
        hozAlign: 'left',
    },
    {
        title: 'Data da aula',
        field: 'Data da aula',
        hozAlign: 'left',
    },
    {
        title: 'Características da sala pedida para a aula',
        field: 'Características da sala pedida para a aula',
        hozAlign: 'left',
    },
    {
        title: 'Sala atribuída à aula',
        field: 'Sala atribuída à aula',
        hozAlign: 'left',
    },
    {
        title: 'Semana do ano',
        field: 'Semana do ano',
        hozAlign: 'left',
    },
    {
        title: 'Semana do semestre',
        field: 'Semana do semestre',
        hozAlign: 'left',
    },
]

//https://github.com/ngduc/react-tabulator/blob/master/src/ReactTabulatorExample.tsx#L83
//neste link tem um exemplo de como fazer o download de um arquivo csv e como editar uma celula
export default function Table({ defaultData }) {
    const [columns, setColumns] = useState(defaultColumns)

    return (
        <div>
            <ReactTabulator
                data={defaultData}
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
