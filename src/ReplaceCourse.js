import * as React from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { atomModalReplaceCourse } from './atoms/modalReplaceCourse'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Stack } from '@mui/material'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    boxShadow: 20,
    p: 4,
}

const ReplaceCourse = () => {
    const selectedCourse = useAtomValue(atomModalReplaceCourse)
    console.log('🚀 ~ ReplaceCourse ~ selectedCourse:', selectedCourse)
    const setOpen = useSetAtom(atomModalReplaceCourse) // function to open/close the modal with the rules to replace a course
    // const [rules, setRules] = React.useState([]) // rules to replace a course

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
                    <h3>Slots para alocação de uma aula de substituição</h3>
                    <Typography variant="body1" color="primary" mb={1} mt={4}>
                        Regras de alocação de uma aula de substituição
                    </Typography>
                    <Typography variant="subtitle2">Excluir</Typography>
                    <Stack direction="row" justifyContent="end">
                        <Button onClick={() => setOpen(null)}>Cancelar</Button>
                        <Button variant="contained" style={{ marginLeft: '15px' }}>
                            Inserir alterações
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </div>
    )
}

export default ReplaceCourse
