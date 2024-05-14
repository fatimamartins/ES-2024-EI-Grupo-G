/**
 * @file Home.js
 * This file contains the Home component which is the page with the schedule and rooms.
 */

/** @module App.css */
import './App.css'
/** @module react */
import React from 'react'
/** @module @mui/material */
import { Stack } from '@mui/material'
/** @module ScheduleTable */
import ScheduleTable from './ScheduleTable'
/** @module CsvReader */
import CsvReader from './CsvReader'
/** @module RemoteFile */
import RemoteFile from './RemoteFile'
/** @module RoomsTable */
import RoomsTable from './RoomsTable'

/**
 * @description Importing styles for the react-tabulator library.
 * @see {@link https://www.npmjs.com/package/react-tabulator}
 *
 * @module react-tabulator/lib/css/tabulator.min.css - The minified CSS for the tabulator.
 * @module react-tabulator/lib/styles.css - The default styles for the tabulator.
 * @module react-tabulator/css/tabulator_bootstrap3.css - The bootstrap3 theme for the tabulator.
 */
import 'react-tabulator/lib/css/tabulator.min.css'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/css/tabulator_bootstrap3.css'

/**
 * @function
 * @name Home
 * @description A function component that renders the home page.
 * @returns {JSX.Element} The rendered home page.
 */
export default function Home() {
    return (
        <div>
            <h1 id="pagesubtitle">Aplicação de suporte à gestão de horários</h1>
            <h2>Horário</h2>
            <Stack direction="row" alignItems="center" mt={6} mb={2}>
                <CsvReader id="scheduleReader" />
                <h4>OU</h4>
                <RemoteFile id="scheduleFile" />
            </Stack>
            <ScheduleTable />
            <h2>Salas</h2>
            <Stack direction="row" alignItems="center" mt={4} mb={4}>
                <CsvReader id="roomsReader" />
                <h4>OU</h4>
                <RemoteFile id="roomsFile" />
            </Stack>
            <RoomsTable />
        </div>
    )
}
