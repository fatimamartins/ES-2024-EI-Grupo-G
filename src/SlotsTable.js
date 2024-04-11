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
import { useSetAtom } from 'jotai'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Stack } from '@mui/material'
import { atomSeletedSlotToReplaceCourse } from './atoms/selectedSlotToReplaceCourse'

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
const SlotsTable = ({ slots, handleCancel }) => {
    const setSlot = useSetAtom(atomSeletedSlotToReplaceCourse)
    const [selectedSlot, setSelectedSlot] = React.useState(null)

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
                checkboxSelection
                hideFooterSelectedRowCount
                onRowSelectionModelChange={(selection) => {
                    // TODO:  only allow one selection at a time
                    setSelectedSlot(slots[selection[0]])
                }}
            />
            <Stack direction="row" justifyContent="end" mt={4}>
                <Button onClick={handleCancel}>Cancelar</Button>
                <Button
                    onClick={() => {
                        setSlot(selectedSlot)
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
