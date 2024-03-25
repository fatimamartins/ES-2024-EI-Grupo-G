/**
 * @file This is a component for a table using react-tabulator.
 */

/** @module react */
import React from 'react'
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

/**
 * @typedef {Object} listaCaracteristicasSalas - Object representing a list of rooms characteristics.
 */
const listaCaracteristicasSalas = [
    'Anfiteatro aulas',
    'Apoio técnico eventos',
    'Arq 1',
    'Arq 2',
    'Arq 3',
    'Arq 4',
    'Arq 5',
    'Arq 6',
    'Arq 9',
    'BYOD (Bring Your Own Device)',
    'Focus Group',
    'Horário sala visível portal público',
    'Laboratório de Arquitectura de Computadores I',
    'Laboratório de Arquitectura de Computadores II',
    'Laboratório de Bases de Engenharia',
    'Laboratório de Electrónica',
    'Laboratório de Informática',
    'Laboratório de Jornalismo',
    'Laboratório de Redes de Computadores I',
    'Laboratório de Redes de Computadores II',
    'Laboratório de Telecomunicações',
    'Sala Aulas Mestrado',
    'Sala Aulas Mestrado Plus',
    'Sala NEE',
    'Sala Provas',
    'Sala Reunião',
    'Sala de Arquitectura',
    'Sala de Aulas normal',
    'videoconferência',
    'Átrio',
    'Não necessita de sala',
]

/**
 * @typedef {Object} ListaSalas - Object representing a list of rooms.
 */
const listaSalas = [
    'Auditório Afonso de Barros',
    'Auditório Silva Leal',
    'AA2.23',
    'AA2.24',
    'AA2.25',
    'AA2.26',
    'AA2.28',
    'AA2.29',
    'AA3.23',
    'AA3.24',
    'AA3.25',
    'AA3.26',
    'AA3.28',
    'AA3.29',
    'AA3.30',
    'AA3.32',
    'AA3.40',
    'AA4.07',
    'C0.08',
    'D0.01',
    'D0.03',
    'D0.05',
    'Espaço Exposições',
    'A1',
    'Auditório B1.03',
    'Auditório B1.04',
    'Auditório C1.03',
    'Auditório C1.04',
    'B1',
    'B1.01',
    'B1.02',
    'Balcão Recepção',
    'C1',
    'C1.01',
    'D1.01',
    'D1.02',
    'D1.03',
    'D1.04',
    'D1.05',
    'D1.06',
    'D1.07',
    'D1.08',
    'D1.09',
    'D1.10',
    'D1.11',
    'D1.12',
    'D1.14',
    'Grande Auditório',
    'Auditório B2.03',
    'Auditório B2.04',
    'B2',
    'B2.01',
    'B2.02',
    'C2.01',
    'C2.02',
    'C2.03',
    'C2.05',
    'D2.16',
    'B3.01',
    'B3.02',
    'B3.03',
    'B3.04',
    'B3.05',
    'B3.06',
    'C3.01',
    'C3.02',
    'C3.03',
    'D3.16',
    'C4.01',
    'C4.02',
    'C4.03',
    'C4.04',
    'C4.05',
    'C4.06',
    'C4.07',
    'C4.08',
    'C4.09',
    'C5.01',
    'C5.02',
    'C5.03',
    'C5.04',
    'C5.05',
    'C5.06',
    'C5.07',
    'C5.08',
    'C5.09',
    'C6.01',
    'C6.02',
    'C6.06',
    'C6.07',
    'C6.08',
    'C6.09',
    'C6.10',
    'C7.05',
    'C7.06',
    'C7.07',
    'C7.08',
    'C7.09',
    'C7.10',
    '0E00',
    '0E07.1',
    '0NE',
    '0S01',
    '0S02',
    'Auditório 0NE01',
    'Auditório 0NE02-Caiano Pereira',
    'Auditório 0NE03 - Mário Murteira',
    '1E02',
    '1E03',
    '1E04',
    '1E05',
    '1E06',
    '1E07',
    '1E08',
    '1E10',
    '1NE00',
    'Auditório 1',
    'Auditório 1NE03 - JJ Laginha',
    '2E02',
    '2E03',
    '2E04',
    '2E05',
    '2E06',
    '2E07',
    '2E08',
    '2E10',
    'Auditório 2',
    'Auditório 4',
    'Balneário feminino',
    'Balneário masculino',
    'Campo',
]

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
        editor: 'list',
        editorParams: {
            values: listaCaracteristicasSalas,
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
        title: 'Sala atribuída à aula',
        field: 'Sala atribuída à aula',
        hozAlign: 'left',
        sorter: 'string',
        visible: true,
        editor: 'list',
        editorParams: {
            values: listaSalas,
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
export default function ScheduleTable({ defaultData }) {
    const dataWithWeekAndSemesterNumber = addSemesterWeekNumber(addWeekNumber(defaultData))
    const [columns] = React.useState(defaultColumns)
    const tableRef = React.useRef(null)

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
