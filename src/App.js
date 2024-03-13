import './App.css'
import React, { useState } from 'react'
import { Container } from '@mui/material'
import TableDemo from './TableDemo'
import CsvReader from './CsvReader'
import RemoteFile from './RemoteFile'

function App() {
    const [horario, setHorario] = useState([])
    return (
        <Container>
            <CsvReader setHorario={setHorario} />
            <RemoteFile setHorario={setHorario} />
            <TableDemo />
        </Container>
    )
}

export default App
