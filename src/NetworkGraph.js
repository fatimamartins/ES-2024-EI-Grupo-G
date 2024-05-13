/**
 * @file This is the page with the network graph of the lessons conflicts.
 */

/** @module react */
import React, { useEffect } from 'react'

import { isAfter, isBefore } from 'date-fns'
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
import { useAtomValue } from 'jotai'
import { atomSchedule } from './atoms/schedule'
import Graph from 'graphology'
import { SigmaContainer, useLoadGraph } from '@react-sigma/core'
import '@react-sigma/core/lib/react-sigma.min.css'
import { getCourseDurationToMilliseconds, parseDate, randomColor } from './utils'
import { ROOM_FEATURES } from './constants'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
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

export default function NetworkGraph() {
    const schedule = useAtomValue(atomSchedule)
    const [roomType, setRoomType] = React.useState('')
    const [courses, setCourses] = React.useState([])
    const [selectedCourses, setSelectedCourses] = React.useState([])
    const [startDate, setStartDate] = React.useState(null)
    const [endDate, setEndDate] = React.useState(null)
    const [degrees, setDegrees] = React.useState([])
    const [selectedDegrees, setSelectedDegrees] = React.useState([])
    const [correlation, setCorrelation] = React.useState(1)
    const [graphData, setGraphData] = React.useState([])

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

    const clear = () => {
        setRoomType('')
        setSelectedCourses([])
        setStartDate(null)
        setEndDate(null)
        setSelectedDegrees([])
        setGraphData([])
    }

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

    // updating graph data based on the selected field and value
    const calculateGraphDate = (e) => {
        e.preventDefault()
        if (schedule.length > 0) {
            const filters = getFilters()
            const filteredData = schedule.filter((appointment) => filters.every((filter) => filter(appointment)))
            setGraphData(filteredData)
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
    console.log('🚀 ~ graphData.forEach ~ graphData:', graphData)

    console.log('🚀 ~ Home ~ map:', map)
    const checkRelation = (node1, node2) => {
        const diff = Math.abs(node1 - node2)
        if (diff === 0) return false
        // By default nodes are related if difference between them is less than 34%
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
            // Apply the layout
        }, [loadGraph])

        return null
    }

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
                        <Button variant="contained" type="submit" disabled={schedule.length === 0}>
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
                <SigmaContainer style={sigmaStyle} settings={settings}>
                    <LoadGraph />
                </SigmaContainer>
            </Stack>
        </Tooltip>
    )
}
