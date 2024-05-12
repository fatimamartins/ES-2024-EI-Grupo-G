/**
 * @file This is the page with the schedule and rooms.
 */

/** @module App.css */
import './App.css'
/** @module react */
import React from 'react'

import {
    Button,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { useAtomValue } from 'jotai'
import { atomSchedule } from './atoms/schedule'
import { atomRooms } from './atoms/rooms'
import { ROOM_FEATURES } from './constants'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const defaultTypeOfFilterComparison = ['=', '<', '>']

export default function Home() {
    const schedule = useAtomValue(atomSchedule)
    const rooms = useAtomValue(atomRooms)
    const [roomType, setRoomType] = React.useState('')
    const [startDate, setStartDate] = React.useState(null)
    const [endDate, setEndDate] = React.useState(null)
    const [roomCapacity, setRoomCapacity] = React.useState(0)
    console.log('🚀 ~ Home ~ roomCapacity:', roomCapacity)
    const [capacityLogicOperator, setCapacityLogicOperator] = React.useState('>')
    const [logicOperator, setLogicOperator] = React.useState('Ocupado')

    const calculateHeatmap = (e) => {
        e.preventDefault()
        console.log('Calculating heatmap')
    }

    const clear = () => {
        setRoomType('')
        setStartDate(null)
        setEndDate(null)
        setRoomCapacity(0)
    }

    return (
        <Tooltip
            title={schedule.length === 0 || rooms.length === 0 ? 'Por favor carregue os ficheiros horário e salas' : ''}
        >
            <Stack sx={{ mt: 8 }}>
                <form onSubmit={(e) => calculateHeatmap(e)}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, mb: 2 }}>
                        <Typography>Ocupado</Typography>
                        <Switch
                            checked={logicOperator === 'Ocupado'}
                            inputProps={{ 'aria-label': 'ant design' }}
                            onChange={(e, c) => setLogicOperator(c ? 'Ocupado' : 'Disponível')}
                            disabled={schedule.length === 0 || rooms.length === 0}
                        />
                        <Typography>Disponível</Typography>
                    </Stack>
                    <FormControl sx={{ width: 850, marginBottom: '3px' }}>
                        <InputLabel id="label2">Tipo de sala</InputLabel>
                        <Select
                            labelId="label1"
                            id="label1"
                            label="Tipo de sala *"
                            sx={{ height: 57 }}
                            value={roomType}
                            disabled={schedule.length === 0 || rooms.length === 0}
                            onChange={(event) => {
                                setRoomType(event.target.value)
                            }}
                        >
                            {ROOM_FEATURES.map((col) => (
                                <MenuItem key={col} value={col}>
                                    <ListItemText primary={col} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Stack direction="row" sx={{ marginBottom: '10px' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} sx={{ marginRight: '8px' }}>
                                <DatePicker
                                    label="Data de início *"
                                    format="DD-MM-YYYY"
                                    views={['day', 'month', 'year']}
                                    value={startDate ? dayjs(startDate, 'DD/MM/YYYY') : null}
                                    disabled={schedule.length === 0 || rooms.length === 0}
                                    onChange={(newValue) => {
                                        const dateString = newValue.format('DD/MM/YYYY')
                                        setStartDate(dateString)
                                    }}
                                    sx={{ width: '420px' }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    label="Data de fim *"
                                    format="DD-MM-YYYY"
                                    views={['day', 'month', 'year']}
                                    value={endDate ? dayjs(endDate, 'DD/MM/YYYY') : null}
                                    disabled={schedule.length === 0 || rooms.length === 0}
                                    onChange={(newValue) => {
                                        const dateString = newValue.format('DD/MM/YYYY')
                                        setEndDate(dateString)
                                    }}
                                    sx={{ width: '420px' }}
                                    minDate={startDate ? dayjs(startDate, 'DD/MM/YYYY') : null}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Stack>
                    <Stack direction="row">
                        <FormControl sx={{ marginRight: '8px', width: '150px' }}>
                            <Select
                                labelId="simple-select-label2"
                                id="simple-select2"
                                value={capacityLogicOperator}
                                onChange={(event) => setCapacityLogicOperator(event.target.value)}
                                disabled={schedule.length === 0 || rooms.length === 0}
                            >
                                {defaultTypeOfFilterComparison.map((t, index) => {
                                    return (
                                        <MenuItem key={index} value={t}>
                                            {t}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: '690px' }}>
                            <TextField
                                type="number"
                                id="label4"
                                placeholder="Capacidade da sala"
                                label="Capacidade da sala"
                                variant="outlined"
                                disabled={schedule.length === 0 || rooms.length === 0}
                                onChange={(event) => {
                                    setRoomCapacity(event.target.value)
                                }}
                                InputProps={{ inputProps: { step: 1 } }}
                            />
                        </FormControl>
                    </Stack>
                    <Stack direction="row" alignContent={'center'} sx={{ marginTop: '30px' }}>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={
                                schedule.length === 0 || rooms.length === 0 || startDate === null || endDate === null
                            }
                        >
                            Desenhar heatmap
                        </Button>
                        <Button
                            onClick={clear}
                            sx={{ marginLeft: '8px' }}
                            variant="text"
                            disabled={schedule.length === 0 || rooms.length === 0}
                        >
                            Limpar campos
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </Tooltip>
    )
}