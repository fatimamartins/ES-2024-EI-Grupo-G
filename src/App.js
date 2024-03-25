/**
 * @file This is the main App component of the application.
 */

/** @module App.css */
import './App.css'
/** @module react */
import React, { useState } from 'react'
/** @module @mui/material */
import { Container, Stack } from '@mui/material'
/** @module ScheduleTable */
import ScheduleTable from './ScheduleTable'
/** @module CsvReader */
import CsvReader from './CsvReader'
/** @module RemoteFile */
import RemoteFile from './RemoteFile'
/** @module RoomsTable */
import RoomsTable from './RoomsTable'
import 'react-tabulator/lib/css/tabulator.min.css'
import 'react-tabulator/lib/styles.css'
// import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
// import 'react-tabulator/css/semantic-ui/tabulator_semantic-ui.css'
import 'react-tabulator/css/tabulator_bootstrap3.css'
import ReplaceCourse from './ReplaceCourse'
// import 'react-tabulator/css/tabulator_semanticui.css'
// import 'react-tabulator/css/tabulator_simple.css'

/**
 * This is the main App component of the application.
 * It manages the state of the 'horario' and renders the CsvReader, RemoteFile, and Table components.
 *
 * @function
 * @name App
 * @returns {JSX.Element} The rendered App component.
 */
export default function App() {
    /**
     * horario - The state for the horario data.
     * @type {Object[]}
     */
    const [horario, setHorario] = useState([])
    /**
     * salas - The state for the salas data.
     * @type {Object[]}
     */
    const [salas, setSalas] = useState([])

    return (
        <Container sx={{ maxWidth: 1350, minWidth: 1350 }}>
            <h1>Aplicação de suporte à gestão de horários</h1>
            <h2>Horário</h2>
            <Stack direction="row" alignItems="center" mt={6} mb={2}>
                <CsvReader setData={setHorario} id="1" />
                <h4>OU</h4>
                <RemoteFile setData={setHorario} />
            </Stack>
            <ScheduleTable defaultData={horario} salas={salas} />
            <ReplaceCourse />
            <h2>Salas</h2>
            <Stack direction="row" alignItems="center" mt={4} mb={4}>
                <CsvReader setData={setSalas} id="2" />
                <h4>OU</h4>
                <RemoteFile setData={setSalas} />
            </Stack>
            <RoomsTable defaultData={salas} />
        </Container>
    )
}
