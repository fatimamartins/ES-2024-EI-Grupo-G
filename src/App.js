import './App.css'
import React, { useState } from 'react'
import { Container } from '@mui/material'
import ScheduleTable from './ScheduleTable'
import CsvReader from './CsvReader'
import RemoteFile from './RemoteFile'
import RoomsTable from './RoomsTable'
import 'react-tabulator/lib/css/tabulator.min.css'
import 'react-tabulator/lib/styles.css'
// import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
// import 'react-tabulator/css/semantic-ui/tabulator_semantic-ui.css'
import 'react-tabulator/css/tabulator_bootstrap3.css'
// import 'react-tabulator/css/tabulator_semanticui.css'
// import 'react-tabulator/css/tabulator_simple.css'

function App() {
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

export default App
