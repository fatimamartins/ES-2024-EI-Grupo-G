/**
 * @file This is the page with the schedule and rooms.
 */

/** @module App.css */
import './App.css'
/** @module react */
import React from 'react'

import 'react-tabulator/lib/css/tabulator.min.css'
import 'react-tabulator/lib/styles.css'
// import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css'
// import 'react-tabulator/css/semantic-ui/tabulator_semantic-ui.css'
import 'react-tabulator/css/tabulator_bootstrap3.css'

import { Group } from '@visx/group'
import genBins from '@visx/mock-data/lib/generators/genBins'
import { scaleLinear } from '@visx/scale'
import { HeatmapRect } from '@visx/heatmap'
import { getSeededRandom } from '@visx/mock-data'

const cool1 = '#FFFFFF' // Tom de vermelho
const cool2 = '#E63946' // Outra cor qualquer
export const background = '#28272c' // Cor de fundo

const seededRandom = getSeededRandom(2)

const binData = genBins(
    16,
    16,
    (idx) => 150 * idx,
    (i, number) => 25 * (number - i) * seededRandom()
)

function max(data, value) {
    return Math.max(...data.map(value))
}

const bins = (d) => d.bins
const count = (d) => d.count

const colorMax = max(binData, (d) => max(bins(d), count))
const bucketSizeMax = max(binData, (d) => bins(d).length)

const xScale = scaleLinear({
    domain: [0, binData.length],
})
const yScale = scaleLinear({
    domain: [0, bucketSizeMax],
})
const rectColorScale = scaleLinear({
    range: [cool1, cool2],
    domain: [0, colorMax],
})

const defaultMargin = { top: 10, left: 30, right: 30, bottom: 50 }

export default function Home({ width = 600, height = 500, events = true, margin = defaultMargin, separation = 0 }) {
    console.log('Width:', width, 'Height:', height)
    const size = width > margin.left + margin.right ? width - margin.left - margin.right - separation : width
    const xMax = size
    const yMax = height - margin.bottom - margin.top

    const binWidth = xMax / binData.length
    const binHeight = yMax / bucketSizeMax

    xScale.range([0, xMax])
    yScale.range([yMax, 0])

    return width < 10 ? null : (
        <svg width={width} height={height}>
            <rect x={0} y={0} width={width} height={height} rx={14} fill={background} />
            <Group top={margin.top} left={margin.left}>
                <HeatmapRect
                    data={binData}
                    xScale={(d) => xScale(d) ?? 0}
                    yScale={(d) => yScale(d) ?? 0}
                    colorScale={rectColorScale}
                    binWidth={binWidth}
                    binHeight={binHeight}
                    gap={2}
                >
                    {(heatmap) =>
                        heatmap.map((heatmapBins) =>
                            heatmapBins.map((bin) => (
                                <rect
                                    key={`heatmap-rect-${bin.row}-${bin.column}`}
                                    className="visx-heatmap-rect"
                                    width={bin.width}
                                    height={bin.height}
                                    x={bin.x}
                                    y={bin.y}
                                    fill={bin.color}
                                    fillOpacity={bin.opacity}
                                    onClick={() => {
                                        if (!events) return
                                        const { row, column } = bin
                                        alert(JSON.stringify({ row, column, bin: bin.bin }))
                                    }}
                                />
                            ))
                        )
                    }
                </HeatmapRect>
            </Group>
        </svg>
    )
}
