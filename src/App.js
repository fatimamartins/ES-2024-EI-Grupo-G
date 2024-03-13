import './App.css'
import React, { useState } from 'react'
import { Container } from '@mui/material'
import ScheduleTable from './ScheduleTable'
import CsvReader from './CsvReader'
import RemoteFile from './RemoteFile'
import RoomsTable from './RoomsTable'

function App() {
    const [horario, setHorario] = useState([])
    const [salas, setSalas] = useState([])

    return (
        <Container>
            <h1>Aplicação de suporte à gestão de horários</h1>
            <h3>Horário</h3>
            <CsvReader setData={setHorario} />
            <RemoteFile setData={setHorario} />
            <ScheduleTable defaultData={horario} />
            <h3>Salas</h3>
            <CsvReader setData={setSalas} />
            <RemoteFile setData={setSalas} />
            <RoomsTable defaultData={salas} />
        </Container>
    )
}

export default App
