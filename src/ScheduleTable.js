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
const listaCaracteristicasSalas = {
    AnfAulas: 'Anfiteatro aulas',
    ApoioTecEve: 'Apoio técnico eventos',
    Arq1: 'Arq 1',
    Arq2: 'Arq 2',
    Arq3: 'Arq 3',
    Arq4: 'Arq 4',
    Arq5: 'Arq 5',
    Arq6: 'Arq 6',
    Arq7: 'Arq 7',
    Arq8: 'Arq 8',
    Arq9: 'Arq 9',
    BYOD: 'BYOD (Bring Your Own Device)',
    FocGroup: 'Focus Group',
    HorSalaVisPub: 'Horário sala visível portal público',
    LabArq1: 'Laboratório de Arquitectura de Computadores I',
    LabArq2: 'Laboratório de Arquitectura de Computadores II',
    LabBasesEng: 'Laboratório de Bases de Engenharia',
    LabElect: 'Laboratório de Electrónica',
    LabInfor: 'Laboratório de Informática',
    LabJorn: 'Laboratório de Jornalismo',
    LabRedesComp1: 'Laboratório de Redes de Computadores I',
    LabRedesComp2: 'Laboratório de Redes de Computadores II',
    LabTele: 'Laboratório de Telecomunicações',
    SalaAulasMe: 'Sala Aulas Mestrado',
    SalaAulasMePlus: 'Sala Aulas Mestrado Plus',
    SalaNEE: 'Sala NEE',
    SalaProvas: 'Sala Provas',
    SalaReu: 'Sala Reunião',
    SalaArq: 'Sala de Arquitectura',
    SalaNorm: 'Sala de Aulas normal',
    Videoconf: 'videoconferência',
    Atrio: 'Átrio',
}

/**
 * @typedef {Object} ListaSalas - Object representing a list of rooms.
 */
const listaSalas = {
    AudAfBar: 'Auditório Afonso de Barros',
    AudSilLeal: 'Auditório Silva Leal',
    AA223: 'AA2.23',
    AA224: 'AA2.24',
    AA225: 'AA2.25',
    AA226: 'AA2.26',
    AA228: 'AA2.28',
    AA229: 'AA2.29',
    AA323: 'AA3.23',
    AA324: 'AA3.24',
    AA325: 'AA3.25',
    AA326: 'AA3.26',
    AA328: 'AA3.28',
    AA329: 'AA3.29',
    AA330: 'AA3.30',
    AA332: 'AA3.32',
    AA340: 'AA3.40',
    AA407: 'AA4.07',
    C008: 'C0.08',
    D001: 'D0.01',
    D003: 'D0.03',
    D005: 'D0.05',
    EspExp: 'Espaço Exposições',
    A1: 'A1',
    B103: 'Auditório B1.03',
    B104: 'Auditório B1.04',
    C103: 'Auditório C1.03',
    C104: 'Auditório C1.04',
    B1: 'B1',
    B101: 'B1.01',
    B102: 'B1.02',
    BalcRecep: 'Balcão Recepção',
    C1: 'C1',
    C101: 'C1.01',
    D101: 'D1.01',
    D102: 'D1.02',
    D103: 'D1.03',
    D104: 'D1.04',
    D105: 'D1.05',
    D106: 'D1.06',
    D107: 'D1.07',
    D108: 'D1.08',
    D109: 'D1.09',
    D110: 'D1.10',
    D111: 'D1.11',
    D112: 'D1.12',
    D114: 'D1.14',
    GrandAud: 'Grande Auditório',
    B203: 'Auditório B2.03',
    B204: 'Auditório B2.04',
    B2: 'B2',
    B201: 'B2.01',
    B202: 'B2.02',
    C201: 'C2.01',
    C202: 'C2.02',
    C203: 'C2.03',
    C205: 'C2.05',
    D216: 'D2.16',
    B301: 'B3.01',
    B302: 'B3.02',
    B303: 'B3.03',
    B304: 'B3.04',
    B305: 'B3.05',
    B306: 'B3.06',
    C301: 'C3.01',
    C302: 'C3.02',
    C303: 'C3.03',
    D316: 'D3.16',
    C401: 'C4.01',
    C402: 'C4.02',
    C403: 'C4.03',
    C404: 'C4.04',
    C405: 'C4.05',
    C406: 'C4.06',
    C407: 'C4.07',
    C408: 'C4.08',
    C409: 'C4.09',
    C501: 'C5.01',
    C502: 'C5.02',
    C503: 'C5.03',
    C504: 'C5.04',
    C505: 'C5.05',
    C506: 'C5.06',
    C507: 'C5.07',
    C508: 'C5.08',
    C509: 'C5.09',
    C601: 'C6.01',
    C602: 'C6.02',
    C606: 'C6.06',
    C607: 'C6.07',
    C608: 'C6.08',
    C609: 'C6.09',
    C610: 'C6.10',
    C705: 'C7.05',
    C706: 'C7.06',
    C707: 'C7.07',
    C708: 'C7.08',
    C709: 'C7.09',
    C710: 'C7.10',
    E000: '0E00',
    E0071: '0E07.1',
    NE0: '0NE',
    S001: '0S01',
    S002: '0S02',
    NE001: 'Auditório 0NE01',
    NE002: 'Auditório 0NE02-Caiano Pereira',
    NE003: 'Auditório 0NE03 - Mário Murteira',
    E102: '1E02',
    E103: '1E03',
    E104: '1E04',
    E105: '1E05',
    E106: '1E06',
    E107: '1E07',
    E108: '1E08',
    E110: '1E10',
    E100: '1NE00',
    Aud1: 'Auditório 1',
    NE103: 'Auditório 1NE03 - JJ Laginha',
    E202: '2E02',
    E203: '2E03',
    E204: '2E04',
    E205: '2E05',
    E206: '2E06',
    E207: '2E07',
    E208: '2E08',
    E210: '2E10',
    Aud2: 'Auditório 2',
    Aud4: 'Auditório 4',
    BalnFem: 'Balneário feminino',
    BalnMasc: 'Balneário masculino',
    Campo: 'Campo',
}

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
export default function ScheduleTable({ defaultData, salas }) {
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
