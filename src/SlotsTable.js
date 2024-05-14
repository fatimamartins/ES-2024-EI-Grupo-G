/**
 * @file SlotsTable.js
 * This file is a component for displaying the slots available for replacing a course. It imports necessary modules and components such as React, DataGrid from MUI X DataGrid, and Button and Stack from MUI Material. It also defines a constant for the columns of the DataGrid.
 */

/** @module react */
import * as React from 'react'
/** @module @mui/x-data-grid */
import { DataGrid } from '@mui/x-data-grid'
/** @module @mui/material */
import { Button, Stack } from '@mui/material'

/**
 * @constant
 * @type {Array}
 * @description This constant defines the columns for the DataGrid in the application. Each object in the array represents a column in the DataGrid.
 */
const columns = [
    {
        field: 'Data da aula',
        headerName: 'Data da aula',
        width: 200,
        hideable: false,
    },
    { field: 'Hora início da aula', headerName: 'Hora início da aula', width: 200, hideable: false },
    { field: 'Hora fim da aula', headerName: 'Hora fim da aula', width: 200, hideable: false },
    { field: 'Sala atribuída à aula', headerName: 'Sala atribuída à aula', width: 200, hideable: false },
]

/**
 * @function
 * @name SlotsTable
 * @description This function represents a component that renders a DataGrid for the slots available for replacing a course. It takes in props as parameters and returns a DataGrid component.
 * @param {Object} props - The properties passed to the component.
 * @returns {React.Component} Returns a DataGrid component that displays the slots available for replacing a course.
 */
const SlotsTable = ({ slots, handleCancel, handleSelection, buttonTitle, top }) => {
    const [selectedSlot, setSelectedSlot] = React.useState(null)
    const [selectionModel, setSelectionModel] = React.useState([])

    return (
        <div style={{ width: '100%', marginTop: top }}>
            <DataGrid
                rows={slots.map((slot, index) => ({ id: index, ...slot }))}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                hideFooterSelectedRowCount
                onRowSelectionModelChange={(selection) => {
                    if (selection.length > 1) {
                        const result = selection.filter((s) => !selectionModel.includes(s))

                        setSelectionModel(result)
                        setSelectedSlot(slots[result[0]])
                    } else {
                        setSelectionModel(selection)
                        setSelectedSlot(slots[selection[0]])
                    }
                }}
                rowSelectionModel={selectionModel}
            />
            <Stack direction="row" justifyContent="end" mt={4}>
                <Button onClick={handleCancel}>Cancelar</Button>
                <Button
                    onClick={() => {
                        handleSelection(selectedSlot)
                        setSelectedSlot(null)
                        setSelectionModel([])
                    }}
                    variant="contained"
                    style={{ marginLeft: '15px', width: '180px' }}
                    disabled={!selectedSlot}
                >
                    {buttonTitle}
                </Button>
            </Stack>
        </div>
    )
}

export default SlotsTable
