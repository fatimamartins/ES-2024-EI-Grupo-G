/**
 * @file This is a component for a table using react-tabulator.
 */

/** @module react */
import React, { useState } from 'react'
/** @module react-tabulator */
import { ReactTabulator } from 'react-tabulator'
/** @module react-tabulator/css/bootstrap/tabulator_bootstrap.min.css */
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
/** @module utils */
import { addSemesterWeekNumber, addWeekNumber, sortWeekDays, sortDate } from './utils'
/** @module MultipleSelectCheckmarks */
import MultipleSelectCheckmarks from './MultipleSelectCheckmarks'
/** @module @mui/material */
import { Button, Stack } from '@mui/material'

/** @constant {Object[]} defaultColumns - The default columns for the table. */
const defaultColumns = [
    {
        title: 'Curso',
        field: 'Curso',
        hozAlign: 'left',
        sorter: 'string',
        // editor: 'input',
        headerFilter: true,
        visible: true,
    },
    {
        title: 'Unidade Curricular',
        field: 'Unidade Curricular',
        hozAlign: 'left',
        sorter: 'string',
        headerFilter: true,
    },
]
