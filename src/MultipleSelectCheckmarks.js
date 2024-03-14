/**
 * @file This is a component for a multiple select with checkmarks.
 */

/** @module react */
import React, { useState } from 'react'
/** @module @mui/material/OutlinedInput */
import OutlinedInput from '@mui/material/OutlinedInput'
/** @module @mui/material */
import { InputLabel, Stack } from '@mui/material'
/** @module @mui/material/MenuItem */
import MenuItem from '@mui/material/MenuItem'
/** @module @mui/material/FormControl */
import FormControl from '@mui/material/FormControl'
/** @module @mui/material/ListItemText */
import ListItemText from '@mui/material/ListItemText'
/** @module @mui/material/Select */
import Select from '@mui/material/Select'
/** @module @mui/material/Checkbox */
import Checkbox from '@mui/material/Checkbox'

/** @constant {number} ITEM_HEIGHT - The height of each item in the select menu. */
const ITEM_HEIGHT = 48
/** @constant {number} ITEM_PADDING_TOP - The padding at the top of each item in the select menu. */
const ITEM_PADDING_TOP = 8
/** @constant {object} MenuProps - The properties for the select menu. */
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 50,
        },
    },
}

/** @constant {string[]} colName - The names of the columns in the select menu. */
const colName = ['Curso', 'Unidade Curricular']
