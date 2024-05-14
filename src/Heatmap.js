/**
 * @file Heatmap.js
 * This is the page with the schedule and rooms.
 */

/** @module App.css */
import './App.css'
/** @module react */
import React from 'react'
/**
 * @module @mui/material
 * Material UI components used in this file.
 */
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
/**
 * @module jotai
 * State management library used in this file.
 */
import { useAtomValue } from 'jotai'
/**
 * @module atoms/schedule
 * Atom representing the schedule state.
 */
import { atomSchedule } from './atoms/schedule'
/**
 * @module atoms/rooms
 * Atom representing the rooms state.
 */
import { atomRooms } from './atoms/rooms'
/**
 * @module constants
 * Constants used in this file.
 */
import { COURSE_END_TIMES, COURSE_START_TIMES, ROOM_FEATURES } from './constants'
/**
 * @module @mui/x-date-pickers
 * Date picker components used in this file.
 */
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
/**
 * @module @mui/x-date-pickers/internals/demo
 * Demo container component used in this file.
 */
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
/**
 * @module @mui/x-date-pickers/AdapterDayjs
 * Adapter for the date picker to use Day.js.
 */
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
/**
 * @module dayjs
 * Date library used in this file.
 */
import dayjs from 'dayjs'
/**
 * @module react-heatmap-grid
 * Heatmap grid component used in this file.
 */
import HeatMap from 'react-heatmap-grid'
/**
 * @module utils
 * Utility functions used in this file.
 */
import { parseDate, parseHour } from './utils'
/**
 * @module date-fns
 * Date utility functions used in this file.
 */
import { eachDayOfInterval, format } from 'date-fns'

/**
 * @constant
 * @type {string[]}
 * @name defaultTypeOfFilterComparison
 * @description An array of strings representing the default types of filter comparisons.
 */
const defaultTypeOfFilterComparison = ['=', '<', '>']

/**
 * @function
 * @name Heatmap
 * @description A function component that renders the heatmap.
 * @returns {JSX.Element} The rendered heatmap.
 */
export default function Heatmap() {
    /**
     * @constant
     * @type {Object}
     * @name schedule
     * @description The schedule state, retrieved from the atom.
     */
    const schedule = useAtomValue(atomSchedule)
    /**
     * @constant
     * @type {Object}
     * @name rooms
     * @description The rooms state, retrieved from the atom.
     */
    const rooms = useAtomValue(atomRooms)
    /**
     * @constant
     * @type {Array}
     * @name roomType
     * @description The room type state and its setter function.
     */
    const [roomType, setRoomType] = React.useState('')
    /**
     * @constant
     * @type {Array}
     * @name startDate
     * @description The start date state and its setter function.
     */
    const [startDate, setStartDate] = React.useState(null)
    /**
     * @constant
     * @type {Array}
     * @name endDate
     * @description The end date state and its setter function.
     */
    const [endDate, setEndDate] = React.useState(null)
    /**
     * @constant
     * @type {Array}
     * @name roomCapacity
     * @description The room capacity state and its setter function.
     */
    const [roomCapacity, setRoomCapacity] = React.useState(null)
    /**
     * @constant
     * @type {Array}
     * @name capacityLogicOperator
     * @description The capacity logic operator state and its setter function.
     */
    const [capacityLogicOperator, setCapacityLogicOperator] = React.useState('>')
    /**
     * @constant
     * @type {Array}
     * @name isBusy
     * @description The busy state and its setter function.
     */
    const [isBusy, setIsBusy] = React.useState(true)
    /**
     * @constant
     * @type {Array}
     * @name heatmapData
     * @description The heatmap data state and its setter function.
     */
    const [heatmapData, setHeatmapData] = React.useState([])
    /**
     * @constant
     * @type {Array}
     * @name xLabels
     * @description The x-axis labels state and its setter function. It changes according to the selected date range.
     */
    const [xLabels, setXLabels] = React.useState([]) // it changes according to the selected date range
    /**
     * @constant
     * @type {Array}
     * @name yLabels
     * @description An array of strings representing the y-axis labels of the heatmap.
     */
    const yLabels = [...new Set([...COURSE_START_TIMES, ...COURSE_END_TIMES])]
    /**
     * @constant
     * @type {Array}
     * @name isWithinRange
     * @description The within range state and its setter function.
     */
    const [isWithinRange, setIsWithinRange] = React.useState(true)

    /**
     * @function
     * @name clear
     * @description A function that clears the state variables.
     */
    const clear = () => {
        setRoomType('')
        setStartDate(null)
        setEndDate(null)
        setRoomCapacity(null)
        setHeatmapData([])
        setIsWithinRange(true)
    }

    /**
     * @function
     * @name checkIsWithinRange
     * @description A function that checks if the selected date range is within 31 days.
     * @param {Date} start - The start date.
     * @param {Date} end - The end date.
     */
    const checkIsWithinRange = (start, end) => {
        if (start === null || end === null) return
        const dates = eachDayOfInterval({ start: parseDate(startDate), end: parseDate(end) })
        dates.length <= 31 ? setIsWithinRange(true) : setIsWithinRange(false)
    }

    /**
     * @function
     * @name getRoomsByCapacity
     * @description A function that filters the rooms by their capacity.
     * @returns {Array} The filtered rooms.
     */
    const getRoomsByCapacity = () => {
        return roomCapacity
            ? rooms.filter((room) => {
                  if (capacityLogicOperator === '=') {
                      return room['Capacidade Normal'] === parseInt(roomCapacity)
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

    /**
     * @function
     * @name getDataRange
     * @description A function that gets the date range based on the selected start and end dates, updates the xLabels and returns an array of string dates.
     * @returns {Array} The date range.
     */
    // Get the date range based on the selected start and end dates, updates the xLabels and return an array of strings dates
    const getDataRange = () => {
        const dates = eachDayOfInterval({ start: parseDate(startDate), end: parseDate(endDate) })
        setXLabels(dates.map((date) => format(date, 'dd')))
        return dates.map((date) => format(date, 'dd/MM/yyyy'))
    }

    /**
     * @function
     * @name processData
     * @description A function that processes the data to generate a heatmap.
     * @param {Array} roomsFilteredByCapacity - The rooms filtered by capacity.
     * @param {Array} dateRange - The date range.
     * @returns {Array} The processed data for the heatmap.
     */
    function processData(roomsFilteredByCapacity, dateRange) {
        // Create a matrix of zeros with the same dimensions as the heatmap
        const data = new Array(yLabels.length).fill(0).map(() => new Array(dateRange.length).fill(0))

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
                return
            }

            const itemStartTime = parseHour(item['Hora início da aula'])
            const itemEndTime = parseHour(item['Hora fim da aula'])

            // Find the index of the day in the xLabels array
            const dayIndex = dateRange.indexOf(item['Data da aula'])
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

        if (isBusy) {
            return data
        } else {
            const totalRooms = roomsFilteredByCapacity.length
            return data.map((row) => row.map((value) => totalRooms - value))
        }
    }

    /**
     * @function
     * @name calculateHeatmap
     * @description A function that generates a heatmap based on the selected filters.
     * @param {Event} e - The event object.
     */
    // Generate heatmap based on the selected filters
    const calculateHeatmap = (e) => {
        setHeatmapData([]) // clear the heatmap data before calculating a new one
        e.preventDefault()
        // get an array of string dates based on the selected date range
        const dateRange = getDataRange()
        // get rooms that match the room capacity filter
        const roomsFiltered = getRoomsByCapacity()
        // process the data to generate the heatmap
        const data = processData(roomsFiltered, dateRange)
        setHeatmapData(data)
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
                            checked={isBusy}
                            inputProps={{ 'aria-label': 'ant design' }}
                            onChange={(e, c) => setIsBusy(c)}
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
                    <Tooltip title={!isWithinRange ? 'Selecione um intervalo de datas inferior a 31 dias' : ''}>
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
                                            checkIsWithinRange(dateString, endDate)
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
                                            if (newValue.isValid()) {
                                                const dateString = newValue.format('DD/MM/YYYY')
                                                checkIsWithinRange(startDate, dateString)
                                                setEndDate(dateString)
                                            }
                                        }}
                                        sx={{ width: '420px' }}
                                        minDate={startDate ? dayjs(startDate, 'DD/MM/YYYY') : null}
                                        maxDate={startDate ? dayjs(startDate, 'DD/MM/YYYY').add(1, 'month') : null}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Stack>
                    </Tooltip>
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
                                value={roomCapacity || ''}
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
                                schedule.length === 0 ||
                                rooms.length === 0 ||
                                startDate === null ||
                                endDate === null ||
                                startDate === 'Invalid Date' ||
                                endDate === 'Invalid Date' ||
                                !isWithinRange // monthly view of the heatmap
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
                <Stack mt={6}>
                    <LoadHeatmap heatmapData={heatmapData} xLabels={xLabels} yLabels={yLabels} />
                </Stack>
            </Stack>
        </Tooltip>
    )
}

/**
 * @function
 * @name LoadHeatmap
 * @description A function component that renders a HeatMap component with the provided data, labels, and styling.
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.heatmapData - The data for the heatmap.
 * @param {Array} props.formattedXLabels - The labels for the x-axis.
 * @param {Array} props.yLabels - The labels for the y-axis.
 * @returns {JSX.Element} The HeatMap component.
 */
const LoadHeatmap = ({ heatmapData, xLabels, yLabels }) => {
    if (heatmapData.length === 0) return null
    return (
        <HeatMap
            xLabels={xLabels}
            yLabels={yLabels}
            data={heatmapData}
            squares
            yLabelWidth={80}
            cellStyle={(background, value, min, max, data, x, y) => ({
                background: `rgb(32, 95, 200, ${1 - (max - value) / (max - min)})`,
                fontSize: '12px',
                color: `${value === 0 ? 'white' : 'black'}`,
                borderRadius: '2px',
            })}
            cellRender={(value) => value && <div>{value}</div>}
        />
    )
}
