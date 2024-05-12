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
import { COURSE_END_TIMES, COURSE_START_TIMES, ROOM_FEATURES } from './constants'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import HeatMap from 'react-heatmap-grid'
import { parseDate, parseHour } from './utils'
import { eachDayOfInterval, format } from 'date-fns'

const defaultTypeOfFilterComparison = ['=', '<', '>']

export default function Home() {
    const schedule = useAtomValue(atomSchedule)
    const rooms = useAtomValue(atomRooms)
    const [roomType, setRoomType] = React.useState('')
    const [startDate, setStartDate] = React.useState(null)
    const [endDate, setEndDate] = React.useState(null)
    const [roomCapacity, setRoomCapacity] = React.useState(null)
    const [capacityLogicOperator, setCapacityLogicOperator] = React.useState('>')
    const [logicOperator, setLogicOperator] = React.useState('Ocupado')
    const [heatmapData, setHeatmapData] = React.useState([])
    const [xLabels, setXLabels] = React.useState([]) // it changes according to the selected date range
    const yLabels = [...new Set([...COURSE_START_TIMES, ...COURSE_END_TIMES])]

    // Filter
    const clear = () => {
        setRoomType('')
        setStartDate(null)
        setEndDate(null)
        setRoomCapacity(null)
    }

    const getRoomsByCapacity = () => {
        return roomCapacity
            ? rooms.filter((room) => {
                  if (capacityLogicOperator === '=') {
                      return (room['Capacidade Normal'] = roomCapacity)
                  } else if (capacityLogicOperator === '>') {
                      return room['Capacidade Normal'] > roomCapacity
                  } else if (capacityLogicOperator === '<') {
                      return room['Capacidade Normal'] < roomCapacity
                  } else {
                      return false
                  }
              })
            : rooms
    }

    const getDataRange = () => {
        const dates = eachDayOfInterval({ start: parseDate(startDate), end: parseDate(endDate) })
        return dates.map((date) => format(date, 'dd/MM/yyyy'))
    }

    function processData(roomsFilteredByCapacity, dateRange) {
        // Create a matrix of zeros with the same dimensions as the heatmap
        const data = new Array(yLabels.length).fill(0).map(() => new Array(xLabels.length).fill(0))

        // Filter the ROOMS array to get rooms that have the specified roomType
        const filteredRoomNames = roomsFilteredByCapacity
            .filter((room) => room[roomType])
            .map((room) => room['Nome sala'])

        // Iterate over the schedule to populate the data matrix
        schedule.forEach((item) => {
            // Skip entries that don't match the room type filter
            if (roomType !== '') {
                if (!filteredRoomNames.includes(item['Sala atribuída à aula'])) return
            }

            // Skip entries without a date
            if (!item['Data da aula']) return
            // cons appointmentDate = parseDate(item['Data da aula'])

            // Skip entries that don't match the date range
            if (!dateRange.includes(item['Data da aula'])) {
                // console.log('Skipping due to date mismatch.')
                return
            }

            const itemStartTime = parseHour(item['Hora início da aula'])
            const itemEndTime = parseHour(item['Hora fim da aula'])

            // Find the index of the day in the xLabels array
            const dayIndex = xLabels.indexOf(item['Data da aula'])
            if (dayIndex === -1) {
                return
            }

            // Iterate over the yLabels to find the time slot that overlaps with the current item
            yLabels.forEach((time, yIndex) => {
                const currentHour = parseHour(time)
                const overlaps = currentHour >= itemStartTime && currentHour < itemEndTime

                if (overlaps) {
                    data[yIndex][dayIndex] += 1 // Increment the count of occupied rooms for the cell
                }
            })
        })

        return data
    }

    // Generate heatmap based on the selected filters
    const calculateHeatmap = (e) => {
        e.preventDefault()
        // get xLabels based on the selected date range
        const dateRange = getDataRange()
        setXLabels(dateRange)
        // get rooms that match the room capacity filter
        const roomsFiltered = getRoomsByCapacity()
        // process the data to generate the heatmap
        setHeatmapData(processData(roomsFiltered, dateRange))
    }

    return (
        <Tooltip
            title={schedule.length === 0 || rooms.length === 0 ? 'Por favor carregue os ficheiros horário e salas' : ''}
        >
            <Stack sx={{ mt: 8, mb: 8 }}>
                <form onSubmit={(e) => calculateHeatmap(e)}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, mb: 2 }}>
                        <Typography>Disponível</Typography>
                        <Switch
                            checked={logicOperator === 'Ocupado'}
                            inputProps={{ 'aria-label': 'ant design' }}
                            onChange={(e, c) => setLogicOperator(c ? 'Ocupado' : 'Disponível')}
                            disabled={schedule.length === 0 || rooms.length === 0}
                        />
                        <Typography>Ocupado</Typography>
                    </Stack>
                    <FormControl sx={{ width: 850, marginBottom: '8px' }}>
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
                                    if (event.target.value === '') {
                                        setRoomCapacity(null)
                                    } else {
                                        setRoomCapacity(event.target.value)
                                    }
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
                <Stack mt={6} sx={{ width: '100%', overflowX: 'scroll' }}>
                    {heatmapData.length > 0 && (
                        <HeatMap
                            xLabels={xLabels}
                            yLabels={yLabels}
                            data={heatmapData}
                            // squares
                            xLabelWidth={100}
                            yLabelWidth={80}
                            cellStyle={(background, value, min, max, data, x, y) => ({
                                background: `rgb(32, 95, 200, ${1 - (max - value) / (max - min)})`,
                                fontSize: '11.5px',
                                color: '#000',
                                borderRadius: '4px',
                                width: '100px',
                            })}
                            // xLabelsVisibility não mostrar domingos
                            cellRender={(value) => value && <div>{value}</div>}
                        />
                    )}
                </Stack>
            </Stack>
        </Tooltip>
    )
}
