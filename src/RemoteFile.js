/**
 * @file RemoteFile.js
 * This file contains the RemoteFile component of the application. This component is responsible for fetching remote CSV files and passing the data to the parent component.
 */

/** @module react */
import React, { useState } from 'react'
/** @module papaparse */
import Papa from 'papaparse'
/** @module @mui/material */
import { Button, Input, Stack } from '@mui/material'
/** @module atoms/schedule */
import { atomSchedule } from './atoms/schedule'
/** @module jotai */
import { useSetAtom } from 'jotai'
/** @module atoms/rooms */
import { atomRooms } from './atoms/rooms'

/**
 * @function
 * @name RemoteFile
 * @description This is a React component that fetches a CSV file from a provided URL, parses it, and updates the state with the parsed data. The state updated depends on the id prop passed to the component.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.id - The id of the component. Determines which state to update with the parsed data.
 * @returns {JSX.Element} The rendered RemoteFile component.
 *
 * @property {Function} setData - A function that updates the state. The state updated depends on the id prop.
 * @property {string} fileName - The URL of the file to be fetched.
 * @property {Function} handleFileChange - A function that updates the fileName state with the value of the file input.
 * @property {Function} handleFileUpload - A function that fetches the file from the provided URL, parses it as CSV, and updates the state with the parsed data.
 */
export default function RemoteFile({ id }) {
    const setData = useSetAtom(id === 'scheduleFile' ? atomSchedule : atomRooms)
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
            const { data } = Papa.parse(csvText, { header: true })
            const dataWithIndex = data.map((item, index) => {
                if (id === 'scheduleFile') {
                    const parseInscritos = parseInt(item['Inscritos no turno'])
                    return { ...item, id: index, 'Inscritos no turno': parseInscritos }
                } else if (id === 'roomsFile') {
                    const parseNormal = parseInt(item['Capacidade Normal'])
                    const parseExame = parseInt(item['Capacidade Exame'])
                    const parseCaracteristicas = parseInt(item['Nº características'])

                    return {
                        ...item,
                        id: index,
                        'Capacidade Normal': parseNormal,
                        'Capacidade Exame': parseExame,
                        'Nº características': parseCaracteristicas,
                    }
                }
                return { ...item, id: index }
            })
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
