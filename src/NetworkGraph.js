/**
 * @file NetworkGraph.js
 * This file contains the page with the network graph of the lessons conflicts.
 */

/** @module react */
import React, { useEffect } from 'react'

/**
 * @module date-fns/isAfter
 * @module date-fns/isBefore
 */
import { isAfter, isBefore } from 'date-fns'
/**
 * @module @mui/material/Button
 * @module @mui/material/Checkbox
 * @module @mui/material/FormControl
 * @module @mui/material/InputLabel
 * @module @mui/material/ListItemText
 * @module @mui/material/MenuItem
 * @module @mui/material/Select
 * @module @mui/material/Stack
 * @module @mui/material/TextField
 * @module @mui/material/Tooltip
 */
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
/** @module jotai/useAtomValue */
import { useAtomValue } from 'jotai'
/** @module atoms/schedule */
import { atomSchedule } from './atoms/schedule'
/** @module graphology */
import Graph from 'graphology'
/** @module @react-sigma/core */
import { SigmaContainer, useLoadGraph } from '@react-sigma/core'
/** @module @react-sigma/core/lib/react-sigma.min.css */
import '@react-sigma/core/lib/react-sigma.min.css'
/** @module utils */
import { getCourseDurationToMilliseconds, parseDate, randomColor } from './utils'
/** @module constants */
import { ROOM_FEATURES } from './constants'
/** @module @mui/x-date-pickers/DatePicker */
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
/** @module @mui/x-date-pickers/LocalizationProvider */
import { LocalizationProvider } from '@mui/x-date-pickers'
/** @module @mui/x-date-pickers/internals/demo */
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
/** @module @mui/x-date-pickers/AdapterDayjs */
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
/** @module dayjs */
import dayjs from 'dayjs'

/** @constant {number} ITEM_HEIGHT - The height of each item in the select menu. */
const ITEM_HEIGHT = 48
/** @constant {number} ITEM_PADDING_TOP - The padding at the top of each item in the select menu. */
const ITEM_PADDING_TOP = 8
/** @constant {object} MenuProps - The properties for the select menu. */
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 50,
        },
    },
}

/**
 * @function
 * @name NetworkGraph
 * @description This is a React component that renders the network graph of the lessons conflicts. It uses various state variables and hooks to manage and display the data. The graph is rendered using the SigmaContainer component from the @react-sigma/core library.
 *
 * @returns {JSX.Element} The rendered NetworkGraph component.
 */
export default function NetworkGraph() {
    /**
     * @constant schedule - The schedule data retrieved from the atomSchedule atom using the useAtomValue hook from jotai.
     */
    const schedule = useAtomValue(atomSchedule)
    /**
     * @constant roomType - The state variable for the room type. It is initialized as an empty string.
     * @function setRoomType - The setter function for updating the roomType state.
     */
    const [roomType, setRoomType] = React.useState('')
    /**
     * @constant courses - The state variable for the courses. It is initialized as an empty array.
     * @function setCourses - The setter function for updating the courses state.
     */
    const [courses, setCourses] = React.useState([])
    /**
     * @constant selectedCourses - The state variable for the selected courses. It is initialized as an empty array.
     * @function setSelectedCourses - The setter function for updating the selectedCourses state.
     */
    const [selectedCourses, setSelectedCourses] = React.useState([])
    /**
     * @constant startDate - The state variable for the start date. It is initialized as null.
     * @function setStartDate - The setter function for updating the startDate state.
     */
    const [startDate, setStartDate] = React.useState(null)
    /**
     * @constant endDate - The state variable for the end date. It is initialized as null.
     * @function setEndDate - The setter function for updating the endDate state.
     */
    const [endDate, setEndDate] = React.useState(null)
    /**
     * @constant degrees - The state variable for the degrees. It is initialized as an empty array.
     * @function setDegrees - The setter function for updating the degrees state.
     */
    const [degrees, setDegrees] = React.useState([])
    /**
     * @constant selectedDegrees - The state variable for the selected degrees. It is initialized as an empty array.
     * @function setSelectedDegrees - The setter function for updating the selectedDegrees state.
     */
    const [selectedDegrees, setSelectedDegrees] = React.useState([])
    /**
     * @constant correlation - The state variable for the correlation. It is initialized as 0.34.
     * @function setCorrelation - The setter function for updating the correlation state.
     */
    const [correlation, setCorrelation] = React.useState(0.34)
    /**
     * @constant graphData - The state variable for the graph data. It is initialized as an empty array.
     * @function setGraphData - The setter function for updating the graphData state.
     */
    const [graphData, setGraphData] = React.useState([])
    /**
     * @constant displayGraph - The state variable for the display graph flag. It is initialized as false.
     * @function setDisplayGraph - The setter function for updating the displayGraph state.
     */
    const [displayGraph, setDisplayGraph] = React.useState(false)

    /**
     * @function useEffect
     * @description React hook that is triggered when the schedule or setCourses changes. It populates the degrees and courses sets with unique values from the schedule, then updates the state variables for courses and degrees.
     */
    // get list of degrees and courses
    React.useEffect(() => {
        if (schedule?.length > 0) {
            const degrees = new Set()
            const courses = new Set()
            schedule.forEach((item) => {
                degrees.add(item.Curso)
                courses.add(item['Unidade Curricular'])
            })
            setCourses([...courses])
            setDegrees([...degrees])
        }
    }, [schedule, setCourses])

    /**
     * @function clear
     * @description Function that resets all the state variables to their initial states.
     */
    const clear = () => {
        setRoomType('')
        setSelectedCourses([])
        setStartDate(null)
        setEndDate(null)
        setSelectedDegrees([])
        setGraphData([])
        setCorrelation('')
    }

    /**
     * @function getFilters
     * @description Function that creates an array of filter functions based on the current state of the roomType, selectedDegrees, selectedCourses, startDate, and endDate variables.
     * @returns {Array} An array of filter functions.
     */
    const getFilters = () => {
        const filters = []
        if (roomType) {
            filters.push((appointment) => appointment['Características da sala pedida para a aula'] === roomType)
        }
        if (selectedDegrees.length > 0) {
            filters.push((appointment) => selectedDegrees.includes(appointment.Curso))
        }
        if (selectedCourses.length > 0) {
            filters.push((appointment) => selectedCourses.includes(appointment['Unidade Curricular']))
        }
        if (startDate) {
            filters.push((appointment) => isAfter(parseDate(appointment['Data da aula']), parseDate(startDate)))
        }
        if (endDate) {
            filters.push((appointment) => isBefore(parseDate(appointment['Data da aula']), parseDate(endDate)))
        }

        return filters
    }

    /**
     * @function calculateGraphDate
     * @description Function that is triggered on form submission. It applies all the filters from getFilters to the schedule and updates the graphData state variable with the filtered data.
     * @param {Event} e - The form submission event.
     */
    // updating graph data based on the selected field and value
    const calculateGraphDate = (e) => {
        e.preventDefault()
        if (schedule.length > 0) {
            const filters = getFilters()
            const filteredData = schedule.filter((appointment) => filters.every((filter) => filter(appointment)))
            setGraphData(filteredData)
            setDisplayGraph(true)
        }
    }

    // creating the graph, nodes and edges
    const map = new Map()
    graphData.forEach((appointment) => {
        const id = appointment.Curso
        const appoitmentDuration = getCourseDurationToMilliseconds(
            appointment['Hora início da aula'],
            appointment['Hora fim da aula']
        )
        if (map.has(id)) {
            map.set(id, map.get(id) + appoitmentDuration)
        } else {
            map.set(id, appoitmentDuration)
        }
    })

    /**
     * @function checkRelation
     * @description Function that checks if two nodes are related based on their weights. Nodes are considered related if the absolute difference between their weights divided by the sum of their weights is less than or equal to the correlation.
     * @param {number} node1 - The weight of the first node.
     * @param {number} node2 - The weight of the second node.
     * @returns {boolean} True if the nodes are related, false otherwise.
     */
    const checkRelation = (node1, node2) => {
        const diff = Math.abs(node1 - node2)
        if (diff === 0) return false
        // By default nodes are related if difference between them is less than correlation
        return diff / (node1 + node2) <= correlation
    }
    const potencialNodes = [...map.keys()]
    const nodes = new Set()
    const edges = []

    for (let i = 0; i < potencialNodes.length; i++) {
        for (let j = i + 1; j < potencialNodes.length; j++) {
            const node1 = potencialNodes[i]
            const node2 = potencialNodes[j]
            const weight1 = map.get(node1)
            const weight2 = map.get(node2)
            const hasRelation = checkRelation(weight1, weight2)
            if (hasRelation) {
                nodes.add(node1)
                nodes.add(node2)
                edges.push({ node1, node2, weight: weight1 < weight2 ? weight1 : weight2 })
            }
        }
    }

    // Component that load the graph
    const sigmaStyle = { height: '75vh', width: '80%', marginTop: '70px' }

    /**
     * @function LoadGraph
     * @description React component that loads the graph into the SigmaContainer. It creates a new Graph object, adds nodes and edges to it based on the nodes and edges arrays, then loads the graph using the useLoadGraph hook.
     * @returns {null} The component does not render anything.
     */
    const LoadGraph = () => {
        // Hook to load the graph
        const loadGraph = useLoadGraph()

        useEffect(() => {
            const graph = new Graph()
            nodes.forEach((node) => {
                graph.addNode(node, {
                    x: Math.random(),
                    y: Math.random(),
                    size: 15,
                    label: node,
                    color: randomColor(),
                })
            })
            edges.forEach((edge) => {
                const durationInHours = edge.weight / 3600000
                graph.addEdge(edge.node1, edge.node2, {
                    size: 3,
                    label: durationInHours.toString(),
                    labelThreshold: 0,
                })
            })

            // Load the graph in sigma
            loadGraph(graph)
        }, [loadGraph])

        return null
    }

    /**
     * @function useMemo
     * @description React hook that memoizes the settings object for the SigmaContainer. The settings object is only recalculated if its dependencies change.
     * @returns {Object} The settings object for the SigmaContainer.
     */
    const settings = React.useMemo(() => {
        return {
            renderEdgeLabels: true,
        }
    }, [])

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
                    <FormControl sx={{ width: '850px', marginBottom: '10px' }}>
                        <InputLabel id="label2">Cursos</InputLabel>
                        <Select
                            labelId="label2"
                            id="label2"
                            multiple
                            value={selectedDegrees}
                            onChange={(e) => {
                                setSelectedDegrees(e.target.value)
                            }}
                            label="Cursos"
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                            disabled={schedule.length === 0}
                        >
                            {degrees &&
                                degrees.map((degree, index) => (
                                    <MenuItem key={index} value={degree}>
                                        <Checkbox checked={selectedDegrees?.indexOf(degree) > -1} />
                                        <ListItemText primary={degree} />
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: '850px', marginBottom: '10px' }}>
                        <InputLabel id="label3">Unidades Curricular</InputLabel>
                        <Select
                            labelId="label3"
                            id="label3"
                            multiple
                            value={selectedCourses}
                            onChange={(e) => {
                                setSelectedCourses(e.target.value)
                            }}
                            label="Unidades Curricular"
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                            disabled={schedule.length === 0}
                        >
                            {courses &&
                                courses.map((course, index) => (
                                    <MenuItem key={index} value={course}>
                                        <Checkbox checked={selectedCourses?.indexOf(course) > -1} />
                                        <ListItemText primary={course} />
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
                    <FormControl sx={{ width: '850px', marginTop: '10px' }}>
                        <TextField
                            type="number"
                            id="label4"
                            placeholder="Fator de correlação entre 0 e 1"
                            label="Fator de correlação"
                            variant="outlined"
                            disabled={schedule.length === 0}
                            required
                            value={correlation}
                            onChange={(event) => {
                                setCorrelation(event.target.value)
                            }}
                            InputProps={{ inputProps: { min: 0, max: 1, step: 0.01 } }}
                        />
                        <span style={{ marginTop: '5px', fontSize: '10px', fontWeight: '600' }}>
                            Nota: Um fator de correlação igual a 0,34 significa que apenas exite relação entre dois
                            cursos se a diferença entre si (número de horas de ocupação para um tipo de sala) for
                            inferior ou igual a 34%
                        </span>
                    </FormControl>
                    <Stack direction="row" alignContent={'center'} sx={{ marginTop: '20px' }}>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={
                                schedule.length === 0 || startDate === 'Invalid Date' || endDate === 'Invalid Date'
                            }
                        >
                            Desenhar grafo
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
                {displayGraph && edges.length === 0 ? (
                    <Stack sx={{ marginTop: '100px' }}>
                        <div
                            style={{
                                color: 'rgb(32, 95, 200)',
                                fontSize: '20px',
                                fontWeight: '600',
                                marginRight: 'auto',
                                marginLeft: 'auto',
                            }}
                        >
                            Não foram encontradas relações entre os cursos
                        </div>
                    </Stack>
                ) : (
                    <SigmaContainer style={sigmaStyle} settings={settings}>
                        <LoadGraph />
                    </SigmaContainer>
                )}
            </Stack>
        </Tooltip>
    )
}
