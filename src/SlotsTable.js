/**
 * @file SlotsTable
 */

/**
 * @external React
 * @see {@link https://reactjs.org/}
 */
import * as React from 'react'
/**
 * @external jotai
 * @see {@link https://jotai.pmnd.rs/}
 */
import { DataGrid } from '@mui/x-data-grid'
import { Button, Stack } from '@mui/material'
import { isSameDate, getDayOfTheWeek, getWeek, getSemesterWeek } from './utils'

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
 * SlotsTable component is responsible for managing the slots available for replacing of a course.
 *
 * @returns {JSX.Element} The SlotsTable component.
 */
const SlotsTable = ({ tableRef, selectedCourse, slots, handleCancel }) => {
    const [selectedSlot, setSelectedSlot] = React.useState(null)
    const [selectionModel, setSelectionModel] = React.useState([])

    return (
        <div style={{ width: '100%', marginTop: '20px' }}>
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
                        if (isSameDate(selectedCourse['Data da aula'], selectedSlot['Data da aula'])) {
                            tableRef.current.updateRow(selectedCourse.id, {
                                'Data da aula': selectedSlot['Data da aula'],
                                'Hora início da aula': selectedSlot['Hora início da aula'],
                                'Hora fim da aula': selectedSlot['Hora fim da aula'],
                                'Salas atribuída à aula': selectedSlot['Sala atribuída à aula'],
                            })
                        } else {
                            tableRef.current.updateRow(selectedCourse.id, {
                                'Data da aula': selectedSlot['Data da aula'],
                                'Hora início da aula': selectedSlot['Hora início da aula'],
                                'Hora fim da aula': selectedSlot['Hora fim da aula'],
                                'Salas atribuída à aula': selectedSlot['Sala atribuída à aula'],
                                'Dia da semana': getDayOfTheWeek(selectedSlot['Data da aula']),
                                'Semana do ano': getWeek(selectedSlot['Data da aula']),
                                'Semana do semestre': getSemesterWeek(
                                    selectedCourse['Data da aula'],
                                    selectedCourse['Semana do semestre'],
                                    selectedSlot['Data da aula']
                                ),
                            })
                        }
                        tableRef.current.selectRow(selectedCourse.id)
                        handleCancel()
                    }}
                    variant="contained"
                    style={{ marginLeft: '15px', width: '180px' }}
                >
                    Inserir alterações
                </Button>
            </Stack>
        </div>
    )
}

/**
 * Represents a table with the results of the slots available for replacing a course.
 * @class
 * @exports ReplaceCourse
 */
export default SlotsTable
