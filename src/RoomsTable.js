import React from 'react'
import { ReactTabulator } from 'react-tabulator'

const defaultColumns = [
    {
        title: 'Edifício',
        field: 'Edif�cio',
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
    },
    {
        title: 'Capacidade Exame',
        field: 'Capacidade Exame',
        hozAlign: 'left',
        sorter: 'string',
    },
    {
        title: 'Nº características',
        field: 'N� caracter�sticas',
        hozAlign: 'left',
    },
]

export default function RoomsTable({ defaultData }) {
    return (
        <div>
            <ReactTabulator
                data={defaultData}
                columns={defaultColumns}
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
