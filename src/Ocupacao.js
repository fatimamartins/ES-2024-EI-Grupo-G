import React from 'react'
import { useAtomValue } from 'jotai'
import HeatMap from 'react-heatmap-grid'
import { atomRooms } from './atoms/rooms'
import { atomSchedule } from './atoms/schedule'
import { ROOMS } from './constants'
import { isAfter, isBefore } from 'date-fns'
import { parseHour, parseDate } from './utils'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ROOM_FEATURES } from './constants'
import dayjs from 'dayjs'
import { SigmaContainer } from '@react-sigma/core'
import '@react-sigma/core/lib/react-sigma.min.css'
import {
    Button,
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip,
} from '@mui/material'

const xLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const yLabels = []
for (let hour = 8; hour <= 22; hour++) {
    yLabels.push(`${hour}:00:00`)
    if (hour !== 23) {
        // Assuming 22:30 is the last label you want
        yLabels.push(`${hour}:30:00`)
    }
}

function processData(scheduleData, roomsData, startDate, endDate, roomType) {
    const formattedDate = startDate // Converts string to Date object
    const formattedDateFim = endDate
    const data = new Array(yLabels.length).fill(0).map(() => new Array(xLabels.length).fill(0))

    // Filter the ROOMS array to get rooms that have the specified roomType
    const filteredRooms = roomsData.filter((room) => room[roomType])

    // Map the filtered rooms to extract their room names
    const roomNames = filteredRooms.map((room) => room['Nome sala'])

    scheduleData.forEach((item) => {
        if (roomType !== '') {
            if (!roomNames.includes(item['Sala atribuída à aula'])) return
        }

        if (!item['Data da aula']) return
        const scheduleDate = parseDate(item['Data da aula'])
        console.log(item)
        console.log('Constructed Date schedule object:', scheduleDate)

        // Only process entries for the specific date
        if (scheduleDate.getTime() < formattedDate.getTime() || scheduleDate.getTime() > formattedDateFim.getTime()) {
            console.log('Skipping due to date mismatch.')
            return
        }

        const itemStartTime = parseHour(item['Hora início da aula'])
        const itemEndTime = parseHour(item['Hora fim da aula'])
        const itemDay = item['Dia da semana'] // Make sure this matches with xLabels

        // Convert day string to index
        const dayIndex = xLabels.indexOf(itemDay)
        if (dayIndex === -1) {
            console.log(`Skipping due to day mismatch: ${itemDay}`)
            return // If the day doesn't match any index, skip this item
        }

        console.log(`Day index found: ${dayIndex} for day: ${itemDay}`)

        yLabels.forEach((time, yIndex) => {
            const currentHour = parseHour(time)
            console.log(currentHour)
            console.log(itemStartTime)
            console.log(itemEndTime)

            const overlaps = currentHour >= itemStartTime && currentHour < itemEndTime

            if (overlaps) {
                data[yIndex][dayIndex] += 1 // Increment the count of occupied rooms for the cell
                console.log(`Overlap found: Incrementing [${yIndex}][${dayIndex}] to ${data[yIndex][dayIndex]}`)
            } else {
                console.log(`No overlap for time slot: ${time} on day: ${itemDay}`)
            }
        })
    })

    console.log('Final data matrix:', data)

    return data
}

const MyHeatMap = () => {
    const rooms = useAtomValue(atomRooms)
    const schedule = useAtomValue(atomSchedule)
    const [data, setData] = React.useState([])
    const [startDate, setStartDate] = React.useState(null)
    const [endDate, setEndDate] = React.useState(null)
    const [roomType, setRoomType] = React.useState('')
    React.useEffect(() => {
        if (schedule.length > 0 && rooms.length > 0) {
            setData(processData(schedule, rooms, startDate, endDate, roomType))
        }
    }, [schedule, rooms, startDate, endDate, roomType])

    const sigmaStyle = { height: '75vh', width: '80%', marginTop: '70px' }

    const clear = () => {
        setRoomType('')
        setStartDate(null)
        setEndDate(null)
        setData([])
    }

    const getFilters = () => {
        const filters = []
        if (roomType) {
            filters.push((appointment) => appointment['Características da sala pedida para a aula'] === roomType)
        }
        if (startDate) {
            filters.push((appointment) => isAfter(parseDate(appointment['Data da aula']), parseDate(startDate)))
        }
        if (endDate) {
            filters.push((appointment) => isBefore(parseDate(appointment['Data da aula']), parseDate(endDate)))
        }

        return filters
    }

    // updating graph data based on the selected field and value
    const calculateGraphDate = (e) => {
        e.preventDefault()
        if (schedule.length > 0) {
            const filters = getFilters()
            const filteredData = schedule.filter((appointment) => filters.every((filter) => filter(appointment)))
            setData(filteredData)
        }
    }

    return (
        <Tooltip title={schedule.length === 0 ? 'Por favor carregue o ficheiro horário' : ''}>
            <Stack sx={{ mt: 8 }}>
                <form onSubmit={(e) => calculateGraphDate(e)}>
                    <FormControl sx={{ width: 850, marginBottom: '10px' }}>
                        <InputLabel id="label2">Tipo de sala *</InputLabel>
                        <Select
                            labelId="label1"
                            id="label1"
                            label="Tipo de sala *"
                            sx={{ height: 57 }}
                            value={roomType}
                            disabled={schedule.length === 0}
                            required
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
                                    label="Data de início"
                                    format="DD-MM-YYYY"
                                    views={['day', 'month', 'year']}
                                    value={startDate ? dayjs(startDate, 'DD/MM/YYYY') : null}
                                    disabled={schedule.length === 0}
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
                                    label="Data de fim"
                                    format="DD-MM-YYYY"
                                    views={['day', 'month', 'year']}
                                    value={endDate ? dayjs(endDate, 'DD/MM/YYYY') : null}
                                    disabled={schedule.length === 0}
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
                    <Stack direction="row" alignContent={'center'} sx={{ marginTop: '20px' }}>
                        <Button variant="contained" type="submit" disabled={schedule.length === 0}>
                            Desenhar heatmap
                        </Button>
                        <Button
                            onClick={clear}
                            sx={{ marginLeft: '8px' }}
                            variant="text"
                            disabled={schedule.length === 0}
                        >
                            Limpar campos
                        </Button>
                    </Stack>
                </form>
                <SigmaContainer style={sigmaStyle}>
                    <div style={{ width: '100%', margin: 'auto' }}>
                        {data.length > 0 && (
                            <HeatMap
                                xLabels={xLabels}
                                yLabels={yLabels}
                                data={data}
                                squares
                                height={50}
                                xLabelWidth={60}
                                yLabelWidth={80}
                                cellStyle={(background, value, min, max, data, x, y) => ({
                                    background: `rgb(0, 151, 230, ${1 - (max - value) / (max - min)})`,
                                    fontSize: '11.5px',
                                    color: '#444',
                                })}
                                cellRender={(value) => value && <div>{value}</div>}
                            />
                        )}
                    </div>
                </SigmaContainer>
            </Stack>
        </Tooltip>
    )
}

export default MyHeatMap
