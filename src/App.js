/**
 * @file This is the main App component of the application.
 */

/** @module App.css */
import './App.css'
/** @module react */
import React, { useState } from 'react'
/** @module @mui/material */
import { Container } from '@mui/material'
/** @module ScheduleTable */
import ScheduleTable from './ScheduleTable'
/** @module CsvReader */
import CsvReader from './CsvReader'
/** @module RemoteFile */
import RemoteFile from './RemoteFile'
/** @module RoomsTable */
import RoomsTable from './RoomsTable'

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
    const [salas, setSalas] = useState([])

    return (
        <Container>
            <h1>Aplicação de suporte à gestão de horários</h1>
            <h3>Horário</h3>
            <CsvReader setData={setHorario} id="1" />
            <RemoteFile setData={setHorario} />
            <ScheduleTable defaultData={horario} />
            <h3>Salas</h3>
            <CsvReader setData={setSalas} id="2" />
            <RemoteFile setData={setSalas} />
            <RoomsTable defaultData={salas} />
        </Container>
    )
}
