import React from 'react'
import { useAtomValue } from 'jotai'
import HeatMap from 'react-heatmap-grid'
import { atomRooms } from './atoms/rooms'
import { atomSchedule } from './atoms/schedule'
import { ROOMS } from './constants'
import { parseHour, parseDate } from './utils'

const xLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const yLabels = []
for (let hour = 8; hour <= 22; hour++) {
    yLabels.push(`${hour}:00:00`)
    if (hour !== 23) {
        // Assuming 22:30 is the last label you want
        yLabels.push(`${hour}:30:00`)
    }
}

function processData(scheduleData, targetDate) {
    const formattedDate = parseDate('03/09/2022') // Converts string to Date object

    console.log('data do horário: ', scheduleData)
    console.log('Constructed Date object:', formattedDate)

    // const data = yLabels.map(() => new Array(xLabels.length).fill(0))
    const data = new Array(yLabels.length).fill(0).map(() => new Array(xLabels.length).fill(0))

    scheduleData.forEach((item) => {
        if (!item['Data da aula']) return
        const scheduleDate = parseDate(item['Data da aula'])
        console.log(item)
        console.log('Constructed Date schedule object:', scheduleDate)

        // Only process entries for the specific date
        if (scheduleDate.getTime() !== formattedDate.getTime()) {
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

            const overlaps = currentHour >= itemStartTime && currentHour <= itemEndTime

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
    React.useEffect(() => {
        if (schedule.length > 0 && rooms.length > 0) {
            setData(processData(schedule, rooms))
        }
    }, [schedule, rooms])
    // Process data to fit into the heatmap format
    // const data = processData(defaultData, defaultScheduleData) // You'll need to write this function based on how your data needs to be displayed
    console.log('xixi: ', data)
    return (
        <div style={{ width: '100%', margin: 'auto' }}>
            {data.length > 0 && (
                <HeatMap
                    xLabels={xLabels}
                    yLabels={yLabels}
                    data={data}
                    squares
                    height={50}
                    xLabelWidth={60}
                    cellStyle={(background, value, min, max, data, x, y) => ({
                        background: `rgb(0, 151, 230, ${1 - (max - value) / (max - min)})`,
                        fontSize: '11.5px',
                        color: '#444',
                    })}
                    cellRender={(value) => value && <div>{value}</div>}
                />
            )}
        </div>
    )
}

export default MyHeatMap
