/**
 * @file App.js
 * This is the main App component of the application.
 */

/** @module App.css */
import './App.css' // Styles for the App component
/** @module react */
import React from 'react' // React library
/** @module @mui/material */
import { Container } from '@mui/material' // Material-UI Container component
/** @module Navbar */
import Navbar from './Navbar' // Navbar component
/** @module react-tabulator/lib/css/tabulator.min.css */
import 'react-tabulator/lib/css/tabulator.min.css' // CSS for Tabulator library
/** @module react-tabulator/lib/styles.css */
import 'react-tabulator/lib/styles.css' // Additional styles for Tabulator library
/** @module react-tabulator/css/tabulator_bootstrap3.css */
import 'react-tabulator/css/tabulator_bootstrap3.css' // Bootstrap 3 theme for Tabulator
/** @module Home */
import Home from './Home' // Home component
/** @module NetworkGraph */
import NetworkGraph from './NetworkGraph' // NetworkGraph component
/** @module Heatmap */
import Heatmap from './Heatmap' // Heatmap component
/** @module react-router-dom */
import { Routes, Route } from 'react-router-dom' // React Router components for routing

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
                    <Route path="Conflitualidade" element={<NetworkGraph />} />
                    <Route path="Ocupacao" element={<Heatmap />} />
                </Routes>
            </Container>
        </div>
    )
}
