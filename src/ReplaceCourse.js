import * as React from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { atomModalReplaceCourse } from './atoms/modalReplaceCourse'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}

const ReplaceCourse = () => {
    const selectedCourse = useAtomValue(atomModalReplaceCourse)
    const setOpen = useSetAtom(atomModalReplaceCourse) // function to open/close the modal with the rules to replace a course

    return (
        <div>
            <Modal
                open={selectedCourse !== null}
                onClose={(event, reason) => {
                    // modal should not be closed by clicking outside the modal or pressing the escape key
                    if ((reason && reason === 'backdropClick') || reason === 'escapeKeyDown') return
                    setOpen(null)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Text in a modal
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography>
                    <Button onClick={() => setOpen(null)}>Cancel</Button>
                </Box>
            </Modal>
        </div>
    )
}

export default ReplaceCourse
