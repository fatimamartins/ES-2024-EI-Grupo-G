// Inclusion filters

import { getDay, getISOWeek, isSameDay } from 'date-fns'
import { getFormattedDateTime, parseDate, parseHour } from '../utils'
import dayjs from 'dayjs'
import {
    AFTERNOON_SHIFT,
    COURSE_END_TIMES,
    COURSE_START_TIMES,
    MORNING_SHIFT,
    NIGHT_SHIFT,
    ROOMS,
    WEEKDAYS,
} from '../constants'

function doesDayMatch(rulesToInclude, slot) {
    // using date-fns to compare dates
    if (!rulesToInclude.data.value || !slot['Data da aula']) return false
    const date1 = parseDate(rulesToInclude?.data?.value.format('DD/MM/YYYY'))
    const date2 = parseDate(slot['Data da aula'])
    return isSameDay(date1, date2)
}

function isSameWeek(rulesToInclude, slot) {
    // using date-fns to compare dates
    if (!rulesToInclude.data.value || !slot['Data da aula']) return false
    const date1 = parseDate(rulesToInclude?.data.value.format('DD/MM/YYYY'))
    const date2 = parseDate(slot['Data da aula'])
    return getISOWeek(date1) === getISOWeek(date2)
}

function isBetweenDates(rulesToInclude, slot) {
    // using dayjs library
    if (!rulesToInclude.dataInicio || !rulesToInclude.dataFim || !slot['Data da aula']) return false
    const formattedDateTime = dayjs(
        getFormattedDateTime(slot['Data da aula'], slot['Hora início da aula'], "yyyy-MM-dd'T'HH:mm")
    )
    return dayjs(formattedDateTime).isBetween(rulesToInclude.dataInicio, rulesToInclude.dataFim, 'day', '[]')
}

function hasRoom(rulesToInclude, row) {
    return rulesToInclude.salas.includes(row['Sala atribuída à aula'])
}

function hasFeature(rulesToInclude, row) {
    return rulesToInclude?.caracteristicas?.includes(row['Características da sala pedida para a aula'])
}

// Exclusion filters

function doesStartHourMatch(rulesToExclude, slot) {
    if (!rulesToExclude['Hora início da aula'] || !slot['Hora início da aula']) return false
    return rulesToExclude['Hora início da aula'] === slot['Hora início da aula']
}

function doesEndHourMatch(rulesToExclude, slot) {
    if (!rulesToExclude['Hora fim da aula'] || !slot['Hora fim da aula']) return false
    return rulesToExclude['Hora fim da aula'] === slot['Hora fim da aula']
}

function isBetweenHours(rulesToExclude, slot) {
    if (
        !rulesToExclude['Hora início da aula'] ||
        !rulesToExclude['Hora fim da aula'] ||
        !slot['Hora início da aula'] ||
        !slot['Hora fim da aula']
    )
        return false
    const slotStartHour = parseHour(slot['Hora início da aula'])
    const slotEndHour = parseHour(slot['Hora fim da aula'])
    const appointmentStartHour = parseHour(rulesToExclude['Hora início da aula'])
    const appointmentEndHour = parseHour(rulesToExclude['Hora fim da aula'])
    return (
        (slotStartHour >= appointmentStartHour && slotStartHour <= appointmentEndHour) ||
        (slotEndHour <= appointmentEndHour && slotEndHour >= appointmentStartHour)
    )
}

function isSameWeekDay(rulesToExclude, slot) {
    if (!rulesToExclude.diaDaSemana || !slot['Data da aula']) return false
    const day1Index = WEEKDAYS.indexOf(rulesToExclude?.diaDaSemana) + 1
    const day2Index = getDay(parseDate(slot?.data)) // getDay returns 0 for Sunday but our WEEKDAYS array starts at Monday
    if (day2Index === 0) return false // skip Sundays
    return day1Index === day2Index
}

function isSameShift(rulesToExclude, slot) {
    if (!rulesToExclude.turno || !slot['Hora início da aula']) return false
    if (rulesToExclude.turno === 'Manhã') {
        return MORNING_SHIFT.includes(slot['Hora início da aula'])
    } else if (rulesToExclude.turno === 'Tarde') {
        return AFTERNOON_SHIFT.includes(slot['Hora início da aula'])
    } else if (rulesToExclude.turno === 'Noite') {
        return NIGHT_SHIFT.includes(slot['Hora início da aula'])
    } else {
        return false
    }
}

// Functions to determine which filters to should be applied

function getFiltersIncludeToApply(rulesToInclude) {
    const filters = []
    if (rulesToInclude?.salas?.length > 0) {
        filters.push(hasRoom)
    }
    if (rulesToInclude?.caracteristicas?.length > 0) {
        filters.push(hasFeature)
    }
    if (rulesToInclude?.data?.label === 'mesmoDia') {
        filters.push(doesDayMatch)
    }
    if (rulesToInclude?.data?.label === 'mesmaSemana') {
        filters.push(isSameWeek)
    }
    if (rulesToInclude?.data?.label === 'outro') {
        filters.push(isBetweenDates)
    }
    return filters
}

function getFiltersExcludeToApply(rulesToExclude) {
    const filters = []
    if (rulesToExclude?.['Hora início da aula'] && !rulesToExclude?.['Hora fim da aula']) {
        filters.push(doesStartHourMatch)
    }
    if (rulesToExclude?.['Hora fim da aula'] && !rulesToExclude?.['Hora início da aula']) {
        filters.push(doesEndHourMatch)
    }
    if (rulesToExclude?.['Hora início da aula'] && rulesToExclude?.['Hora fim da aula']) {
        filters.push(isBetweenHours)
    }
    if (rulesToExclude?.diaDaSemana) {
        filters.push(isSameWeekDay)
    }
    if (rulesToExclude?.turno) {
        filters.push(isSameShift)
    }
    if (rulesToExclude?.salas?.length > 0) {
        filters.push(hasRoom)
    }
    return filters
}

// Calculate all slots available for a given time interval

function getAllSlots(rulesToInclude) {
    const combinations = []
    const startDate =
        rulesToInclude?.data?.label === 'outro' ||
        rulesToInclude?.data?.label === 'nenhuma' ||
        !rulesToInclude?.data?.label
            ? rulesToInclude?.dataInicio
            : rulesToInclude?.data?.value
    const endDate = getEndDate(rulesToInclude)
    const days = getDatesExcludingSundays(startDate, endDate)
    const daysArray = days.length === 0 ? [startDate.format('DD/MM/YYYY')] : days

    for (let i = 0; i < COURSE_START_TIMES.length; i++) {
        for (let e = 0; e < COURSE_END_TIMES.length; e++) {
            for (let j = 0; j < ROOMS.length; j++) {
                for (let k = 0; k < daysArray.length; k++) {
                    if (COURSE_START_TIMES[i] < COURSE_END_TIMES[e]) {
                        combinations.push({
                            'Hora início da aula': COURSE_START_TIMES[i],
                            'Hora fim da aula': COURSE_END_TIMES[e],
                            'Sala atribuída à aula': ROOMS[j],
                            'Data da aula': daysArray[k],
                        })
                    }
                }
            }
        }
    }
    return combinations
}

function getEndDate(rulesToInclude) {
    if (rulesToInclude?.data?.label === 'mesmoDia') {
        return rulesToInclude?.data?.value
    } else if (rulesToInclude?.data?.label === 'mesmaSemana') {
        const dayOfWeek = rulesToInclude?.data?.value.day()
        const daysRemaining = 6 - dayOfWeek
        return rulesToInclude?.data?.value.add(daysRemaining, 'day')
    } else if (rulesToInclude?.data?.label === 'outro') {
        return rulesToInclude?.dataFim
    } else {
        // if the user doesn't specify a time interval we generate slots for the same day
        return rulesToInclude?.dataInicio
    }
}

function getDatesExcludingSundays(startDate, endDate) {
    const result = []
    let currentDate = startDate

    while (currentDate.isBefore(endDate)) {
        if (currentDate.day() !== 0) {
            // 0 represents Sunday
            result.push(currentDate.format('DD/MM/YYYY'))
        }
        currentDate = currentDate.add(1, 'day')
    }
    result.push(endDate.format('DD/MM/YYYY'))

    return result
}

// Transform schedule and slots array into a map for easier access

function mkId(entry) {
    return `${entry['Data da aula']}-${entry['Hora início da aula']}-${entry['Hora fim da aula']}-${entry['Sala atribuída à aula']}`
}

function mkSheduleMap(appointments) {
    const map = new Map()
    appointments.forEach((appointment) => {
        const id = mkId(appointment)
        map.set(id, appointment)
    })
    return map
}

// Remove slots that are already in the schedule
function removeSheduledSlots(map, slots) {
    return slots.reduce((acc, slot) => {
        const id = mkId(slot)
        return map.has(id) ? acc : [...acc, slot]
    }, [])
}

// Lookup function which returns the available slots

export function lookupSlots(rulesToInclude, rulesToExclude, schedule) {
    // Get all available slots for a given interval of time
    const allSlots = getAllSlots(rulesToInclude)

    // Remove all slots that match the exclusion filters
    const filtersExcludeToApply = getFiltersExcludeToApply(rulesToExclude)
    const slotsWithoutExclusionRules = allSlots.filter(
        (slot) => !filtersExcludeToApply.some((filter) => filter(rulesToExclude, slot))
    )

    // Filter the slots that match the inclusion filters
    const filtersIncludeToApply = getFiltersIncludeToApply(rulesToInclude)
    const filteredSlots = slotsWithoutExclusionRules.filter((slot) =>
        filtersIncludeToApply.every((filter) => filter(rulesToInclude, slot))
    )

    const scheduleMap = mkSheduleMap(schedule)

    const slotsWithoutScheduleClasses = removeSheduledSlots(scheduleMap, filteredSlots)

    return slotsWithoutScheduleClasses
}
