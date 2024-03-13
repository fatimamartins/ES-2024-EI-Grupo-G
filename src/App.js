import './App.css'
import React, { useState } from 'react'
import { Container } from '@mui/material'
import Table from './Table'
import CsvReader from './CsvReader'
import RemoteFile from './RemoteFile'

function App() {
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

export default App
