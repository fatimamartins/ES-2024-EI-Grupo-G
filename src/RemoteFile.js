import React, { useState } from 'react'
import Papa from 'papaparse'
import { Button, Input, Stack } from '@mui/material'

export default function RemoteFile({ setData }) {
    const [fileName, setFileName] = useState('')

    const handleFileChange = (event) => {
        setFileName(event.target.value)
    }

    const handleFileUpload = async () => {
        try {
            // https://raw.githubusercontent.com/fatimamartins/ES-2024-EI-Grupo-G/f-import_csv/public/HorarioDeExemplo.csv
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
