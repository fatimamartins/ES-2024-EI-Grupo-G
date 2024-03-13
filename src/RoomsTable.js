import React, { useState } from 'react'
import { ReactTabulator } from 'react-tabulator'
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'

const defaultColumns = [
    {
        title: 'Edifício',
        field: 'Edifício',
        hozAlign: 'left',
    },
    {
        title: 'Nome sala',
        field: 'Nome sala',
        hozAlign: 'left',
        sorter: 'string',
    },
    {
        title: 'Capacidade Normal',
        field: 'Capacidade Normal',
        hozAlign: 'left',
        sorter: 'string',
        headerFilter: true,
        visible: true,
    },
    {
        title: 'Capacidade Exame',
        field: 'Capacidade Exame',
        hozAlign: 'left',
        sorter: 'string',
    },
    {
        title: 'Nº características',
        field: 'Nº características',
        hozAlign: 'left',
    },
    {
        title: 'Anfiteatro aulas',
        field: 'Anfiteatro aulas',
        hozAlign: 'left',
    },
    {
        title: 'Apoio técnico eventos',
        field: 'Apoio técnico eventos',
        hozAlign: 'left',
    },
    {
        title: 'Arq 1',
        field: 'Arq 1',
        hozAlign: 'left',
    },
    {
        title: 'Arq 2',
        field: 'Arq 2',
        hozAlign: 'left',
    },
    {
        title: 'Arq 3',
        field: 'Arq 3',
        hozAlign: 'left',
    },
    {
        title: 'Arq 4',
        field: 'Arq 4',
        hozAlign: 'left',
    },
    {
        title: 'Arq 5',
        field: 'Arq 5',
        hozAlign: 'left',
    },
    {
        title: 'Arq 6',
        field: 'Arq 6',
        hozAlign: 'left',
    },
    {
        title: 'Arq 9',
        field: 'Arq 9',
        hozAlign: 'left',
    },
    {
        title: 'BYOD (Bring Your Own Device)',
        field: 'BYOD (Bring Your Own Device)',
        hozAlign: 'left',
    },
    {
        title: 'Focus Group',
        field: 'Focus Group',
        hozAlign: 'left',
    },
    {
        title: 'Horário sala visível portal público',
        field: 'Horário sala visível portal público',
        hozAlign: 'left',
    },
    {
        title: 'Laboratório de Arquitectura de Computadores I',
        field: 'Laboratório de Arquitectura de Computadores I',
        hozAlign: 'left',
    },
    {
        title: 'Laboratório de Arquitectura de Computadores II',
        field: 'Laboratório de Arquitectura de Computadores II',
        hozAlign: 'left',
    },
    {
        title: 'Laboratório de Bases de Engenharia',
        field: 'Laboratório de Bases de Engenharia',
        hozAlign: 'left',
    },
    {
        title: 'Laboratório de Electrónica',
        field: 'Laboratório de Electrónica',
        hozAlign: 'left',
    },
    {
        title: 'Laboratório de Informática',
        field: 'Laboratório de Informática',
        hozAlign: 'left',
    },
    {
        title: 'Laboratório de Jornalismo',
        field: 'Laboratório de Jornalismo',
        hozAlign: 'left',
    },
    {
        title: 'Laboratório de Redes de Computadores I',
        field: 'Laboratório de Redes de Computadores I',
        hozAlign: 'left',
    },
    {
        title: 'Laboratório de Telecomunicações',
        field: 'Laboratório de Telecomunicações',
        hozAlign: 'left',
    },
    {
        title: 'Sala Aulas Mestrado',
        field: 'Sala Aulas Mestrado',
        hozAlign: 'left',
    },
    {
        title: 'Sala Aulas Mestrado Plus',
        field: 'Sala Aulas Mestrado Plus',
        hozAlign: 'left',
    },
    {
        title: 'Sala NEE',
        field: 'Sala NEE',
        hozAlign: 'left',
    },
    {
        title: 'Sala Provas',
        field: 'Sala Provas',
        hozAlign: 'left',
    },
    {
        title: 'Sala Reunião',
        field: 'Sala Reunião',
        hozAlign: 'left',
    },
    {
        title: 'Sala de Arquitectura',
        field: 'Sala de Arquitectura',
        hozAlign: 'left',
    },
    {
        title: 'Sala de Aulas normal',
        field: 'Sala de Aulas normal',
        hozAlign: 'left',
    },
    {
        title: 'videoconferência',
        field: 'videoconferência',
        hozAlign: 'left',
    },
    {
        title: 'Átrio',
        field: 'Átrio',
        hozAlign: 'left',
    },
]

//https://github.com/ngduc/react-tabulator/blob/master/src/ReactTabulatorExample.tsx#L83
//neste link tem um exemplo de como fazer o download de um arquivo csv e como editar uma celula
export default function RoomsTable({ defaultData }) {
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
