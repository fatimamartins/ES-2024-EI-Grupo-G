/**
 * @file This is the main App component of the application.
 */

/** @module App.css */
import './App.css'
/** @module react */
import React, { useState } from 'react'
/** @module @mui/material */
import { Container } from '@mui/material'
/** @module Table */
import Table from './Table'
/** @module CsvReader */
import CsvReader from './CsvReader'
/** @module RemoteFile */
import RemoteFile from './RemoteFile'

/**
 * This is the main App component of the application.
 * It manages the state of the 'horario' and renders the CsvReader, RemoteFile, and Table components.
 *
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
    /**
     * horario - The state for the horario data.
     * @type {Object[]}
     */
    const [horario, setHorario] = useState([])
    return (
        <Container>
            <h1>Aplicação de suporte à gestão de horários</h1>
            <CsvReader setHorario={setHorario} />
            <RemoteFile setHorario={setHorario} />
            <Table defaultData={horario} />
        </Container>
    )
}
