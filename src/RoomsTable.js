import React from 'react'
import { ReactTabulator } from 'react-tabulator'
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'

const defaultColumns = [
    {
        title: 'Edifício',
        field: 'Edif_cio',
        hozAlign: 'left',
    },
    {
        title: 'Nome sala',
        field: 'Nome_sala',
        hozAlign: 'left',
        sorter: 'string',
    },
    {
        title: 'Capacidade Normal',
        field: 'Capacidade_Normal',
        hozAlign: 'left',
        sorter: 'string',
    },
    {
        title: 'Capacidade Exame',
        field: 'Capacidade_Exame',
        hozAlign: 'left',
        sorter: 'string',
    },
    {
        title: 'Nº características',
        field: 'N__caracter_sticas',
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
