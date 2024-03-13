import './App.css'
import React, { useState } from 'react'
import { Container } from '@mui/material'
import TableDemo from './TableDemo'
import CsvReader from './CsvReader'

function App() {
    const [horario, setHorario] = useState([])

    return (
        <Container>
            <CsvReader setHorario={setHorario} />
            <TableDemo />
            <p>Hello</p>
        </Container>
    )
}

export default App
