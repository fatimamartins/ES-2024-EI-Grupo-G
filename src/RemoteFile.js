/**
 * @file This is the RemoteFile component of the application.
 */

/** @module react */
import React, { useState } from 'react'
/** @module papaparse */
import Papa from 'papaparse'
/** @module @mui/material */
import { Button, Input, Stack } from '@mui/material'
import { atomSchedule } from './atoms/schedule'
import { useSetAtom } from 'jotai'
import { atomRooms } from './atoms/rooms'

/**
 * This is the RemoteFile component of the application.
 * It manages the fetching of remote CSV files and passes the data to the parent component.
 *
 * @function
 * @name RemoteFile
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.setData - The function to call with the data from the CSV file.
 * @returns {JSX.Element} The rendered RemoteFile component.
 */
export default function RemoteFile({ id }) {
    const setData = useSetAtom(id === 'scheduleReader' ? atomSchedule : atomRooms)
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
            const dataWithIndex = result.data.map((item, index) => ({ id: index, ...item }))
            setData(dataWithIndex)
        } catch (error) {
            console.error('Error fetching CSV:', error)
        }
    }

    return (
        <Stack direction={'row'} ml={8}>
            <Input type="text" value={fileName} onChange={handleFileChange} placeholder="CSV File URL" />
            <Button variant="contained" onClick={handleFileUpload}>
                Upload
            </Button>
        </Stack>
    )
}
