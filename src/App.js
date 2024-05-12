/**
 * @file This is the main App component of the application.
 */

/** @module App.css */
import './App.css'
/** @module react */
import React from 'react'
/** @module @mui/material */
import { Container } from '@mui/material'

import Navbar from './Navbar'
import 'react-tabulator/lib/css/tabulator.min.css'
import 'react-tabulator/lib/styles.css'
// import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
// import 'react-tabulator/css/semantic-ui/tabulator_semantic-ui.css'
import 'react-tabulator/css/tabulator_bootstrap3.css'
import Home from './Home'
import Conflitualidade from './Conflitualidade'
import OcupacaoFi from './OcupacaoFi'
import { Routes, Route } from 'react-router-dom'
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
    return (
        <div>
            <Navbar />
            <Container sx={{ maxWidth: 1250, minWidth: 1250 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="Conflitualidade" element={<Conflitualidade />} />
                    <Route path="Ocupacao" element={<OcupacaoFi />} />
                </Routes>
            </Container>
        </div>
    )
}
