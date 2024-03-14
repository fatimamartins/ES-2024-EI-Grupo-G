/**
 * @file This is a component for handling remote CSV file.
 */

/** @module react */
import React, { useState } from 'react'
/** @module papaparse */
import Papa from 'papaparse'
/** @module @mui/material */
import { Button, Input, Stack } from '@mui/material'

/**
 * A React component that handles remote CSV file.
 * @param {Object} props - The properties passed to this component.
 * @param {Function} props.setHorario - The function to set the horario state.
 */
export default function RemoteFile({ setData }) {
    /**
     * fileName - The name of the file to be fetched.
     * @type {string}
     */
    const [fileName, setFileName] = useState('')

    /**
     * Handle the change event of the file input.
     * @param {Event} event - The event triggered by changing the file input.
     */
    const handleFileChange = (event) => {
        setFileName(event.target.value)
    }

    /**
     * Handle the upload of the file.
     * Fetch the file from the provided URL, parse it as CSV and update the horario state.
     */
    const handleFileUpload = async () => {
        try {
            const response = await fetch(fileName)
            if (!response.ok) {
                throw new Error('Failed to fetch CSV')
            }
            const csvText = await response.text()
            const result = Papa.parse(csvText, { header: true })
            setData(result.data)
        } catch (error) {
            console.error('Error fetching CSV:', error)
        }
    }

    return (
        <Stack direction={'row'} mt={4}>
            <Input type="text" value={fileName} onChange={handleFileChange} placeholder="CSV File URL" />
            <Button variant="contained" onClick={handleFileUpload}>
                Upload
            </Button>
        </Stack>
    )
}
